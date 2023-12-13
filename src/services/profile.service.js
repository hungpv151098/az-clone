const config = require('../app.config');
const appCodes = require('../constants/appCodes');
const appMessages = require('../constants/appMessages');
const {
  POST_STATUS,
  NOTIFICATION_ACTION_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_CHECK,
  NOTIFICATION_STATUS,
  MEDIABLE_TYPE,
  MEDIA_LINK,
  ROLE,
  USER_IS_BAN,
} = require('../constants/const');

const throwError = require('../libs/throwError');
const { sortTags } = require('../libs/util');
const DB = require('../models/postgres');
const { successResponse } = require('../utils/response');
const { sendNotification } = require('./fcm/firebase.service');
const { findOneUser } = require('./user.service');

const getInfo = async (profileId, userId) => {
  const [profile, postCount, followerCount, followingCount] = await Promise.all([
    findOneUser({
      where: { id: profileId, isBan: USER_IS_BAN.IS_NOT_BAN },
      attributes: ['id', 'full_name', 'user_name', 'admin_id', 'avatar', ['is_blue_tick', 'isBlueTick'], 'biography'],
      raw: true,
    }),
    getPostCount(profileId),
    getFollowerCount(profileId),
    getFollowingCount(profileId),
  ]);
  if (!profile) {
    throwError({
      message: 'User not found!',
      status: 404,
      code: appCodes.notFound,
    });
  }
  let isFollow = false;
  let isBlocked = false;
  if (userId) {
    const user = await DB.models.users.findOne({
      where: {
        id: userId,
      },
    });
    if (user.isBan === USER_IS_BAN.IS_BAN) {
      throwError({
        message: appMessages.unauthorized,
        status: 401,
        code: appCodes.unauthorized,
      });
    }
    const checkUserFollow = await DB.models.followers.findOne({
      where: {
        followerId: userId,
        followingId: profileId,
      },
    });
    const checkUserBlock = await DB.models.blockUsers.findOne({
      where: {
        userId,
        userBlockedId: profileId,
      },
    });
    if (checkUserFollow) {
      isFollow = true;
    }
    if (checkUserBlock) {
      isBlocked = true;
    }
  }
  if (profile.admin_id !== null) {
    let include = [
      { model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'username', 'avatar'], as: 'admin' },
    ];
    const adminData = await DB.models.users.findOne({
      include,
      order: [['admin_id', 'ASC']],
      nest: true,
      raw: true,
    });
    const postCountAdmin = await getPostCountAdmin();
    return {
      profile: {
        id: adminData?.id,
        username: adminData?.admin?.username || null,
        full_name: adminData?.admin?.name,
        biography: adminData?.biography || null,
        avatar: adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
        isAdmin: ROLE.ADMIN,
        isBlocked,
      },
      postCount: postCountAdmin,
      followerCount,
      followingCount,
      isFollow,
    };
  }
  return {
    profile: {
      id: profile?.id,
      username: profile?.user_name || null,
      full_name: profile?.full_name,
      avatar: profile?.avatar || null,
      isBlueTick: profile?.isBlueTick,
      biography: profile?.biography || null,
      isAdmin: ROLE.USER,
      isBlocked,
    },
    postCount,
    followerCount,
    followingCount,
    isFollow,
  };
};

const getPostCount = async profileId => {
  return await DB.models.posts.count({ where: { userId: profileId, status: POST_STATUS.APPROVED } });
};

const getPostCountAdmin = async () => {
  return await DB.models.posts.count({ where: { adminId: { [DB.Op.ne]: null }, status: POST_STATUS.APPROVED } });
};

const getFollowerCount = async profileId => {
  return await DB.models.followers.count({
    where: { followingId: profileId },
    include: [
      {
        model: DB.sequelize.model('users'),
        as: 'follower',
      },
    ],
  });
};

const getFollowingCount = async profileId => {
  return await DB.models.followers.count({
    where: { followerId: profileId },
    include: [
      {
        model: DB.sequelize.model('users'),
        as: 'following',
      },
    ],
  });
};

