const checkContentController = require('../controllers/checkContent.controller');

const checkContentRouter = [
  {
    url: '/post/checkContent',
    rateLimit: { window: 1000, max: 20 },
    action: checkContentController.checkContent,
    isAuthenticate: true,
    method: 'post',
  },
];
module.exports = checkContentRouter;
