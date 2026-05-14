const fs = require('fs');
let c = fs.readFileSync('src/pages/Categories.tsx', 'utf8');

c = c.replace(/const ALL_CATEGORIES = /g, 'const getCategories = (t: any) => ');
c = c.replace(/ALL_CATEGORIES(?!\s*=)/g, 'getCategories(t)');
fs.writeFileSync('src/pages/Categories.tsx', c);