const getProfilePost = async (userId, profileId, currentPage, pageSize) => {
  const user = await findOneUser({
    where: { id: profileId },
    raw: true,  
  });
  if (!user) {
    throwError({
      message: appMessages.userNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  if (user.adminId !== null) {
    const data = getPostAdmin(userId, currentPage, pageSize);
    return data;
  }

  const data = getPostUser(userId, profileId, currentPage, pageSize);
  return data;
};

const getPostAdmin = async (userId, currentPage, pageSize) => {
  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getPostCountAdmin();
  const maxPage = Math.ceil(total / pageSize);
  const data = await DB.models.posts.findAll({
    where: { status: POST_STATUS.APPROVED, adminId: { [DB.Op.ne]: null } },
    include: [
      {
        model: DB.sequelize.model('medias'),
        where: {
          mediableType: MEDIABLE_TYPE.POST,
          type: {
            [DB.Op.ne]: MEDIA_LINK.LINK,
          },
        },
        required: false,
      },
      {
        model: DB.sequelize.model('medias'),
        where: {
          type: {
            [DB.Op.eq]: MEDIA_LINK.LINK,
          },
        },
        required: false,
        as: 'link',
      },
      {
        model: DB.sequelize.model('postTags'),
        include: [
          {
            model: DB.sequelize.model('tags'),
          },
        ],
      },
    ],
    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [
      ['createdAt', 'DESC'],
      [DB.sequelize.model('medias'), 'id', 'ASC'],
    ],
  });
  if (!userId) {
    return {
      postData: !data
        ? []
        : data.map(item => {
            return {
              id: item?.id,
              user: null,
              admin: {
                id: adminData?.id,
                full_name: adminData?.admin?.name,
                avatar: adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
              },
              content: item?.content,
              status: item?.status,
              createdAt: item?.createdAt,
              updatedAt: item?.updatedAt,
              media: item?.medias,
              link: item?.link,
              postTag: sortTags(item?.postTags),
              likesCount: item?.likesCount,
              commentsCount: item?.commentsCount,
              sharesCount: item?.sharesCount,
              type: item?.type,
            };
          }),
      paginationOptions: {
        total,
        maxPage: !maxPage ? 0 : maxPage,
        currentPage: currentPage / 1,
        pageSize: pageSize / 1,
      },
    };
  }
  const likedPosts = await DB.models.likes.findAll({
    attributes: ['likeable_id'],
    where: { userId, likeable_type: 'posts' },
    raw: true,
  });
  const likedPostsIds = new Set(likedPosts.map(comment => comment.likeable_id));

  return {
    postData: !data
      ? []
      : data.map(item => {
          return {
            id: item?.id,
            user: null,
            admin: {
              id: adminData?.id,
              full_name: adminData?.admin?.name,
              avatar: adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
            },
            content: item?.content,
            status: item?.status,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            media: item?.medias,
            link: item?.link,
            postTag: sortTags(item?.postTags),
            likesCount: item?.likesCount,
            commentsCount: item?.commentsCount,
            sharesCount: item?.sharesCount,
            type: item?.type,
            isLiked: likedPostsIds.has(item.id),
          };
        }),
    paginationOptions: {
      total,
      maxPage: !maxPage ? 0 : maxPage,
      currentPage: currentPage / 1,
      pageSize: pageSize / 1,
    },
  };
};

const getPostUser = async (userId, profileId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getPostCount(profileId);
  const maxPage = Math.ceil(total / pageSize);

  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });
  const data = await DB.models.posts.findAll({
    where: { status: POST_STATUS.APPROVED, userId: profileId },
    include: [
      {
        model: DB.sequelize.model('users'),
        attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
      },
      {
        model: DB.sequelize.model('medias'),
        where: {
          mediableType: MEDIABLE_TYPE.POST,
          type: {
            [DB.Op.ne]: MEDIA_LINK.LINK,
          },
        },
        required: false,
      },
      {
        model: DB.sequelize.model('medias'),
        where: {
          type: {
            [DB.Op.eq]: MEDIA_LINK.LINK,
          },
        },
        required: false,
        as: 'link',
      },
      {
        model: DB.sequelize.model('postTags'),
        include: [
          {
            model: DB.sequelize.model('tags'),
          },
        ],
      },
      {
        model: DB.sequelize.model('posts'),
        as: 'share',
        include: [
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
          },
          {
            model: DB.sequelize.model('adminUsers'),
            attributes: ['id', 'name', 'avatar'],
            as: 'admin',
          },
          {
            model: DB.sequelize.model('medias'),
            where: {
              mediableType: MEDIABLE_TYPE.POST,
              type: {
                [DB.Op.ne]: MEDIA_LINK.LINK,
              },
            },
            required: false,
          },
          {
            model: DB.sequelize.model('medias'),
            where: {
              type: {
                [DB.Op.eq]: MEDIA_LINK.LINK,
              },
            },
            required: false,
            as: 'link',
          },
          {
            model: DB.sequelize.model('postTags'),
            include: [
              {
                model: DB.sequelize.model('tags'),
              },
            ],
          },
        ],
      },
    ],
    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [
      ['createdAt', 'DESC'],
      [DB.sequelize.model('medias'), 'id', 'ASC'],
      ['share', DB.sequelize.model('medias'), 'id', 'ASC'],
    ],
  });
  if (!userId) {
    return {
      postData: !data
        ? []
        : data.map(item => {
            return {
              id: item?.id,
              user: item?.user,
              admin: null,
              content: item?.content,
              status: item?.status,
              createdAt: item?.createdAt,
              updatedAt: item?.updatedAt,
              media: item?.medias,
              link: item?.link,
              postTag: sortTags(item?.postTags),
              share:
                typeof item?.share?.id !== 'undefined'
                  ? {
                      id: item?.share?.id,
                      user: item?.share?.user?.adminId === null ? item?.share?.user : null,
                      admin:
                        item?.share?.user?.adminId !== null
                          ? {
                              id: adminData.id,
                              full_name: adminData?.admin?.name,
                              avatar:
                                adminData?.admin?.avatar !== null
                                  ? `${config.adminWebView}${adminData?.admin?.avatar}`
                                  : null,
                            }
                          : null,
                      content: item?.share?.content,
                      status: item?.share?.status,
                      createdAt: item?.share?.createdAt,
                      updatedAt: item?.share?.updatedAt,
                      media: item?.share?.medias,
                      link: item?.share?.link,
                      postTag: sortTags(item?.share?.postTags),
                    }
                  : null,
              likesCount: item?.likesCount,
              commentsCount: item?.commentsCount,
              sharesCount: item?.sharesCount,
              type: item?.type,
            };
          }),
      paginationOptions: {
        total,
        maxPage: !maxPage ? 0 : maxPage,
        currentPage: currentPage / 1,
        pageSize: pageSize / 1,
      },
    };
  }
  const likedPosts = await DB.models.likes.findAll({
    attributes: ['likeable_id'],
    where: { userId, likeable_type: 'posts' },
    raw: true,
  });
  const likedPostsIds = new Set(likedPosts.map(comment => comment.likeable_id));

  return {
    postData: !data
      ? []
      : data.map(item => {
          return {
            id: item?.id,
            user: item?.user,
            admin: null,
            content: item?.content,
            status: item?.status,
            createdAt: item?.createdAt,
            updatedAt: item?.updatedAt,
            media: item?.medias,
            link: item?.link,
            postTag: sortTags(item?.postTags),
            share:
              typeof item?.share?.id !== 'undefined'
                ? {
                    id: item?.share?.id,
                    user: item?.share?.user?.adminId === null ? item?.share?.user : null,
                    admin:
                      item?.share?.user?.adminId !== null
                        ? {
                            id: adminData.id,
                            full_name: adminData?.admin?.name,
                            avatar:
                              adminData?.admin?.avatar !== null
                                ? `${config.adminWebView}${adminData?.admin?.avatar}`
                                : null,
                          }
                        : null,
                    content: item?.share?.content,
                    status: item?.share?.status,
                    createdAt: item?.share?.createdAt,
                    updatedAt: item?.share?.updatedAt,
                    media: item?.share?.medias,
                    link: item?.share?.link,
                    postTag: sortTags(item?.share?.postTags),
                  }
                : null,
            likesCount: item?.likesCount,
            commentsCount: item?.commentsCount,
            sharesCount: item?.sharesCount,
            type: item?.type,

            isLiked: likedPostsIds.has(item.id),
          };
        }),
    paginationOptions: {
      total,
      maxPage: !maxPage ? 0 : maxPage,
      currentPage: currentPage / 1,
      pageSize: pageSize / 1,
    },
  };
};

