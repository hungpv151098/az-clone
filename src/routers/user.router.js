const userController = require('../controllers/user.controller');
const uploadController = require('../controllers/upload.controller');
const { upload } = require('../libs/multer');

const userRouter = [
  {
    url: '/searchUsers',
    rateLimit: { window: 1000, max: 20 },
    action: userController.searchUsers,
    isAuthenticate: false,
    method: 'post'
  },
  {
    url: '/me',
    rateLimit: { window: 1000, max: 20 },
    action: userController.me,
    isAuthenticate: true,
    method: 'get',
  },
  {
    url: '/notiMessages',
    rateLimit: { window: 1000, max: 20 },
    action: userController.notiMessages,
    isAuthenticate: true,
    method: 'get',
  },
  {
    url: '/report',
    rateLimit: { window: 1000, max: 20 },
    validation: userController.validate.reports,
    action: userController.report,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/uploadMedia',
    rateLimit: { window: 1000, max: 20 },
    action: uploadController.uploadMedia,
    multer: upload.array('files', 10),
    validation: uploadController.validate.uploadMedia,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/uploadMediaForSupport',
    rateLimit: { window: 1000, max: 20 },
    action: uploadController.uploadMediaForSupport,
    multer: upload.array('files', 3),
    validation: uploadController.validate.uploadMedia,
    isAuthenticate: false,
    method: 'post',
  },
  {
    url: '/like',
    rateLimit: { window: 1000, max: 20 },
    action: userController.like,
    validation: userController.validate.like,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/unlike',
    rateLimit: { window: 1000, max: 20 },
    validation: userController.validate.unlike,
    action: userController.unlike,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/deleteUser',
    rateLimit: { window: 1000, max: 20 },
    action: userController.deleteUser,
    isAuthenticate: true,
    method: 'post',
  },
];

module.exports = userRouter;
