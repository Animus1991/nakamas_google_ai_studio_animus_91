const fs = require('fs');
const path = require('path');

const srcDirs = [path.join(__dirname, 'src', 'pages'), path.join(__dirname, 'src', 'components')];

function processDir(dir) {
    if (!fs.existsSync(dir)) return;
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            processDir(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            let code = fs.readFileSync(fullPath, 'utf8');
            let modified = false;

            // We need to match className strings carefully.
            // A regular expression to match className="..." or `...`
            // It's hard to match JSX with simple regex, but let's try to match double-quoted class strings
            // that contain a dark bg AND text-black.
            
            const darkBgRegexStr = '(?<!hover:|focus:|active:|disabled:|dark:)(?:bg-[#][0-9a-fA-F]{6}|bg-(?:gray|slate|zinc|neutral|stone|indigo|blue|cyan|emerald|rose|red|orange|amber|violet|fuchsia|purple)-(?:800|900|950)|bg-black)\\b';
            const textBlackRegexStr = '\\btext-black\\b';

            // We will look for strings enclosed in " or ' or `
            // Strategy: replace globally but with a callback that inspects the matched string.
            const regex = /className=(?:["']([^"']*)["']|`([^`]*)`)/g;
            code = code.replace(regex, (match, p1, p2) => {
                let classString = p1 || p2;
                if (!classString) return match;

                const hasDarkBg = new RegExp(darkBgRegexStr).test(classString);
                const hasTextBlack = new RegExp(textBlackRegexStr).test(classString);

                if (hasDarkBg && hasTextBlack) {
                    // It's a dark background with text-black. Replace text-black with text-white!
                    classString = classString.replace(/\btext-black\b/g, 'text-gray-200');
                    modified = true;
                    if (p1) return `className="${classString}"`;
                    if (p2) return `className=\`${classString}\``;
                }
                return match;
            });

            // Same for className={cn("...", ...)}
            // Just scan for any string literal containing these.
            const genericStringRegex = /["']([^"']+)["']/g;
            code = code.replace(genericStringRegex, (match, p1) => {
                let str = p1;
                const hasDarkBg = new RegExp(darkBgRegexStr).test(str);
                const hasTextBlack = new RegExp(textBlackRegexStr).test(str);
                if (hasDarkBg && hasTextBlack) {
                    str = str.replace(/\btext-black\b/g, 'text-gray-200');
                    modified = true;
                    return `"${str}"`; // or keep original quote
                }
                return match;
            });

            if (modified) {
                fs.writeFileSync(fullPath, code);
                console.log(`Fixed dark backgrounds with black text in ${file}`);
            }
        }
    }
}

srcDirs.forEach(processDir);
console.log("Done");
