const chargeFeeRouter = require('./chargeFee.router');
const chartRouter = require('./chart.router');
const checkContentRouter = require('./checkContent.router');
const homeRouter = require('./home.router');
const notificationRouter = require('./notification.router');
const postRouter = require('./post.router');
const postDetailRouter = require('./postDetail.router');
const profileRouter = require('./profile.router');
const settingRouter = require('./setting.router');
const userRouter = require('./user.router');
const faqRouter = require('./faq.router');

const routers = [
  ...homeRouter,
  ...userRouter,
  ...postDetailRouter,
  ...postRouter,
  ...profileRouter,
  ...chartRouter,
  ...notificationRouter,
  ...checkContentRouter,
  ...settingRouter,
  ...chargeFeeRouter,
  ...faqRouter,
];

module.exports = routers;
