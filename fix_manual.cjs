const fs = require('fs');

function truncateAndClose(filename, cutString, replacement) {
  let c = fs.readFileSync(filename, 'utf8');
  let idx = c.indexOf(cutString);
  if (idx !== -1) {
    c = c.substring(0, idx) + replacement;
    fs.writeFileSync(filename, c);
    console.log('Fixed', filename);
  }
}

// 1. Home.tsx
truncateAndClose('src/pages/Home.tsx', '{t(``, ``)}', '}</div></div></div></div></div></div></div></div>  );\n}\n');

// 2. Profile.tsx
// Let's check Profile.tsx
