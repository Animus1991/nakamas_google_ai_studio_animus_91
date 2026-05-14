const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, 'src/pages');
const files = fs.readdirSync(dir).filter(f => f.endsWith('.tsx'));

for (const file of files) {
  const filePath = path.join(dir, file);
  let content = fs.readFileSync(filePath, 'utf-8');

  // Change max-w-3xl to max-w-full
  content = content.replace(/max-w-3xl mx-auto flex flex-col min-h-screen bg-gray-50 pb-20/g, "max-w-full mx-auto space-y-6 pb-20 md:pb-0 animate-in fade-in");
  
  // Downsize headers
  content = content.replace(/text-2xl font-black text-\[#111827\] tracking-tight leading-tight/g, "text-xl md:text-2xl font-bold text-[#111827]");
  
  // Remove the big icon in the header if they don't like components being "enlarged"
  content = content.replace(/<div className="w-10 h-10 bg-cyan-50 rounded-xl flex items-center justify-center(?: relative)?">/g, '<div className="hidden">');

  fs.writeFileSync(filePath, content);
}

console.log('Downsized components in pages.');
