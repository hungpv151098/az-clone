const path = require('path');
const multer = require('multer');
const config = require('../app.config');

const storage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, config.multer.storage);
  },
  filename: (_req, file, cb) => {
    const random = (Math.random() + 1).toString(36).substring(2);
    cb(null, Date.now() + '_' + random + path.extname(file.originalname));
  }
});
const storageImage = multer.diskStorage({
  destination: function (_req, _file, callback) {
    callback(null, config.multer.storageImage);
  },
  filename: (_req, file, cb) => {
    const random = (Math.random() + 1).toString(36).substring(2);
    cb(null, Date.now() + '_' + random + path.extname(file.originalname));
  },
});

exports.upload = multer({ storage: storage, limits: {
    fileSize: parseInt(config.maxFileSize) * 1024 * 1024
  } });
exports.uploadImage = multer({ storage: storageImage });
