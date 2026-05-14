const fs = require('fs');

const dirs = ['src/pages/', 'src/components/'];
let fixedFiles = 0;

for (let dir of dirs) {
  if (!fs.existsSync(dir)) continue;
  let files = fs.readdirSync(dir);
  for (let file of files) {
    if (!file.endsWith('.tsx')) continue;
    let path = dir + file;
    let content = fs.readFileSync(path, 'utf8');
    let original = content;

    // recursive unwrap
    let pass = 0;
    while(pass < 10) {
      let prev = content;
      // unwrap {t(`...`, `...`)} into ...
      content = content.replace(/\{t\(`([^]*?)`,\s*`([^]*?)`\)\}/g, '$1');
      if (prev === content) break;
      pass++;
    }
    
    // also unwrap plain t(`...`, `...`)
    pass = 0;
    while(pass < 10) {
      let prev = content;
      content = content.replace(/t\(`([^]*?)`,\s*`([^]*?)`\)/g, '`$1`');
      if (prev === content) break;
      pass++;
    }

    if (content !== original) {
      fs.writeFileSync(path, content);
      fixedFiles++;
    }
  }
}
console.log('Fixed files:', fixedFiles);
