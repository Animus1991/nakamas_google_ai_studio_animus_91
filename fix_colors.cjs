const fs = require('fs');
const path = require('path');

function processFile(fullPath) {
    let code = fs.readFileSync(fullPath, 'utf8');
    const isDarkFile = path.basename(fullPath).includes('Dark');
    let modified = false;

    // First handle any conditional themes (mostly in AppShell.tsx or components without 'Dark' in their name but using theme conditionals)
    if (!isDarkFile && code.includes('theme ===')) {
        // e.g. theme === "bento-dark" ? "text-gray-300" : "text-gray-900"
        // we can try to specifically target the conditional returns if they match text-gray
        const newCode = code.replace(/(theme ===\s*["'][^"']*dark[^"']*["']\s*\?\s*["'][^"']*)text-(?:gray|slate|zinc|neutral|stone)-[123456789]00(?:[/]\d+)?([^"']*["']\s*:\s*["'][^"']*)text-(?:gray|slate|zinc|neutral|stone)-[123456789]00(?:[/]\d+)?([^"']*["'])/g, '$1text-white$2text-black$3');
        if (code !== newCode) {
            code = newCode;
            modified = true;
        }

        const newCode2 = code.replace(/text-(?:gray|slate|zinc|neutral|stone)-[123456789]00(?:[/]\d+)?/g, 'text-black');
        // Be careful with newCode2, it replaces everything else. But actually if it's conditional it might have multiple places not caught by above. Let's just catch the basic one.
    }

    // Handle generic class strings for isolated files
    if (isDarkFile) {
        const newCode = code.replace(/text-(?:gray|slate|zinc|neutral|stone)-[123456789]00(?:[/]\d+)?/g, 'text-white');
        if (code !== newCode) {
            code = newCode;
            modified = true;
        }
    } else {
        // Light files that don't have conditionals
        if (!code.includes('theme ===') && !code.includes('useStore((state) => state.theme)')) {
            const newCode = code.replace(/text-(?:gray|slate|zinc|neutral|stone)-[123456789]00(?:[/]\d+)?/g, 'text-black');
            if (code !== newCode) {
                code = newCode;
                modified = true;
            }
        } else if (!isDarkFile && (code.includes('useStore(s=>s.theme)') || code.includes('useStore'))) {
             // For index files that just route to templates (like Pages.tsx) there are no text colors. For AppShell, it was handled partially.
        }
    }


    if (modified) {
        fs.writeFileSync(fullPath, code);
        console.log(`Updated ${path.basename(fullPath)}`);
    }
}

function walkDir(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
        const fullPath = path.join(dir, file);
        if (fs.statSync(fullPath).isDirectory()) {
            walkDir(fullPath);
        } else if (file.endsWith('.tsx') || file.endsWith('.ts')) {
            processFile(fullPath);
        }
    }
}

walkDir(path.join(__dirname, 'src', 'pages'));
walkDir(path.join(__dirname, 'src', 'components'));
console.log("Done");
