const fs = require('fs');

let c;

// Home.tsx
if (fs.existsSync('src/pages/Home.tsx')) {
  c = fs.readFileSync('src/pages/Home.tsx', 'utf8');
  c = c.replace(/const tagTranslations: Record\`, \`= \{/, 'const tagTranslations: Record<string, string> = {');
  fs.writeFileSync('src/pages/Home.tsx', c);
}

// GroupChat.tsx
if (fs.existsSync('src/pages/GroupChat.tsx')) {
  c = fs.readFileSync('src/pages/GroupChat.tsx', 'utf8');
  c = c.replace(/id: \\`m\$\{i\}\\`,/g, 'id: `m${i}`,');
  c = c.replace(/`flex w-full group/g, 'flex w-full group'); 
  // Let's just fix it by getting rid of the backslash before backticks
  c = c.replace(/\\`/g, '`');
  fs.writeFileSync('src/pages/GroupChat.tsx', c);
}

// NearbyGroups.tsx
if (fs.existsSync('src/pages/NearbyGroups.tsx')) {
  c = fs.readFileSync('src/pages/NearbyGroups.tsx', 'utf8');
  c = c.replace(/\\`/g, '`');
  fs.writeFileSync('src/pages/NearbyGroups.tsx', c);
}

// MyConnections.tsx - let's view exact lines
const mcl = fs.readFileSync('src/pages/MyConnections.tsx', 'utf8');
console.log('--- MyConn ---');
console.log(mcl.split('\n').slice(20, 50).join('\n'));
let fixedMc = mcl.replace(/return \(\`, \`80 \? 'Εξερευνητής' : 'Νέος'\),\n\s*mutual:/, "    role: u.isOrganizer ? t('Διοργανωτής', 'Διοργανωτής') : (u.reliabilityScore > 80 ? t('Εξερευνητής', 'Εξερευνητής') : t('Νέος', 'Νέος')),\n    mutual:");
fixedMc = fixedMc.replace(/\\`/g, '`');
fs.writeFileSync('src/pages/MyConnections.tsx', fixedMc);

// Categories.tsx
if (fs.existsSync('src/pages/Categories.tsx')) {
  c = fs.readFileSync('src/pages/Categories.tsx', 'utf8');
  c = c.replace(/\{event\.isPaid \? \(\<\/p\>/g, '</p>');
  fs.writeFileSync('src/pages/Categories.tsx', c);
}

// Inbox.tsx
if (fs.existsSync('src/pages/Inbox.tsx')) {
  c = fs.readFileSync('src/pages/Inbox.tsx', 'utf8');
  c = c.replace(/\{t\(`\{t\(\\`ΑΡΧΕΙΟ\\`, \\`ΑΡΧΕΙΟ\\`\)\}`, `[^`]+`\)\}/g, "ARCHIVE");
  fs.writeFileSync('src/pages/Inbox.tsx', c);
}

// EventDetail.tsx
if (fs.existsSync('src/pages/EventDetail.tsx')) {
  c = fs.readFileSync('src/pages/EventDetail.tsx', 'utf8');
  c = c.replace(/\\`/g, '`');
  fs.writeFileSync('src/pages/EventDetail.tsx', c);
}
