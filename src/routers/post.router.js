const config = require('../app.config');
const postController = require('../controllers/post.controller');

const postRouter = [
  {
    url: '/post/create',
    rateLimit: { window: 1000, max: 20 },
    validation: postController.validate.createPost,
    action: postController.createPost,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/:postId/edit',
    rateLimit: { window: 1000, max: 20 },
    validation: postController.validate.editPost,
    action: postController.editPost,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/:postId/delete',
    rateLimit: { window: 1000, max: 20 },
    action: postController.deletePost,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/post/tags',
    rateLimit: { window: 1000, max: 20 },
    action: postController.getTags,
    isAuthenticate: true,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/post/check',
    rateLimit: { window: 1000, max: 20 },
    action: postController.checkCreatePost,
    isAuthenticate: true,
    method: 'get',
  }
];

module.exports = postRouter;
