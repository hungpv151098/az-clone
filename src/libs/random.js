const crypto = require('crypto');

exports.getRandomNumberCode = (len = 6) => {
  let chars = '0123456789'.split('');
  let result = '';
  for (let i = 0; i < len; i++) {
    let x = Math.floor(Math.random() * chars.length);
    result += chars[x];
  }
  return result;
};

exports.uniqueId = (len = 32) => {
  const id = crypto.randomBytes(Math.round(len / 2)).toString('hex');
  return id;
};