const getProfileFollower = async (profileId, currentPage, pageSize, userId) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getFollowerCount(profileId);
  const maxPage = Math.ceil(total / pageSize);
  const adminData = await DB.models.adminUsers.findOne({ order: [['id', 'ASC']] });
  const data = await DB.models.followers.findAll({
    where: { followingId: profileId },
    include: [
      {
        model: DB.sequelize.model('users'),
        as: 'follower',
        attributes: ['id', 'full_name', 'admin_id', 'avatar', ['is_blue_tick', 'isBlueTick'], 'biography'],
        where: {
          isBan: USER_IS_BAN.IS_NOT_BAN,
        },
      },
    ],
    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [['createdAt', 'DESC']],
    raw: true,
    nest: true,
  });
  let allFollowerData = [];
  let allBlockedData = [];
  if (userId) {
    const allFollower = await DB.models.followers.findAll({
      where: {
        followerId: userId,
      },
      raw: true,
    });
    allFollowerData = allFollower.map(item => item.followingId);
    const allBlocked = await DB.models.blockUsers.findAll({
      where: {
        userId,
      },
      raw: true,
    });
    allBlockedData = allBlocked.map(item => item.userBlockedId);
  }
  return {
    followersData: !data
      ? []
      : data.map(item => {
          return {
            id: item.id,
            follower:
              item?.follower?.admin_id !== null
                ? {
                    id: item?.follower?.id,
                    full_name: adminData?.name,
                    avatar: adminData?.avatar !== null ? `${config.adminWebView}${adminData?.avatar}` : null,
                    biography: item?.follower?.biography,
                    isBlueTick: item?.following?.isBlueTick,
                    isAdmin: ROLE.ADMIN,
                    isBlocked: userId ? allBlockedData.includes(parseInt(item.userId)) : false,
                  }
                : {
                    id: item?.follower?.id,
                    full_name: item?.follower?.full_name,
                    avatar: item?.follower?.avatar,
                    biography: item?.follower?.biography,
                    isBlueTick: item?.follower?.isBlueTick,
                    isAdmin: ROLE.USER,
                    isBlocked: userId ? allBlockedData.includes(parseInt(item.userId)) : false,
                  },
            isFollow: userId ? allFollowerData.includes(parseInt(item.followerId)) : false,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }),
    paginationOptions: {
      total,
      maxPage: !maxPage ? 0 : maxPage,
      currentPage: currentPage / 1,
      pageSize: pageSize / 1,
    },
  };
};

