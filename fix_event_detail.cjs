const fs = require('fs');
let c = fs.readFileSync('src/pages/EventDetail.tsx', 'utf8');

c = c.replace('onClick={() => navigate(`/events/${event.id}/join\n    >', 'onClick={() => navigate(`/events/${event.id}/join`)}\n    >');

fs.writeFileSync('src/pages/EventDetail.tsx', c);
console.log('Fixed EventDetail.tsx');
