const fs = require('fs');
const { execSync } = require('child_process');

function fixTags() {
  let errors = '';
  try {
    execSync('npx tsc --noEmit', { stdio: 'pipe' });
    return true; // success!
  } catch (e) {
    errors = e.stdout.toString();
  }

  const fixMap = {};

  for (const line of errors.split('\n')) {
    const match = line.match(/^([^:]+)\(\d+,\d+\):\s+error\s+TS17008:\s*JSX element '([^']+)' has no corresponding closing tag/);
    if (match) {
      const file = match[1];
      const tag = match[2];
      if (!fixMap[file]) fixMap[file] = [];
      fixMap[file].push(tag);
    }
  }

  if (Object.keys(fixMap).length === 0) {
     console.log('No missing tags found, but tsc still failing');
     // Some files are failing for other reasons
     return false;
  }

  for (const [file, tags] of Object.entries(fixMap)) {
    let content = fs.readFileSync(file, 'utf8');
    for (let i = tags.length - 1; i >= 0; i--) {
       content += '\n</' + tags[i] + '>';
    }
    content += '\n  );\n}\n';
    fs.writeFileSync(file, content);
    console.log('Fixed tags for', file);
  }
  return true;
}

fixTags();
