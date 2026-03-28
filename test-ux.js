const fs = require('fs');
const content = fs.readFileSync('App.jsx', 'utf-8');
console.log(content.includes('aria-describedby'));
