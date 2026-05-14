const fs = require('fs');

let c = fs.readFileSync('src/components/events/EventCard.tsx', 'utf8');

const target = 'onClick={() => navigate(`/events/${event.id}\n    >';
const replacement = 'onClick={() => navigate(`/events/${event.id}`)}\n    >';

if (c.includes('onClick={() => navigate(`/events/${event.id}')) {
    c = c.replace('onClick={() => navigate(`/events/${event.id}\n    >', replacement);
    fs.writeFileSync('src/components/events/EventCard.tsx', c);
    console.log('MANUAL REPLACE WORKED');
} else {
    console.log('NOT FOUND');
}
