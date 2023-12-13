const bcrypt = require('bcrypt');
const config = require('../app.config');

const saltRounds = config.encrypt.bcrypt;

exports.hashText = text => {
  return bcrypt.hashSync(text, saltRounds);
};

exports.compareHash = (text, hashed) => {
  return bcrypt.compareSync(text, hashed);
};
