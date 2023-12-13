const { body } = require('express-validator');
const userService = require('../services/user.service');

const searchUsers = async req => {
  const { currentPage, pageSize, keywordSearch } = req.body;
  return await userService.findUsers(currentPage, pageSize, keywordSearch);
};

const me = async req => {
  return req.user;
};

const notiMessages = async req => {
  return await userService.getNotiMessages(req.user.id);
};

const report = async req => {
  const userId = req.user.id;
  const { postId, reason, explaination, mediaData } = req.body;
  return await userService.postsReport(userId, postId, reason, explaination, mediaData);
};

const like = async req => {
  const userId = req.user.id;
  const { likeableId, likeableType } = req.body;
  return await userService.userLike(userId, likeableId, likeableType);
};

const unlike = async req => {
  const userId = req.user.id;
  const { likeableId, likeableType } = req.body;
  return await userService.userUnlike(userId, likeableId, likeableType);
};

const deleteUser = async req => {
  const userId = req.user.id;
  return await userService.deleteUser(userId);
};

const validate = {
  reports: [
    body('postId').exists().withMessage('validate.required'),
    body('reason')
      .exists()
      .withMessage('validate.required')
      .isInt({ min: 1, max: 11 })
      .withMessage('validate.is_integer'),
    body('explaination').exists().withMessage('validate.required'),
    body('mediaData').exists().withMessage('validate.required'),
  ],
  like: [
    body('likeableId').exists().withMessage('validate.required'),
    body('likeableType').exists().withMessage('validate.required'),
  ],
  unlike: [
    body('likeableId').exists().withMessage('validate.required'),
    body('likeableType').exists().withMessage('validate.required'),
  ],
};

module.exports = {
  me,
  notiMessages,
  report,
  like,
  unlike,
  deleteUser,
  validate,
  searchUsers
};
