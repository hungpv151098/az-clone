const chartController = require('../controllers/chart.controller');

const chartRouter = [
  {
    url: '/chart/post',
    rateLimit: { window: 1000, max: 20 },
    valitation: chartController.validate.getChartPost,
    action: chartController.getChartPost,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/chart/:tagId/news',
    rateLimit: { window: 1000, max: 20 },
    action: chartController.getAZNews,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/chart/news/:postId',
    rateLimit: { window: 1000, max: 20 },
    action: chartController.getAZDetail,
    method: 'get',
  },
  {
    url: '/chart/token/:cmcTokenId/getDetail',
    rateLimit: { window: 1000, max: 20 },
    validation:chartController.validate.getTokenDetail,
    action: chartController.getTokenDetail,
    method: 'get',
  },
];

module.exports = chartRouter;
