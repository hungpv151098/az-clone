const { checkSensitiveWord } = require('../libs/util');
const { successResponse } = require('../utils/response');

const checkWord = async content => {
  await checkSensitiveWord(content);
  return successResponse('User can post now!');
};

module.exports = {
  checkWord,
};
