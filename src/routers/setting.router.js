const settingController = require('../controllers/setting.controller');

const settingRouter = [
  {
    url: '/setting',
    action: settingController.setting,
    method: 'get',
  },
];
module.exports = settingRouter;
