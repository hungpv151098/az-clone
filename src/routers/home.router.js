const homeController = require('../controllers/home.controller');

const homeRouter = [
  {
    url: '/home/news',
    rateLimit: { window: 1000, max: 20 },
    action: homeController.getNews,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/home/populars',
    rateLimit: { window: 1000, max: 20 },
    action: homeController.getPopulars,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/home/following',
    rateLimit: { window: 1000, max: 20 },
    action: homeController.getFollowing,
    isPaginate: true,
    isAuthenticate: true,
    method: 'get',
  },
];

module.exports = homeRouter;
