const fs = require('fs');
const path = require('path');

function processDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      processDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      let originalContent = content;
      
      // Decrease standard Tailwind sizing for buttons/inputs globally
      // h-12 (48px) -> h-[42px]
      content = content.replace(/\bh-12\b/g, 'h-[42px]');
      // h-14 (56px) -> h-[50px]
      content = content.replace(/\bh-14\b/g, 'h-[50px]');
      // h-16 (64px) -> h-[58px]
      content = content.replace(/\bh-16\b/g, 'h-[58px]');
      
      // py-3 (12px) -> py-2.5 (10px) (total height reduction 4px)
      content = content.replace(/\bpy-3\b/g, 'py-2.5');
      // py-4 (16px) -> py-3 (12px)
      content = content.replace(/\bpy-4\b/g, 'py-3');
      
      // px-8 (32px) -> px-[28px]
      content = content.replace(/\bpx-8\b/g, 'px-[28px]');
      // px-6 (24px) -> px-5 (20px)
      content = content.replace(/\bpx-6\b/g, 'px-5');

      if (content !== originalContent) {
        fs.writeFileSync(fullPath, content);
      }
    }
  }
}

processDir(path.join(__dirname, 'src'));
console.log('Button shrinking completed.');
