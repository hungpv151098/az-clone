const { body } = require('express-validator');
const checkContentService = require('../services/checkContent.service');

const checkContent = async req => {
  const content = req.body.content;
  return await checkContentService.checkWord(content);
};

const validate = {
  checkContent: [
    body('content')
      .exists()
      .withMessage('validate.required')
      .isLength({ max: 300 })
      .withMessage('validate.post_content_max_length'),
  ],
};

module.exports = {
  checkContent,
  validate
};
