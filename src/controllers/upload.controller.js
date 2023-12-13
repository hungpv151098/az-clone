const {
  uploadFileS3,
  resizeImage,
  getWidthHeight,
  cropImage,
  convertHEICtoJPG,
} = require('../services/aws/s3.service');
const fs = require('fs');
const config = require('../app.config');

const { getFileName, getFileNameFromPath, getExtFile } = require('../libs/util');
const { generateThumbnail } = require('../libs/convertThumb');
const { query } = require('express-validator');
const { FOLDER_AWS, LOCALE_COMPARE } = require('../constants/const');
const sharp = require('sharp');
const throwError = require('../libs/throwError');
const appCodes = require('../constants/appCodes');
const appMessages = require('../constants/appMessages');
const s3Config = {
  secretAccessKey: config.aws.secretAccessKey,
  accessKeyId: config.aws.accessKeyId,
  region: config.aws.region,
};

const uploadMedia = async req => {
  const mediaFiles = req.files;
  const type = req.query.type;
  const data = [];
  for (const mediaFile of mediaFiles) {
    if (mediaFile.mimetype.startsWith('video/')) {
      await generateThumbnail(mediaFile.path, `${getFileName(mediaFile.filename)}.webp`);
      const [thumbContent, fileContent] = await Promise.all([
        fs.readFileSync(`${config.multer.storage}/${getFileName(mediaFile.filename)}.webp`),
        fs.readFileSync(`${config.multer.storage}/${mediaFile.filename}`),
      ]);
      const [s3ThumbUploaded, s3VideoUploaded] = await Promise.all([
        uploadFileS3(s3Config, type, `${getFileName(mediaFile.filename)}.webp`, thumbContent),
        uploadFileS3(s3Config, type, mediaFile.filename, fileContent),
      ]);
      data.push({
        type: mediaFile.mimetype,
        mediaUrl: `${config.aws.cloudFront}/${s3VideoUploaded.Key}`,
        thumbUrl: `${config.aws.cloudFront}/${s3ThumbUploaded.Key}`,
      });
      await Promise.all([
        fs.unlinkSync(`${config.multer.storage}/${getFileName(mediaFile.filename)}.webp`),
        fs.unlinkSync(mediaFile.path),
      ]);
    } else {
      let originalFile = null;
      originalFile = `${config.multer.storage}/${mediaFile.filename}`;
      if (mediaFile.filename.split('.')[1] === 'HEIC') {
        await convertHEICtoJPG(originalFile, mediaFile.filename);
        fs.unlinkSync(`${config.multer.storage}/${mediaFile.filename}`);
        originalFile = `${config.multer.storage}/${getFileName(mediaFile.filename)}.webp`;
      }
      const { width, height } = await getWidthHeight(originalFile);
      if (width === 0 || height === 0) {
        fs.unlinkSync(mediaFile.path);
      } else {
        const maxWidth = parseInt(config.resize.width);
        const maxHeight = parseInt(config.resize.height);
        //Read originalFile from local
        let newFile = fs.readFileSync(originalFile);
        //Clone original File
        let newFileThumb = newFile;
        let cropFile = null;
        /**
         * Check cases:
         *  1. width > maxWidth or height > maxHeight
         *  2. width and height > maxCropSize
         *  3. width != height
         */
        if (width > maxWidth || height > maxHeight) {
          //resize image original
          newFile = await resizeImage(originalFile, width > height);
        }
        if (width > parseInt(config.maxCrop) && height > parseInt(config.maxCrop)) {
          //resize with function resize thumb, check codition is maxCropSize
          newFileThumb = await resizeImage(originalFile, null);
        }
        if (width != height) {
          /**
           * if not exits resize, get value original file to crop
           * if exits resize, get value from case 1,2 to crop
           */
          cropFile = await cropImage(newFileThumb);
        }
        //s3 upload
        const s3FileUploaded = await uploadFileS3(s3Config, type, `${getFileName(mediaFile.filename)}.webp`, newFile);
        const s3ThumbImageUploaded = await uploadFileS3(
          s3Config,
          type,
          cropFile?.options?.input?.file
            ? `${getFileNameFromPath(cropFile?.options?.input?.file)}.webp`
            : `resize_file_${getFileNameFromPath(originalFile.toString())}.webp`,
          cropFile || newFileThumb
        );
        data.push({
          type: mediaFile.mimetype,
          mediaUrl: `${config.aws.cloudFront}/${s3FileUploaded.Key}`,
          thumbUrl: `${config.aws.cloudFront}/${s3ThumbImageUploaded.Key}`,
        });
        if (getExtFile(originalFile).localeCompare('.webp') === LOCALE_COMPARE.TRUE) {
          sharp.cache(false);
        }
        fs.unlinkSync(originalFile);
      }
    }
  }
  return data;
};

