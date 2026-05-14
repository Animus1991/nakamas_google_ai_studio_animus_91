const fs = require('fs');
const path = require('path');

const dir = './src/pages';
const files = fs.readdirSync(dir).filter(f => f.startsWith('Plans') && f.endsWith('.tsx'));

files.forEach(file => {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf8');
  
  content = content.replace(/text-\[([\d\.]+)px\]/g, (match, p1) => {
    const newVal = parseFloat(p1) * 0.95;
    return `text-[${newVal}px]`;
  });
  
  fs.writeFileSync(filePath, content, 'utf8');
  console.log(`Updated ${file}`);
});
