const ffmpegPath = require('@ffmpeg-installer/ffmpeg').path;
const ffmpeg = require('fluent-ffmpeg');
ffmpeg.setFfmpegPath(ffmpegPath);
const config = require('../app.config');

const generateThumbnail = (videoPath, thumbFile) => {
  return new Promise((resolve, reject) => {
    ffmpeg(videoPath)
      .screenshot({
        timestamps: ['00:00:00'],
        folder: `${config.multer.storage}/`,
        filename: thumbFile,
      })
      .on('end', () => {
        console.log('Tạo thumbnail thành công.');
        resolve();
      })
      .on('error', err => {
        console.error('Lỗi khi tạo thumbnail:', err);
        reject(err);
      });
  });
};

module.exports = {
  generateThumbnail,
};
