const fs = require('fs');

const removeOneFile = file =>
  new Promise(rs => {
    const { path } = file;

    fs.unlink(path, () => {
      rs(true);
    });
  });

const removeFiles = async files => Promise.all(files.map(removeOneFile));

module.exports = removeFiles;
