const { S3 } = require('@aws-sdk/client-s3');
const config = require('../../app.config');
const { Upload } = require('@aws-sdk/lib-storage');
const sharp = require('sharp');
const fs = require('fs');
const heicConvert = require('heic-convert');
const { getFileName } = require('../../libs/util');

const uploadFileS3 = async (s3Config, folder, fileName, fileContent) => {
  const s3 = new S3(s3Config);
  const paramsUploadFile = {
    Bucket: config.aws.bucket,
    Key: `${folder}/${fileName}`,
    Body: fileContent,
  };
  return await new Upload({
    client: s3,
    params: paramsUploadFile,
  }).done();
};

const removeS3File = async (s3Config, fileName) => {
  const s3 = new S3(s3Config);
  const paramsRemoveFile = {
    Bucket: config.aws.bucket,
    Key: `/${folder}/${fileName}`,
  };
  return await s3.deleteObject(paramsRemoveFile);
};

const getPublicLink = (folderName, filePath) => {
  return `https://${config.aws.bucket}.s3.${config.aws.region}.amazonaws.com/${folderName}` + filePath;
};

const convertHEICtoJPG = async (originalFile, fileName) => {
  const heicBuffer = fs.readFileSync(originalFile);
  const result = await heicConvert({ buffer: heicBuffer, format: 'JPEG' });
  const jpegBuffer = result;
  fs.writeFileSync(`${config.multer.storage}/${getFileName(fileName)}.jpg`, jpegBuffer);
};

const resizeImage = async (originalFile, isWidth = true) => {
  try {
    const image = sharp(originalFile);
    const meta = await image.metadata();
    const { format } = meta;
    const configResize = {
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      png: { quality: 80 },
    };
    const maxWidth = parseInt(config.resize.width);
    const maxHeight = parseInt(config.resize.height);
    if (isWidth) {
      return await image[format](configResize[format])
        .resize({ width: maxWidth, withoutEnlargement: true })
        .withMetadata()
        .toBuffer();
    } else if (isWidth === false) {
      return await image[format](configResize[format])
        .resize({ height: maxHeight, withoutEnlargement: true })
        .withMetadata()
        .toBuffer();
    } else {
      return await image[format](configResize[format])
        .resize({ width: config.maxCrop || 800, height: config.maxCrop || 800, withoutEnlargement: true })
        .withMetadata()
        .toBuffer();
    }
  } catch (err) {
    throw new Error(err);
  }
};

const cropImage = async (originalFile) => {
  try {
    const image = sharp(originalFile);
    const meta = await image.metadata();
    const { format } = meta;
    const configResize = {
      jpeg: { quality: 80 },
      webp: { quality: 80 },
      png: { quality: 80 },
    };
    const { width, height } = meta;
    //Crop with case: width > height, height > width
    let left = Math.round((width - height) / 2);
    let top = Math.round((height - width) / 2);
    let temp = {};
    if (width > height) {
      temp.left = left;
      temp.top = 0;
      temp.size = height;
    } else {
      temp.left = 0;
      temp.top = top;
      temp.size = width;
    }
    return await image[format](configResize[format])
      .extract({ left: temp.left, top: temp.top, width: temp.size, height: temp.size })
      .withMetadata();
  } catch (err) {
    throw new Error(err);
  }
};

const getWidthHeight = async originalFile => {
  try {
    return sharp(originalFile)
      .metadata()
      .then(metadata => {
        const width = metadata.width;
        const height = metadata.height;
        return {
          width,
          height,
        };
      })
      .catch(err => {
        console.error(err);
        return {
          width: 0,
          height: 0,
        };
      });
  } catch (err) {
    return {
      width: 0,
      height: 0,
    };
  }
};

module.exports = {
  uploadFileS3,
  removeS3File,
  getPublicLink,
  resizeImage,
  cropImage,
  getWidthHeight,
  convertHEICtoJPG,
};
