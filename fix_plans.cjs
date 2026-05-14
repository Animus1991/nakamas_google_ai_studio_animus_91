const fs = require('fs');
let c = fs.readFileSync('src/pages/Plans.tsx', 'utf8');

c = c.replace(/onClick=\{\(\) => navigate\(\`\/history\/feedback\/\$\{event\.id\} /g, 'onClick={() => navigate(`/history/feedback/${event.id}`)} ');
c = c.replace(/onClick=\{\(\) => navigate\(\`\/chat\/\$\{event\.id\} /g, 'onClick={() => navigate(`/chat/${event.id}`)} ');
c = c.replace(/onClick=\{\(\) => navigate\(\`\/events\/\$\{event\.id\} /g, 'onClick={() => navigate(`/events/${event.id}`)} ');

fs.writeFileSync('src/pages/Plans.tsx', c);
