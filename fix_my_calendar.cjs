const fs = require('fs');
let c = fs.readFileSync('src/pages/MyCalendar.tsx', 'utf8');

c = c.replace(/onClick=\{\(\) => navigate\(\`\/events\/\$\{event.id\}[\n\s>]*|onClick=\{\(\) => navigate\(\`\/events\/\$\{event.id\}>/, 'onClick={() => navigate(`/events/${event.id}`)}>');

fs.writeFileSync('src/pages/MyCalendar.tsx', c);
console.log('Fixed MyCalendar.tsx');
