const fs = require('fs');
const path = require('path');

const greekRegex = /[\u0370-\u03FF\u1F00-\u1FFF]+/g;

function getGreekStrings(dir, results = new Set()) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      getGreekStrings(fullPath, results);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      const content = fs.readFileSync(fullPath, 'utf8');
      
      // Match JSX text and string literals loosely
      const lines = content.split('\n');
      for (const line of lines) {
        if (greekRegex.test(line)) {
            // Very naive extraction: just grab the part with greek.
            // A better way: match things inside quotes or >...<
            const jsxMatch = line.match(/>([^<]*[\u0370-\u03FF]+[^<]*)</g);
            if (jsxMatch) {
                jsxMatch.forEach(m => {
                    const str = m.slice(1, -1).trim();
                    if (str) results.add(str);
                });
            }
            const quoteMatch = line.match(/['"]([^'"]*[\u0370-\u03FF]+[^'"]*)['"]/g);
            if (quoteMatch) {
                quoteMatch.forEach(m => {
                    const str = m.slice(1, -1).trim();
                    if (str) results.add(str);
                });
            }
        }
      }
    }
  }
  return results;
}

const strings = Array.from(getGreekStrings(path.join(__dirname, 'src')));
fs.writeFileSync('greek_strings.json', JSON.stringify(strings, null, 2));
console.log('Extracted strings:', strings.length);
