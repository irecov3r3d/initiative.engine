const crypto = require('crypto');

console.time('hash');
for(let i=0; i<100; i++) {
  const hash = crypto.createHash('sha256').update('password123').digest('hex');
}
console.timeEnd('hash');
