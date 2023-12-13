const profileController = require('../controllers/profile.controller');

const profileRouter = [
  {
    url: '/profile/:profileId',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.getInfo,
    action: profileController.getInfo,
    method: 'get',
  },
  {
    url: '/profile/:profileId/posts',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.getProfilePost,
    action: profileController.getProfilePost,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/profile/:profileId/followers',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.getProfileFollower,
    action: profileController.getProfileFollower,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/profile/:profileId/following',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.getProfileFollowing,
    action: profileController.getProfileFollowing,
    isPaginate: true,
    method: 'get',
  },
  {
    url: '/profile/:profileId/follow',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.followUser,
    action: profileController.followUser,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/profile/:profileId/unfollow',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.unfollowUser,
    action: profileController.unfollowUser,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/profile/:profileId/block',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.blockUser,
    action: profileController.blockUser,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/profile/:profileId/unblock',
    rateLimit: { window: 1000, max: 20 },
    validation: profileController.validate.unblockUser,
    action: profileController.unblockUser,
    isAuthenticate: true,
    method: 'post',
  },
  {
    url: '/profile/:profileId/report',
    rateLimit: { window: 1000, max: 20 },
    action: profileController.reportUser,
    validation: profileController.validate.reportUser,
    isAuthenticate: true,
    method: 'post',
  },
];

module.exports = profileRouter;
