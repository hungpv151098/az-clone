const { body } = require('express-validator');
const appCodes = require('../constants/appCodes');
const throwError = require('../libs/throwError');
const postService = require('../services/post.service');

const createPost = async req => {
  const userId = req.user.id;
  const { content, mediaData, linkData, tagData } = req.body;
  await postService.checkCreatePost(userId);
  return await postService.createPost(userId, content, mediaData, linkData, tagData);
};

const editPost = async req => {
  const userId = req.user.id;
  const { postId } = req.params;
  const { postData, mediaData, linkData, tagData } = req.body;
  if (!postData && !mediaData && !linkData && !tagData) {
    throwError({
      message: 'Content not found',
      code: appCodes.validationErrors,
      status: 400,
    });
  }
  return await postService.editPost(userId, postId, postData, mediaData, linkData, tagData);
};

const deletePost = async req => {
  const userId = req.user.id;
  const { postId } = req.params;
  return await postService.deletePost(userId, postId);
};

const getTags = async req => {
  const { keyword, currentPage, pageSize } = req.query;
  return await postService.getTags(keyword, currentPage, pageSize);
};

const checkCreatePost = async req => {
  const userId = req.user.id;
  return await postService.checkCreatePost(userId);
};

const checkBalance = async req => {
  const userId = req.user.id;
  const totalCost = req.body.totalCost;
  return await postService.checkBalance(userId, totalCost);
};

const validate = {
  createPost: [
    body('content')
      .exists()
      .withMessage('validate.required')
      .isLength({ max: 3000 })
      .withMessage('validate.post_content_max_length'),
    body('mediaData').exists().withMessage('validate.required'),
    body('linkData').exists().withMessage('validate.required'),
    body('tagData').exists().withMessage('validate.required'),
  ],
  editPost: [
    body('postData.content')
      .exists()
      .withMessage('validate.required')
      .isLength({ max: 3000 })
      .withMessage('validate.post_content_max_length'),
    body('mediaData').exists().withMessage('validate.required'),
    body('linkData').exists().withMessage('validate.required'),
    body('tagData').exists().withMessage('validate.required'),
  ],
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getTags,
  checkCreatePost,
  checkBalance,
  validate,
};
