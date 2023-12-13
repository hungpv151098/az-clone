const notificationController = require('../controllers/notification.controller');

const notificationRouter = [
  {
    url: '/notifications',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.getListNotifications,
    isAuthenticate: true,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/notifications/:notificationId',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.notificationDetail,
    isAuthenticate: true,
    method: 'get',
  },
  {
    url: '/notifications/readAll',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.readAllNotifications,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/notifications/:notificationId/update',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.updateStatusNotification,
    isAuthenticate: true,
    validation: notificationController.validate.updateStatusNotification,
    method: 'post',
  },
  {
    url: '/notifications/post/detail/:postId/comments',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.getNotificationComments,
    isAuthenticate: true,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/notifications/post/detail/:postId/comments/:commentId',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.getNotificationCommentReply,
    isAuthenticate: true,
    method: 'get',
  },
  {
    url: '/notifications/profile/follower',
    rateLimit: { window: 1000, max: 20 },
    action: notificationController.getNotificationFollow,
    isAuthenticate: true,
    validation: notificationController.validate.getNotificationFollow,
    method: 'get',
  },
];

module.exports = notificationRouter;
