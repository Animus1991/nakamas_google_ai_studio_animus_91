const fs = require('fs');

let file = fs.readFileSync('src/pages/GroupChat.tsx', 'utf8');

file = file.replace(/text-\[11px\] font-bold text-gray-500 uppercase tracking-widest/g, 'text-xs font-semibold text-gray-600 tracking-tight capitalize');
file = file.replace(/font-bold text-\[11px\] uppercase tracking-widest text-\[\#111827\]/g, 'font-bold text-[13px] capitalize tracking-tight text-[#111827]');
file = file.replace(/text-\[11px\] uppercase font-bold tracking-wider/g, 'text-[12px] font-semibold capitalize tracking-tight');
file = file.replace(/text-\[10px\] font-bold uppercase tracking-widest/g, 'text-[11px] font-semibold tracking-tight capitalize');
file = file.replace(/text-\[11px\] uppercase font-bold text-indigo-600/g, 'text-[11px] font-semibold capitalize text-indigo-600');
file = file.replace(/text-\[10px\] font-bold uppercase tracking-wider/g, 'text-[11px] font-semibold tracking-tight capitalize');

fs.writeFileSync('src/pages/GroupChat.tsx', file);
console.log('GroupChat typography updated');