const getProfileFollowing = async (profileId, currentPage, pageSize, userId) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getFollowingCount(profileId);
  const maxPage = Math.ceil(total / pageSize);
  const adminData = await DB.models.adminUsers.findOne({ order: [['id', 'ASC']] });
  const data = await DB.models.followers.findAll({
    where: { followerId: profileId },
    include: [
      {
        model: DB.sequelize.model('users'),
        as: 'following',
        attributes: ['id', 'full_name', 'admin_id', 'avatar', ['is_blue_tick', 'isBlueTick'], 'biography'],
        where: {
          isBan: USER_IS_BAN.IS_NOT_BAN,
        },
      },
    ],
    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [['createdAt', 'DESC']],
    raw: true,
    nest: true,
  });
  let allFollowerData = [];
  let allBlockedData = [];
  if (userId) {
    const allFollower = await DB.models.followers.findAll({
      where: {
        followerId: userId,
      },
      raw: true,
    });
    allFollowerData = allFollower.map(item => item.followingId);
    const allBlocked = await DB.models.blockUsers.findAll({
      where: {
        userId,
      },
      raw: true,
    });
    allBlockedData = allBlocked.map(item => item.userBlockedId);
  }
  return {
    followersData: !data
      ? []
      : data.map(item => {
          return {
            id: item.id,
            following:
              item?.following?.admin_id !== null
                ? {
                    id: item?.following?.id,
                    full_name: adminData?.name,
                    avatar: adminData?.avatar !== null ? `${config.adminWebView}${adminData?.avatar}` : null,
                    biography: item?.following?.biography,
                    isBlueTick: item?.following?.isBlueTick,
                    isAdmin: ROLE.ADMIN,
                    isBlocked: userId ? allBlockedData.includes(parseInt(item.userBlockedId)) : false,
                  }
                : {
                    id: item?.following?.id,
                    full_name: item?.following?.full_name,
                    avatar: item?.following?.avatar,
                    biography: item?.following?.biography,
                    isBlueTick: item?.following?.isBlueTick,
                    isAdmin: ROLE.USER,
                    isBlocked: userId ? allBlockedData.includes(parseInt(item.userBlockedId)) : false,
                  },
            isFollow: userId ? allFollowerData.includes(parseInt(item.followingId)) : false,
            createdAt: item.createdAt,
            updatedAt: item.updatedAt,
          };
        }),
    paginationOptions: {
      total,
      maxPage: !maxPage ? 0 : maxPage,
      currentPage: currentPage / 1,
      pageSize: pageSize / 1,
    },
  };
};

