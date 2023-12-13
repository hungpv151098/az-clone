const notificationService = require('../services/notification.service');
const { body, query } = require('express-validator');
const { successResponse } = require('../utils/response');
const { NOTIFICATION_STATUS } = require('../constants/const');

const getListNotifications = async req => {
  const userId = req.user.id;
  const { currentPage, pageSize } = req.query;
  return await notificationService.getListNotifications(userId, currentPage, pageSize);
};

const notificationDetail = async req => {
  const userId = req.user.id;
  const notificationId = req.params.notificationId;
  return await notificationService.notificationDetail(userId, notificationId);
};

const readAllNotifications = async req => {
  const userId = req.user.id;
  await notificationService.readAllNotifications(userId);
  return successResponse('Read all data successfully!!!');
};
const updateStatusNotification = async req => {
  const userId = req.user.id;
  const notificationId = req.params.notificationId;
  const status = req.body.status;
  await notificationService.updateStatusNotification(userId, notificationId, status);
  return successResponse('Update status notification successfully!!!');
};

const getNotificationComments = async req => {
  const { postId } = req.params;
  const { userId, pageSize, currentPage } = req.query;
  return await notificationService.getNotificationComments(userId, postId, currentPage, pageSize);
};

const getNotificationCommentReply = async req => {
  const { postId, commentId } = req.params;
  const userId = req.query.userId;
  return await notificationService.getNotificationCommentReply(userId, postId, commentId);
};

const getNotificationFollow = async req => {
  const userId = req.user.id;
  const followerId = req.query.followerId;
  return await notificationService.getNotificationFollow(followerId, userId);
};
const validate = {
  updateStatusNotification: [
    body('status')
      .exists()
      .withMessage('validate.required')
      .isNumeric()
      .withMessage('validate.is_number')
      .isIn([NOTIFICATION_STATUS.READ, NOTIFICATION_STATUS.UNREAD])
      .withMessage('validate.in_value_status'),
  ],
  getNotificationFollow: [
    query('followerId').exists().withMessage('validate.required').isInt().withMessage('validate.is_integer'),
  ],
};

module.exports = {
  getListNotifications,
  notificationDetail,
  readAllNotifications,
  updateStatusNotification,
  getNotificationComments,
  getNotificationCommentReply,
  getNotificationFollow,
  validate,
};
