const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src', 'pages');
const files = fs.readdirSync(dir).filter(f => f.startsWith('Home') && f.endsWith('.tsx'));

for (const file of files) {
  const fullPath = path.join(dir, file);
  let code = fs.readFileSync(fullPath, 'utf8');

  // Hero subtitle
  code = code.replace(
    /className="text-black font-medium text-\[14.42px\] md:text-\[16.48px\]/g,
    'className="text-gray-200 font-medium text-[14.42px] md:text-[16.48px]'
  );

  // Hero stats list
  code = code.replace(
    /className="flex flex-wrap items-center gap-x-4 gap-y-3 text-\[11.33px\] font-bold tracking-wide text-black mb-6"/g,
    'className="flex flex-wrap items-center gap-x-4 gap-y-3 text-[11.33px] font-bold tracking-wide text-gray-300 mb-6"'
  );

  fs.writeFileSync(fullPath, code);
  console.log('Fixed', file);
}