const uploadMediaForSupport = async req => {
  try {
    const mediaFiles = req.files;
    const type = req.query.type;
    const data = [];
    let arrTypes = [];
    for (const mediaFile of mediaFiles) {
      arrTypes.push(mediaFile.mimetype.slice(0, 5));
      let newArrTypes = [...new Set(arrTypes)];
      if (newArrTypes.length > 1) {
        throwError({
          message: appMessages.onlyImgOrVideo,
          code: appCodes.unknownError,
          status: 405,
        });
      }
      if (mediaFile.mimetype.startsWith('video/')) {
        await generateThumbnail(mediaFile.path, `${getFileName(mediaFile.filename)}.webp`);
        const [thumbContent, fileContent] = await Promise.all([
          fs.readFileSync(`${config.multer.storage}/${getFileName(mediaFile.filename)}.webp`),
          fs.readFileSync(`${config.multer.storage}/${mediaFile.filename}`),
        ]);
        const [s3ThumbUploaded, s3VideoUploaded] = await Promise.all([
          uploadFileS3(s3Config, type, `${getFileName(mediaFile.filename)}.webp`, thumbContent),
          uploadFileS3(s3Config, type, mediaFile.filename, fileContent),
        ]);
        data.push({
          type: mediaFile.mimetype,
          mediaUrl: `${config.aws.cloudFront}/${s3VideoUploaded.Key}`,
          thumbUrl: `${config.aws.cloudFront}/${s3ThumbUploaded.Key}`,
        });
        await Promise.all([
          fs.unlinkSync(`${config.multer.storage}/${getFileName(mediaFile.filename)}.webp`),
          fs.unlinkSync(mediaFile.path),
        ]);
      } else {
        if (mediaFile.size > config.maxSizeImgForSupport) {
          throwError({
            message: appMessages.maxSizeImgForSupport,
            code: appCodes.unknownError,
            status: 405,
          });
        }
        let originalFile = null;
        originalFile = `${config.multer.storage}/${mediaFile.filename}`;
        if (mediaFile.filename.split('.')[1] === 'HEIC') {
          await convertHEICtoJPG(originalFile, mediaFile.filename);
          fs.unlinkSync(`${config.multer.storage}/${mediaFile.filename}`);
          originalFile = `${config.multer.storage}/${getFileName(mediaFile.filename)}.webp`;
        }
        const { width, height } = await getWidthHeight(originalFile);
        if (width === 0 || height === 0) {
          fs.unlinkSync(mediaFile.path);
        } else {
          const maxWidth = parseInt(config.resize.width);
          const maxHeight = parseInt(config.resize.height);
          let newFile = fs.readFileSync(originalFile);
          if (width > maxWidth || height > maxHeight) {
            newFile = await resizeImage(originalFile, width > height);
          }
          const s3FileUploaded = await uploadFileS3(s3Config, type, `${getFileName(mediaFile.filename)}.webp`, newFile);
          const s3ThumbImageUploaded = await uploadFileS3(
            s3Config,
            type,
            `thumbImg_${getFileNameFromPath(originalFile)}.webp`,
            newFile
          );
          data.push({
            type: mediaFile.mimetype,
            mediaUrl: `${config.aws.cloudFront}/${s3FileUploaded.Key}`,
            thumbUrl: `${config.aws.cloudFront}/${s3ThumbImageUploaded.Key}`,
          });
          if (getExtFile(originalFile).localeCompare('.webp') === LOCALE_COMPARE.TRUE) {
            sharp.cache(false);
          }
          fs.unlinkSync(originalFile);
        }
      }
    }
    return data;
  } catch (error) {
    console.log(error);
    return;
  }
};

const validate = {
  uploadMedia: [
    query('type')
      .exists()
      .withMessage('validate.required')
      .isIn([FOLDER_AWS.POST, FOLDER_AWS.REPORT, FOLDER_AWS.SUPPORT])
      .withMessage('validate.in_folder_field'),
  ],
};

module.exports = { uploadMedia, uploadMediaForSupport, validate };
