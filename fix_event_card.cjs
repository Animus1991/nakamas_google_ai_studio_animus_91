const fs = require('fs');

let c = fs.readFileSync('src/components/events/EventCard.tsx', 'utf8');
c = c.replace(/onClick=\{\(\) => navigate\(\`\/events\/\$\{event\.id\n\s*>/g, 'onClick={() => navigate(`/events/${event.id}`)}\n    >');
fs.writeFileSync('src/components/events/EventCard.tsx', c);

console.log('Fixed EventCard.tsx navigate');
