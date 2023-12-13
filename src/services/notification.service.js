const {
  NOTIFICATION_CHECK,
  NOTIFICATION_STATUS,
  NOTIFICATION_ACTION_TYPE,
  LIKEABLE_TYPE,
} = require('../constants/const');
const DB = require('../models/postgres');
const { successResponse } = require('../utils/response');
const throwError = require('../libs/throwError');
const appCodes = require('../constants/appCodes');
const { QueryTypes } = require('sequelize');
const { findOneUser } = require('./user.service');
const config = require('../app.config');
const appMessages = require('../constants/appMessages');

const getListNotifications = async (userId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await DB.models.notifications.count({ where: { userId } });
  const maxPage = Math.ceil(total / pageSize);

  let include = [
    { model: DB.sequelize.model('users'), attributes: ['id', 'full_name', 'avatar'], as: 'fireUser', paranoid: false },
    { model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' },
  ];
  let includeAdmin = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include: includeAdmin,
    order: [['admin_id', 'ASC']],
  });
  const data = await DB.models.notifications.findAll({
    where: { userId },
    include,
    offset: Math.abs(currentPage / 1 - 1) * pageSize,
    limit: Math.abs(pageSize),
    order: [['createdAt', 'DESC']],
  });

  await Promise.all([
    DB.models.notifications.update(
      {
        isCheckable: NOTIFICATION_CHECK.CHECKED,
      },
      { where: { userId } }
    ),
    DB.models.displayedNotifications.destroy({
      where: { notificationUserId: userId, activityType: NOTIFICATION_ACTION_TYPE.COMMENT },
    }),
  ]);
  return {
    notificationsData: !data
      ? []
      : data.map(item => {
          return {
            id: item?.id,
            admin:
              item?.admin !== null
                ? {
                    id: adminData.id,
                    full_name: adminData?.admin?.name,
                    avatar:
                      adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
                  }
                : null,
            fireUser: item?.fireUser,
            type: item?.type,
            notificationTitle: item?.notificationTitle,
            notificationContent: item?.notificationText,
            countNotification: item?.countNotification,
            commentId: item?.commentId,
            replyId: item?.replyId,
            actionId: item?.actionId,
            actionType: item?.actionType,
            status: item?.status,
            createdAt: item?.createdAt,
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

const notificationDetail = async (userId, notificationId) => {
  const data = await DB.models.notifications.findOne({
    where: {
      userId,
      id: notificationId,
    },
  });
  if (!data) {
    throwError({
      message: 'You cannot see notifications that are not yours',
      status: 400,
      code: appCodes.internalError,
    });
  }
  return {
    id: data.id,
    notificationTitle: data.notificationTitle,
    notificationContent: data.notificationText,
    createdAt: data.createdAt,
  };
};

const readAllNotifications = async userId => {
  await DB.models.notifications.update(
    {
      status: NOTIFICATION_STATUS.READ,
    },
    { where: { userId } }
  );
  return successResponse('Read all notifications successfully');
};
const updateStatusNotification = async (userId, notificationId, status) => {
  const checkValidNotification = await DB.models.notifications.findOne({
    where: {
      userId,
      id: notificationId,
    },
  });
  if (!checkValidNotification) {
    throwError({
      message: 'You cannot update notifications that are not yours',
      status: 400,
      code: appCodes.internalError,
    });
  }
  await DB.models.notifications.update(
    {
      status: status,
    },
    {
      where: {
        userId,
        id: notificationId,
      },
    }
  );
};

const getNotificationComments = async (userId, postId, currentPage, pageSize) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await DB.models.comments.count({
    where: { postId, commentParentId: 0 },
  });
  const maxPage = Math.ceil(total / pageSize);
  const data = await DB.models.comments.findAll({
    where: { postId, commentParentId: 0 },
    include: [
      {
        model: DB.sequelize.model('comments'),
        as: 'replies',
        include: [
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']],
          },
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']],
            as: 'replyUser',
          },
          { model: DB.sequelize.model('likes') },
        ],
      },
      { model: DB.sequelize.model('users'), attributes: ['id', 'full_name'] },
      {
        model: DB.sequelize.model('likes'),
      },
    ],
    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [['createdAt', 'ASC']],
  });
  if (!userId) {
    return {
      commentsData: data.map(item => {
        return {
          id: item?.id,
          user: item?.user,
          replies: item?.replies.map(reply => {
            return {
              id: reply?.id,
              commentParentId: reply?.commentParentId,
              user: reply?.user,
              content: reply?.content,
              replyUser: reply?.replyUser,
              likesCount: reply?.likes?.length,
              createdAt: reply?.createdAt,
            };
          }),
          content: item?.content,
          likesCount: item?.likes?.length,
          createdAt: item?.createdAt,
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
  const likedReplies = await DB.models.likes.findAll({
    attributes: ['likeable_id'],
    where: { userId, likeable_type: 'comments' },
    raw: true,
  });
  const likedCommentIds = new Set(likedReplies.map(comment => comment.likeable_id));
  const likedReplyIds = new Set(likedReplies.map(reply => reply.likeable_id));
  const result = !data
    ? []
    : data.map(comment => {
        const commentData = comment.dataValues;
        commentData.isLiked = likedCommentIds.has(comment.id);
        commentData.replies = commentData.replies.map(reply => {
          const replyData = reply.dataValues;
          replyData.isLiked = likedReplyIds.has(reply.id);
          return replyData;
        });
        return commentData;
      });
  return {
    commentsData: !result
      ? []
      : result.map(item => {
          return {
            id: item?.id,
            user: {
              id: item?.user?.id,
              full_name: item?.user?.full_name,
              avatar: item?.user?.avatar,
              isBlueTick: item?.user?.is_blue_tick,
            },
            replies: item?.replies.map(reply => {
              return {
                id: reply?.id,
                commentParentId: reply?.commentParentId,
                user: reply?.user,
                content: reply?.content,
                replyUser: reply?.replyUser,
                likesCount: reply?.likes?.length,
                isLiked: reply?.isLiked,
                createdAt: reply?.createdAt,
              };
            }),
            content: item?.content,
            likesCount: item?.likes?.length,
            createdAt: item?.createdAt,
            isLiked: item?.isLiked,
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

const getNotificationCommentReply = async (userId, postId, commentId) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const comment = await DB.models.comments.findOne({
    where: { id: commentId, commentParentId: 0, postId },
  });
  if (!comment) {
    return {
      commentsData: [],
    };
  }

  const firstComment = await DB.models.comments.findAll({
    where: {
      commentParentId: 0,
      postId,
    },
    limit: 1,
    order: [['id', 'ASC']],
    raw: true,
  });
  if (comment?.id === firstComment[0].id) {
    return {
      commentsData: [],
    };
  }
  const lastComment = await DB.models.comments.findAll({
    where: {
      commentParentId: 0,
      postId,
    },
    include: [
      {
        model: DB.sequelize.model('comments'),
        as: 'replies',
        include: [
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']],
          },
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']],
            as: 'replyUser',
          },
          { model: DB.sequelize.model('likes') },
        ],
      },
      { model: DB.sequelize.model('users'), attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']] },
      {
        model: DB.sequelize.model('likes'),
      },
    ],
    limit: 10,
    order: [['id', 'DESC']],
  });
  const checkLastComment = lastComment.some(item => {
    if (item.id === comment.id) {
      return true;
    }
    return false;
  });

  const dataLastComment = await checkLastCommentData(userId, lastComment);

  if (checkLastComment) {
    return dataLastComment;
  }
  const lowerIdQuery = DB.sequelize.query(
    `SELECT "id" FROM (SELECT "id" FROM "comments" WHERE "post_id" = :postId AND "comment_parent_id" = 0 AND "id" < :commentId ORDER BY "id" DESC LIMIT 5) AS "lower_id" ORDER BY "id" ASC LIMIT 1;`,
    { replacements: { postId, commentId }, type: QueryTypes.SELECT }
  );

  const upperIdQuery = DB.sequelize.query(
    `SELECT "id" FROM (SELECT "id" FROM "comments" WHERE "post_id" = :postId AND "comment_parent_id" = 0 AND "id" > :commentId ORDER BY "id" ASC LIMIT 4) AS "upper_id" ORDER BY "id" DESC LIMIT 1;`,
    { replacements: { postId, commentId }, type: QueryTypes.SELECT }
  );

  const [lowerIdResult, upperIdResult] = await Promise.all([lowerIdQuery, upperIdQuery]);
  const data = await DB.models.comments.findAll({
    where: {
      [DB.Op.and]: [
        { postId },
        {
          id: {
            [DB.Op.between]: [lowerIdResult[0].id, upperIdResult[0].id],
          },
        },
      ],
      commentParentId: 0,
    },
    include: [
      {
        model: DB.sequelize.model('comments'),
        as: 'replies',
        include: [
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']],
          },
          {
            model: DB.sequelize.model('users'),
            attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']],
            as: 'replyUser',
          },
          { model: DB.sequelize.model('likes') },
        ],
      },
      { model: DB.sequelize.model('users'), attributes: ['id', 'full_name', 'avatar'] },
      {
        model: DB.sequelize.model('likes'),
      },
    ],
    order: [['id', 'ASC']],
  });
  if (!userId) {
    return {
      commentsData: data.map(item => {
        return {
          id: item?.id,
          user: item?.user,
          replies: item?.replies.map(reply => {
            return {
              id: reply?.id,
              commentParentId: reply?.commentParentId,
              user: reply?.user,
              content: reply?.content,
              replyUser: reply?.replyUser,
              likesCount: reply?.likes?.length,
              createdAt: reply?.createdAt,
            };
          }),
          content: item?.content,
          likesCount: item?.likes?.length,
          createdAt: item?.createdAt,
        };
      }),
    };
  }
  const likedReplies = await DB.models.likes.findAll({
    attributes: ['likeable_id'],
    where: { userId, likeable_type: LIKEABLE_TYPE.COMMENT },
    raw: true,
  });
  const likedCommentIds = new Set(likedReplies.map(comment => comment.likeable_id));
  const likedReplyIds = new Set(likedReplies.map(reply => reply.likeable_id));
  const result = !data
    ? []
    : data.map(comment => {
        const commentData = comment.dataValues;
        commentData.isLiked = likedCommentIds.has(comment.id);
        commentData.replies = commentData.replies.map(reply => {
          const replyData = reply.dataValues;
          replyData.isLiked = likedReplyIds.has(reply.id);
          return replyData;
        });
        return commentData;
      });
  return {
    commentsData: !result
      ? []
      : result.map(item => {
          return {
            id: item?.id,
            user: item?.user,
            replies: item?.replies.map(reply => {
              return {
                id: reply?.id,
                commentParentId: reply?.commentParentId,
                user: reply?.user,
                content: reply?.content,
                replyUser: reply?.replyUser,
                likesCount: reply?.likes?.length,
                isLiked: reply?.isLiked,
                createdAt: reply?.createdAt,
              };
            }),
            content: item?.content,
            likesCount: item?.likes?.length,
            createdAt: item?.createdAt,
            isLiked: item?.isLiked,
          };
        }),
  };
};

const getNotificationFollow = async (userId, followerId) => {
  const [user, followerUser] = await Promise.all([
    findOneUser({ where: { id: userId } }),
    findOneUser({
      where: { id: followerId },
    }),
  ]);
  if (!user || !followerUser) {
    throwError({
      message: 'User not found',
      status: 404,
      code: appCodes.notFound,
    });
  }
  const include = [
    {
      model: DB.sequelize.model('users'),
      as: 'follower',
      attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], 'biography'],
    },
  ];
  const data = await DB.models.followers.findOne({
    where: {
      followerId: userId,
      followingId: followerId,
    },
    include,
    attributes: { exclude: ['followerId', 'followingId'] },
  });
  const checkisFollow = await DB.models.followers.findOne({
    where: {
      followerId: followerId,
      followingId: userId,
    },
  });
  return {
    followersData: !data
      ? null
      : {
          id: data.id,
          follower: data.follower,
          isFollow: checkisFollow ? true : false,
          createdAt: data.createdAt,
          updatedAt: data.updatedAt,
        },
  };
};

const checkLastCommentData = async (userId, data) => {
  if (!userId) {
    return {
      commentsData: data.map(item => {
        return {
          id: item?.id,
          user: item?.user,
          replies: item?.replies.map(reply => {
            return {
              id: reply?.id,
              commentParentId: reply?.commentParentId,
              user: reply?.user,
              content: reply?.content,
              replyUser: reply?.replyUser,
              likesCount: reply?.likes?.length,
              createdAt: reply?.createdAt,
            };
          }),
          content: item?.content,
          likesCount: item?.likes?.length,
          createdAt: item?.createdAt,
        };
      }),
    };
  }
  const likedReplies = await DB.models.likes.findAll({
    attributes: ['likeable_id'],
    where: { userId, likeable_type: LIKEABLE_TYPE.COMMENT },
    raw: true,
  });
  const likedCommentIds = new Set(likedReplies.map(comment => comment.likeable_id));
  const likedReplyIds = new Set(likedReplies.map(reply => reply.likeable_id));
  const result = !data
    ? []
    : data.map(comment => {
        const commentData = comment.dataValues;
        commentData.isLiked = likedCommentIds.has(comment.id);
        commentData.replies = commentData.replies.map(reply => {
          const replyData = reply.dataValues;
          replyData.isLiked = likedReplyIds.has(reply.id);
          return replyData;
        });
        return commentData;
      });
  return {
    commentsData: !result
      ? []
      : result.map(item => {
          return {
            id: item?.id,
            user: item?.user,
            replies: item?.replies.map(reply => {
              return {
                id: reply?.id,
                commentParentId: reply?.commentParentId,
                user: reply?.user,
                content: reply?.content,
                replyUser: reply?.replyUser,
                likesCount: reply?.likes?.length,
                isLiked: reply?.isLiked,
                createdAt: reply?.createdAt,
              };
            }),
            content: item?.content,
            likesCount: item?.likes?.length,
            createdAt: item?.createdAt,
            isLiked: item?.isLiked,
          };
        }),
  };
};

module.exports = {
  getListNotifications,
  notificationDetail,
  readAllNotifications,
  updateStatusNotification,
  getNotificationComments,
  getNotificationCommentReply,
  getNotificationFollow,
};
