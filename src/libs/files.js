const fs = require('fs');
const { promisify } = require('util');
const unlinkAsync = promisify(fs.unlink);

exports.parseImage = req => {
  const file = req.file;

  const { mimetype, filename } = file;
  if (mimetype.split('/')[0] !== 'image') return null;

  return filename;
};

module.exports.removeImage = async path => {
  await unlinkAsync(path);
};