const followUser = async (userId, profileId) => {
  const t = await DB.sequelize.transaction();
  try {
    const data = await DB.models.followers.findOne({
      where: { followerId: userId, followingId: profileId },
      paranoid: false,
    });
    if (data) {
      if (data.deletedAt !== null) {
        await DB.models.followers.restore({
          where: { followerId: userId, followingId: profileId },
        });
      }
      return data;
    }
    const result = await DB.models.followers.create(
      {
        followerId: userId,
        followingId: profileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
    const checkDisplay = await DB.models.displayedNotifications.findOne({
      where: {
        userId: result.followerId,
        notificationUserId: profileId,
        activityType: NOTIFICATION_ACTION_TYPE.FOLLOWS,
      },
    });
    if (!checkDisplay) {
      await isNoficationCheck(userId, profileId, result, t);
    }
    await t.commit();
    return result;
  } catch (e) {
    await t.rollback();
    throwError({
      message: e,
      status: 500,
      code: appCodes.internalError,
    });
  }
};

const unfollowUser = async (userId, profileId) => {
  const data = await DB.models.followers.findOne({ where: { followerId: userId, followingId: profileId } });
  if (!data) {
    successResponse('Unfollow sucessfully');
  }
  await DB.models.followers.destroy({
    where: { followerId: userId, followingId: profileId },
  });
  return successResponse('Unfollow sucessfully');
};

const isNoficationCheck = async (userId, profileId, result, t) => {
  const [user, profile] = await Promise.all([
    findOneUser({ where: { id: userId }, raw: true }),
    findOneUser({ where: { id: profileId }, raw: true }),
  ]);

  const notification = await DB.models.notifications.findOne({
    where: {
      type: NOTIFICATION_TYPE.FOLLOW,
      userId: profileId,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });

  if (!notification) {
    const content = `${user.fullName} has started following you`;
    await createNotificationFollow(profileId, userId, content, t);
    await sendNotification(
      profile?.deviceToken,
      content,
      userId.toString(),
      NOTIFICATION_ACTION_TYPE.USERS,
      notification?.countNotification
    );
    await updateDisplayedNotificationFollow(profileId, userId, result, t);
    return successResponse('Send successfully notification!');
  }

  const content = `${user.fullName} and ${notification.countNotification + 1} others has started following you`;
  await updateNotificationFollow(profileId, userId, content, t);
  await sendNotification(
    profile?.deviceToken,
    content,
    userId.toString(),
    NOTIFICATION_ACTION_TYPE.USERS,
    notification?.countNotification + 1
  );
  await updateDisplayedNotificationFollow(profileId, userId, result, t);
  return successResponse('Send successfully notification!');
};

const createNotificationFollow = async (profileId, userId, content, t) => {
  return await DB.models.notifications.create(
    {
      userId: profileId,
      fireUserId: userId,
      type: NOTIFICATION_TYPE.FOLLOW,
      notificationTitle: content,
      actionId: userId,
      actionType: NOTIFICATION_ACTION_TYPE.USERS,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
      status: NOTIFICATION_STATUS.UNREAD,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
};

const updateDisplayedNotificationFollow = async (profileId, userId, result, t) => {
  return await DB.models.displayedNotifications.create(
    {
      userId,
      notificationUserId: profileId,
      activityId: result.id,
      activityType: NOTIFICATION_ACTION_TYPE.FOLLOWS,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
};

const updateNotificationFollow = async (profileId, userId, content, t) => {
  const notification = await DB.models.notifications.findOne({
    where: {
      type: NOTIFICATION_TYPE.FOLLOW,
      userId: profileId,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (!notification) {
    throwError({
      message: 'Notification is not found',
      status: 404,
      code: appCodes.notFound,
    });
  }
  await DB.models.notifications.update(
    {
      fireUserId: userId,
      notificationTitle: content,
      countNotification: notification.countNotification + 1,
    },
    {
      where: {
        id: notification.id,
      },
    },
    { transaction: t }
  );
};

const reportUser = async (userId, userReportId, reason, explaination, mediaData) => {
  const user = await DB.models.users.findOne({ where: { id: userReportId, isBan: USER_IS_BAN.IS_NOT_BAN } });
  if (!user) {
    throwError({
      message: 'User not found!',
      status: 404,
      code: appCodes.notFound,
    });
  }

  if (userId === userReportId) {
    throwError({
      message: "You can't report yourself",
      status: 409,
      code: appCodes.conflict,
    });
  }

  const reportData = await DB.models.reportUsers.findOne({
    where: { userId, reportId: userReportId },
  });
  if (!reportData) {
    const data = await DB.models.reportUsers.create({
      userId,
      reportId: userReportId,
      reason: reason.toString(),
      explaination,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (const media of mediaData) {
      await DB.models.medias.create({
        mediableId: data.id,
        mediableType: MEDIABLE_TYPE.REPORT_USER,
        type: media.type,
        mediaUrl: media.mediaUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
    }
    return data;
  }
  throwError({
    message: 'User reported this post!',
    status: 409,
    code: appCodes.conflict,
  });
};

const blockUser = async (userId, profileId) => {
  const t = await DB.sequelize.transaction();
  try {
    const data = await DB.models.blockUsers.findOne({
      where: { userId, userBlockedId: profileId },
      paranoid: false,
    });
    if (data) {
      if (data.deletedAt !== null) {
        await DB.models.blockUsers.restore({
          where: { userId, userBlockedId: profileId },
        });
        await DB.models.followers.destroy({
          where: { followerId: userId, followingId: profileId },
        });
      }
      return data;
    }
    const result = await DB.models.blockUsers.create(
      {
        userId,
        userBlockedId: profileId,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
    await DB.models.followers.destroy({
      where: { followerId: userId, followingId: profileId },
      transaction: t,
    });
    await t.commit();
    return result;
  } catch (e) {
    await t.rollback();
    throwError({
      message: e,
      status: 500,
      code: appCodes.internalError,
    });
  }
};

const unblockUser = async (userId, profileId) => {
  const data = await DB.models.blockUsers.findOne({ where: { userId, userBlockedId: profileId } });
  if (!data) {
    successResponse('Unblock sucessfully');
  }
  await DB.models.blockUsers.destroy({
    where: { userId, userBlockedId: profileId },
  });
  return successResponse('Unblock sucessfully');
};

module.exports = {
  getInfo,
  getProfilePost,
  getProfileFollower,
  getProfileFollowing,
  followUser,
  unfollowUser,
  reportUser,
  blockUser,
  unblockUser,
};
