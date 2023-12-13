const { body } = require('express-validator');
const postDetailService = require('../services/postDetail.service');
const postService = require('../services/post.service');

const getDetail = async req => {
  const { postId } = req.params;
  const { userName } = req.query;
  const userId = req.query.userId;
  return await postDetailService.getDetail(userId, postId, userName);
};

const sharePost = async req => {
  const userId = req.user.id;
  const { postId } = req.params;
  return await postDetailService.sharePost(userId, postId);
};

const getComments = async req => {
  const { postId } = req.params;
  const { userId, pageSize, currentPage } = req.query;
  return await postDetailService.getComments(userId, postId, currentPage, pageSize);
};

const postComment = async req => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { commentParentId, replyId, content } = req.body;
  return await postDetailService.postComment(userId, postId, commentParentId, replyId, content);
};

const editComment = async req => {
  const userId = req.user.id;
  const { postId, commentId } = req.params;
  const { content, replyId } = req.body;
  return await postDetailService.editComment(userId, postId, commentId, content, replyId);
};

const deleteComment = async req => {
  const userId = req.user.id;
  const { postId, commentId } = req.params;
  return await postDetailService.deleteComment(userId, postId, commentId);
};

const getReplies = async req => {
  const { postId, commentId } = req.params;
  const { userId, pageSize, currentPage } = req.query;
  return await postDetailService.getReplies(userId, postId, commentId, currentPage, pageSize);
};

const shareWallPost = async req => {
  const userId = req.user.id;
  const postId = req.params.postId;
  const { content } = req.body;
  await postService.checkCreatePost(userId);
  return await postDetailService.shareWallPost(userId, postId, content);
};

const hidePost = async req => {
  const userId = req.user.id;
  const postId = req.params.postId;
  return await postDetailService.hidePost(userId, postId);
};

const validate = {
  postComment: [
    body('commentParentId').exists().withMessage('validate.required').isInt().withMessage('validate.is_integer'),
    body('content')
      .exists()
      .withMessage('validate.required')
      .isLength({ max: 300 })
      .withMessage('validate.post_content_max_length'),
    body('replyId').optional({ nullable: true }),
  ],
  editComment: [
    body('content')
      .exists()
      .withMessage('validate.required')
      .isLength({ max: 300 })
      .withMessage('validate.post_content_max_length'),
    body('replyId').optional({ nullable: true }),
  ],
  shareWallPost: [
    body('content')
      .exists()
      .withMessage('validate.required')
      .isLength({ max: 300 })
      .withMessage()
      .withMessage('validate.post_content_max_length'),
  ],
};
module.exports = {
  getDetail,
  sharePost,
  getComments,
  postComment,
  editComment,
  deleteComment,
  getReplies,
  shareWallPost,
  hidePost,
  validate,
};
