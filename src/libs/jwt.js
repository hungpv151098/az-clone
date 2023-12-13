const jwt = require('jsonwebtoken');
const config = require('../app.config');

exports.signToken = data => {
  try {
    return jwt.sign(data, config.encrypt.jwtKey);
  } catch (e) {
    return null;
  }
};

exports.generateToken = data => {
  try {
    return jwt.sign(data, config.encrypt.jwtKey, {
      algorithm: 'HS256',
      expiresIn: config.encrypt.accessTokenLife,
    });
  } catch (e) {
    return null;
  }
};

exports.verifyToken = token => {
  try {
    return jwt.verify(token, config.encrypt.jwtKey);
  } catch (e) {
    return null;
  }
};

exports.decodeToken = async token => {
  try {
    return await jwt.verify(token, config.encrypt.jwtKey, {
      ignoreExpiration: true,
    });
  } catch (error) {
    return null;
  }
};
