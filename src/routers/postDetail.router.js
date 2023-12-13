const postDetailController = require('../controllers/postDetail.controller');

const postDetailRouter = [
  {
    url: '/post/detail/:postId',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.getDetail,
    isAuthenticate: false,
    method: 'get',
  },
  {
    url: '/post/detail/:postId/share',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.sharePost,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/detail/:postId/comments',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.getComments,
    isAuthenticate: false,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/post/detail/:postId/comment/:commentId/reply',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.getReplies,
    isAuthenticate: false,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/post/detail/:postId/comment',
    rateLimit: { window: 1000, max: 20 },
    validation: postDetailController.validate.postComment,
    action: postDetailController.postComment,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/detail/:postId/comment/:commentId/edit',
    rateLimit: { window: 1000, max: 20 },
    validation: postDetailController.validate.editComment,
    action: postDetailController.editComment,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/detail/:postId/comment/:commentId/delete',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.deleteComment,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/detail/:postId/shareWall',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.shareWallPost,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/detail/:postId/hide',
    rateLimit: { window: 1000, max: 20 },
    action: postDetailController.hidePost,
    isAuthenticate: true,
    method: 'post',
  },
];

module.exports = postDetailRouter;
