const { param, body } = require('express-validator');
const profileService = require('../services/profile.service');
const { REPORT_USERS_REASON } = require('../constants/const');

const getInfo = async req => {
  const { profileId } = req.params;
  const { userId } = req.query;
  return await profileService.getInfo(profileId, userId);
};

const getProfilePost = async req => {
  const { profileId } = req.params;
  const { userId, currentPage, pageSize } = req.query;
  return await profileService.getProfilePost(userId, profileId, currentPage, pageSize);
};

const getProfileFollower = async req => {
  const { profileId } = req.params;
  const { userId, currentPage, pageSize } = req.query;
  return await profileService.getProfileFollower(profileId, currentPage, pageSize, userId);
};

const getProfileFollowing = async req => {
  const { profileId } = req.params;
  const { userId, currentPage, pageSize } = req.query;
  return await profileService.getProfileFollowing(profileId, currentPage, pageSize, userId);
};

const followUser = async req => {
  const userId = req.user.id;
  const { profileId } = req.params;
  return await profileService.followUser(userId, profileId);
};

const unfollowUser = async req => {
  const userId = req.user.id;
  const { profileId } = req.params;
  return await profileService.unfollowUser(userId, profileId);
};

const blockUser = async req => {
  const userId = req.user.id;
  const { profileId } = req.params;
  return await profileService.blockUser(userId, profileId);
};

const unblockUser = async req => {
  const userId = req.user.id;
  const { profileId } = req.params;
  return await profileService.unblockUser(userId, profileId);
};

const reportUser = async req => {
  const userId = req.user.id;
  const { profileId } = req.params;
  const { reason, explaination, mediaData } = req.body;
  return await profileService.reportUser(userId, profileId, reason, explaination, mediaData);
};

const validate = {
  getInfo: [param('profileId').isInt().withMessage('validate.is_number')],

  getProfilePost: [param('profileId').isInt().withMessage('validate.is_number')],
  getProfileFollower: [param('profileId').isInt().withMessage('validate.is_number')],
  getProfileFollowing: [param('profileId').isInt().withMessage('validate.is_number')],
  followUser: [param('profileId').isInt().withMessage('validate.is_number')],
  unfollowUser: [param('profileId').isInt().withMessage('validate.is_number')],
  blockUser: [param('profileId').isInt().withMessage('validate.is_number')],
  unblockUser: [param('profileId').isInt().withMessage('validate.is_number')],
  reportUser: [
    param('profileId').isInt().withMessage('validate.is_number'),
    body('reason')
      .exists()
      .withMessage('validate.required')
      .isIn([
        REPORT_USERS_REASON.PRETENDING_SOMEONE,
        REPORT_USERS_REASON.FAKE_ACCOUNT,
        REPORT_USERS_REASON.FAKE_NAME,
        REPORT_USERS_REASON.POSTING_INAPPROPRIATE,
        REPORT_USERS_REASON.HARASSMENT_BULLYING,
        REPORT_USERS_REASON.SOMETHING_ELSE,
      ])
      .withMessage('validate.in_value_reason_user'),
    body('explaination').exists().withMessage('validate.required'),
    body('mediaData').exists().withMessage('validate.required'),
  ],
};

module.exports = {
  getInfo,
  getProfilePost,
  getProfileFollower,
  getProfileFollowing,
  followUser,
  unfollowUser,
  blockUser,
  unblockUser,
  reportUser,
  validate,
};
