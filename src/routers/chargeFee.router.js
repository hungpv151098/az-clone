const chargeFeeController = require('../controllers/chargeFee.controller');

const chargeFeeRouter = [
  {
    url: '/checkBalance',
    rateLimit: { window: 1000, max: 20 },
    valitation: chargeFeeController.validate.checkBalance,
    action: chargeFeeController.checkBalance,
    isAuthenticate: true,
    method: 'get',
  },
];

module.exports = chargeFeeRouter;
