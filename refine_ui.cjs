const fs = require('fs');
const path = require('path');

function replaceInDir(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const fullPath = path.join(dir, file);
    if (fs.statSync(fullPath).isDirectory()) {
      replaceInDir(fullPath);
    } else if (fullPath.endsWith('.tsx') || fullPath.endsWith('.ts')) {
      let content = fs.readFileSync(fullPath, 'utf8');
      
      // Global replacements to refine the UI
      // 1. Change indigo to cyan so the primary color matches the #18D8DB string better
      content = content.replace(/indigo-/g, 'cyan-');
      
      // 2. Make all rounded-2xl blocks a bit softer with rounded-3xl or softer shadow
      content = content.replace(/shadow-md/g, 'shadow-sm');
      content = content.replace(/shadow-lg/g, 'shadow-md');
      
      // 3. Typography refinements - reduce excessive boldness
      content = content.replace(/font-extrabold/g, 'font-bold');
      
      // 4. Specifically adjust rounded-[20px] and tracking-widest
      content = content.replace(/rounded-\[20px\]/g, 'rounded-[16px]');
      content = content.replace(/tracking-widest/g, 'tracking-wider');

      fs.writeFileSync(fullPath, content);
    }
  }
}

replaceInDir(path.join(__dirname, 'src'));
console.log('UI refinement replacements completed.');
