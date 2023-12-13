const path = require('path');
const DB = require('../models/postgres');

const config = require('../app.config');
const throwError = require('./throwError');
const appCodes = require('../constants/appCodes');
const appMessages = require('../constants/appMessages');
const isString = value => typeof value === 'string' || value instanceof String;

const trimSlash = str => (isString(str) ? str.replace(/^\/+|\/+$/gm, '') : str);

const assetUrl = urlPath => trimSlash(config.host) + '/assets/' + trimSlash(urlPath);

const assetPath = filePath => path.join(__dirname, '../../public', filePath);

const convertUrlAws = str => {
  const parts = str.split('/');
  const fileName = parts[parts.length - 1];
  return fileName;
};

const getFileName = str => {
  const parts = str.split('.');
  const fileName = parts[0];
  return fileName;
};

const getFileNameFromPath = str => {
  const fileExt = path.basename(str);
  const fileName = getFileName(fileExt);
  return fileName;
};

const getExtFile = str => {
  const fileExtension = path.extname(str);

  return fileExtension;
};

const checkWordSentence = (content, word) => {
  const pattern = new RegExp(`\\b${word.trim()}\\b`, 'gi');
  const isWordPresent = pattern.test(content?.toLowerCase());
  return isWordPresent;
};

const removeDuplicate = arr => {
  const uniqueStrings = new Set();
  arr.forEach(string => {
    uniqueStrings.add(string);
  });
  const deduplicatedArray = Array.from(uniqueStrings);
  return deduplicatedArray;
};

const checkSensitiveWord = async content => {
  const data = await DB.models.sensitiveWords.findAll({
    attributes: ['word'],
    raw: true,
  });
  let keyWords = [];
  for (let i = 0; i < data.length; i++) {
    if (checkWordSentence(content, data[i].word) === true) {
      keyWords.push(data[i].word.replace(/\r/g, ''));
    }
  }
  const listKeyWords = removeDuplicate(keyWords);
  if (listKeyWords.length > 0) {
    return throwError({
      message: appMessages.sensitiveWords,
      code: appCodes.notAcceptable,
      status: 406,
      errors: {
        listKeyWords,
      },
    });
  }
  return;
};

const sortTags = data => {
  const sortedData = data?.sort((a, b) => {
    const idA = a.tag.symbol === null ? a.id + 100000000 : a.id;
    const idB = b.tag.symbol === null ? b.id + 100000000 : b.id;

    return idA - idB;
  });
  return sortedData;
};

module.exports = {
  isString,
  trimSlash,
  assetPath,
  assetUrl,
  convertUrlAws,
  getFileName,
  getFileNameFromPath,
  getExtFile,
  checkWordSentence,
  checkSensitiveWord,
  sortTags
};
