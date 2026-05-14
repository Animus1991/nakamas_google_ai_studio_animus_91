const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Adjust padding of sticky headers
  content = content.replace(/px-5 pt-8 pb-4/g, "px-4 pt-6 pb-4");
  
  // Also adjust the text sizing that was left
  content = content.replace(/text-xs font-semibold text-gray-500 uppercase tracking-widest/g, "text-xs text-gray-500 uppercase");
  
  fs.writeFileSync(filePath, content);
}

console.log('Fixed padding in pages.');
