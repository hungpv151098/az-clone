const appCodes = require('../constants/appCodes');
const appMessages = require('../constants/appMessages');
const {
  NOTIFICATION_CHECK,
  MESSAGES_STATUS,
  NOTIFICATION_TYPE,
  NOTIFICATION_STATUS,
  LIKEABLE_TYPE,
  MEDIABLE_TYPE,
  NOTIFICATION_ACTION_TYPE,
} = require('../constants/const');
const throwError = require('../libs/throwError');
const DB = require('../models/postgres');
const { successResponse } = require('../utils/response');

const findUsers = async (currentPage, pageSize, keywordSearch) => {
  let options = {};
  options.query = {
    deleted_at: null,
    is_ban: false,
  };
  if (keywordSearch) {
    options.query = {
      ...options.query,
      [DB.Op.or]: [
        { fullName: { [DB.Op.like]: '%' + keywordSearch.toString().trim() + '%' } },
        { userName: { [DB.Op.like]: '%' + keywordSearch.toString().toLowerCase().trim() + '%' } },
      ],
    };
  }
  const response = await DB.models.users.findAll({
    attributes: ['id', 'full_name', 'user_name', 'avatar'],
    where: { ...options.query },
    offset: pageSize ? Math.abs((currentPage / 1 - 1) * pageSize) : null,
    limit: pageSize ? Math.abs(pageSize) : null,
    order: [['createdAt', 'ASC']],
  });

  const maxPage = Math.ceil(!response ? 0 : response.length / pageSize);
  return {
    userData: !response ? [] : response,
    paginationOptions: {
      total: !response ? 0 : response.length,
      maxPage: !maxPage ? 0 : maxPage,
      currentPage: currentPage / 1,
      pageSize: pageSize / 1,
    },
  };
};

const findOneUser = async whereClause => {
  return await DB.models.users.findOne(whereClause);
};

const findAdminUser = async whereClause => {
  return await DB.models.adminUsers.findOne(whereClause);
};

const getNotiMessages = async userId => {
  const notificationsCount = await getNotifications(userId);
  const messagesCount = await getMessages(userId);
  return {
    notifications: notificationsCount,
    messages: messagesCount,
  };
};

const getNotifications = async userId => {
  const data = await DB.models.notifications.count({
    where: {
      userId,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  return data;
};

const getMessages = async userId => {
  const data = await DB.models.chatMessages.count({
    where: {
      receiverUserId: userId,
      status: MESSAGES_STATUS.UNREAD,
    },
  });
  return data;
};

const postsReport = async (userId, postId, reason, explaination, mediaData) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }

  const reportData = await DB.models.reports.findOne({
    where: { userId, postId },
  });
  if (!reportData) {
    const data = await DB.models.reports.create({
      userId,
      postId,
      reason: reason.toString(),
      explaination,
      createdAt: new Date(),
      updatedAt: new Date(),
    });
    for (const media of mediaData) {
      await DB.models.medias.create({
        mediableId: data.id,
        mediableType: MEDIABLE_TYPE.REPORT,
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

const userLike = async (userId, likeableId, likeableType) => {
  if (likeableType !== LIKEABLE_TYPE.POST && likeableType !== LIKEABLE_TYPE.COMMENT) {
    throwError({
      message: 'likeableType must be post or comment ',
      status: 409,
      code: appCodes.conflict,
    });
  }
  if (likeableType === LIKEABLE_TYPE.POST) {
    const post = await DB.models.posts.findOne({ where: { id: likeableId } });
    if (!post) {
      throwError({
        message: appMessages.postNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
  }
  if (likeableType === LIKEABLE_TYPE.COMMENT) {
    const comment = await DB.models.comments.findOne({ where: { id: likeableId } });
    if (!comment) {
      throwError({
        message: appMessages.commentNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
  }

  const result = await DB.models.likes.findOne({
    where: { userId, likeableId, likeableType },
    paranoid: false,
  });
  if (result) {
    if (result.deletedAt !== null) {
      await DB.models.likes.restore({
        where: {
          userId,
          likeableId,
          likeableType,
        },
      });
    }
    const totalLikes = await DB.models.likes.count({
      where: {
        likeableId,
        likeableType,
      },
    });
    return { total: totalLikes };
  }
  const t = await DB.sequelize.transaction();
  try {
    if (likeableType === LIKEABLE_TYPE.POST) {
      await DB.models.likes.create(
        {
          userId,
          likeableId,
          likeableType,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t }
      );
      const post = await DB.models.posts.findOne({ where: { id: likeableId } });
      const checkDisplay = await DB.models.displayedNotifications.findOne({
        where: {
          userId,
          notificationUserId: post.userId,
          activityId: likeableId,
          activityType: likeableType,
        },
      });
      if (!checkDisplay) {
        if (userId !== post.userId) {
          await createNotificationLikePost(userId, likeableId, likeableType, t);
        }
      }
      await t.commit();

      const totalLikes = await DB.models.likes.count({
        where: {
          likeableId,
          likeableType,
        },
      });
      await DB.models.posts.update(
        {
          likesCount: totalLikes,
        },
        { where: { id: likeableId } }
      );
      return { total: totalLikes };
    }
    await DB.models.likes.create(
      {
        userId,
        likeableId,
        likeableType,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
    const comment = await DB.models.comments.findOne({ where: { id: likeableId } });
    if (userId !== comment.userId) {
      await createNotificationLikeComment(userId, likeableId, likeableType, t);
    }
    await t.commit();
    const totalLikes = await DB.models.likes.count({
      where: {
        likeableId,
        likeableType,
      },
    });
    return { total: totalLikes };
  } catch (e) {
    await t.rollback();
    throwError({
      message: e,
      status: 500,
      code: appCodes.internalError,
    });
  }
};

const userUnlike = async (userId, likeableId, likeableType) => {
  if (likeableType !== LIKEABLE_TYPE.POST && likeableType !== LIKEABLE_TYPE.COMMENT) {
    throwError({
      message: 'likeableType must be post or comment ',
      status: 409,
      code: appCodes.conflict,
    });
  }
  if (likeableType === LIKEABLE_TYPE.POST) {
    const post = await DB.models.posts.findOne({ where: { id: likeableId } });
    if (!post) {
      throwError({
        message: appMessages.postNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
  }
  if (likeableType === LIKEABLE_TYPE.COMMENT) {
    const comment = await DB.models.comments.findOne({ where: { id: likeableId } });
    if (!comment) {
      throwError({
        message: appMessages.commentNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
  }
  const result = await DB.models.likes.findOne({
    where: { userId, likeableId, likeableType },
    raw: true,
  });
  if (!result) {
    const totalLikes = await DB.models.likes.count({
      where: {
        likeableId,
        likeableType,
      },
    });
    return { total: totalLikes };
  }
  await DB.models.likes.destroy({
    where: {
      userId,
      likeableId,
      likeableType,
    },
  });
  const post = await DB.models.posts.findOne({ where: { id: likeableId } });

  const totalLikes = await DB.models.likes.count({
    where: {
      likeableId,
      likeableType,
    },
  });

  if (likeableType === LIKEABLE_TYPE.POST) {
    await DB.models.posts.update(
      {
        likesCount: totalLikes,
      },
      { where: { id: post.id } }
    );
  }
  return { total: totalLikes };
};

const createNotificationLikePost = async (userId, likeableId, likeableType, t) => {
  const user = await findOneUser({ where: { id: userId } });
  const post = await DB.models.posts.findOne({ where: { id: likeableId } });
  let postUser = {};
  if (post.adminId !== null) {
    postUser = await findOneUser({ where: { adminId: post.adminId } });
  } else {
    postUser = await findOneUser({ where: { id: post.userId } });
  }
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: postUser.id,
      type: NOTIFICATION_TYPE.LIKE_POST,
      actionId: likeableId,
      actionType: likeableType,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (!notification) {
    const content = `${user.fullName} liked your post`;
    await DB.models.notifications.create(
      {
        userId: postUser.id,
        fireUserId: userId,
        type: NOTIFICATION_TYPE.LIKE_POST,
        notificationTitle: content,
        actionId: likeableId,
        actionType: likeableType,
        isCheckable: NOTIFICATION_CHECK.UNCHECKED,
        status: NOTIFICATION_STATUS.UNREAD,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
    await updateDisplayedNotificationLike(userId, postUser, likeableId, likeableType, t);
    return successResponse('Send successfully notification!');
  }
  const content = `${user.fullName} and ${notification.countNotification + 1}  others liked your post`;
  await updateNotificationLikePost(userId, postUser, NOTIFICATION_TYPE.LIKE_POST, likeableId, likeableType, content, t);
  await updateDisplayedNotificationLike(userId, postUser, likeableId, likeableType, t);
  return successResponse('Send successfully notification!');
};

const updateDisplayedNotificationLike = async (userId, postCommentUser, likeableId, likeableType, t) => {
  if (likeableType === LIKEABLE_TYPE.COMMENT) {
    return await DB.models.displayedNotifications.create(
      {
        userId,
        notificationUserId: postCommentUser.id,
        activityId: likeableId,
        activityType: NOTIFICATION_ACTION_TYPE.LIKES,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transaction: t,
      }
    );
  }
  return await DB.models.displayedNotifications.create(
    {
      userId,
      notificationUserId: postCommentUser.id,
      activityId: likeableId,
      activityType: likeableType,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      transaction: t,
    }
  );
};

const createNotificationLikeComment = async (userId, likeableId, likeableType, t) => {
  const user = await findOneUser({ where: { id: userId } });
  const comment = await DB.models.comments.findOne({ where: { id: likeableId } });
  const commentUser = await findOneUser({ where: { id: comment.userId } });
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: commentUser.id,
      type: NOTIFICATION_TYPE.LIKE_COMMENT,
      actionId: comment.postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      commentId: comment.commentParentId === 0 ? comment.id : comment.commentParentId,
      replyId: comment.replyId === null ? null : comment.id,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  const checkDisplay = await DB.models.displayedNotifications.findOne({
    where: {
      userId,
      notificationUserId: commentUser.id,
      activityId: likeableId,
      activityType: NOTIFICATION_ACTION_TYPE.LIKES,
    },
  });

  if (!checkDisplay) {
    if (!notification) {
      const content = `${user.fullName} liked your comment`;
      await DB.models.notifications.create(
        {
          userId: commentUser.id,
          fireUserId: userId,
          type: NOTIFICATION_TYPE.LIKE_COMMENT,
          notificationTitle: content,
          actionId: comment.postId,
          actionType: NOTIFICATION_ACTION_TYPE.POST,
          commentId: comment.commentParentId === 0 ? comment.id : comment.commentParentId,
          replyId: comment.replyId === null ? null : comment.id,
          isCheckable: NOTIFICATION_CHECK.UNCHECKED,
          status: NOTIFICATION_STATUS.UNREAD,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t }
      );
      await updateDisplayedNotificationLike(userId, commentUser, likeableId, likeableType, t);
      return successResponse('Send successfully notification!');
    }
    if (notification?.countNotification === 0 && notification?.fireUserId === userId) {
      return;
    }
    const content = `${user.fullName} and ${notification.countNotification + 1} others liked your comment`;
    await updateNotificationLikeComment(
      userId,
      commentUser,
      NOTIFICATION_TYPE.LIKE_COMMENT,
      comment.postId,
      comment.commentParentId === 0 ? comment.id : comment.commentParentId,
      comment.replyId === null ? null : comment.id,
      content,
      t
    );
    await updateDisplayedNotificationLike(userId, commentUser, likeableId, likeableType, t);
  }
};

const updateNotificationLikePost = async (userId, postCommentUser, type, likeableId, likeableType, content, t) => {
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: postCommentUser.id,
      type,
      actionId: likeableId,
      actionType: likeableType,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (!notification) {
    throwError({
      message: 'Notification not found',
      status: 404,
      code: appCodes.notFound,
    });
  }
  return await DB.models.notifications.update(
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

const updateNotificationLikeComment = async (userId, postCommentUser, type, postId, commentId, replyId, content, t) => {
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: postCommentUser.id,
      type,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      commentId,
      replyId,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (!notification) {
    throwError({
      message: 'Notification not found',
      status: 404,
      code: appCodes.notFound,
    });
  }
  return await DB.models.notifications.update(
    {
      fireUserId: userId,
      notificationTitle: content,
      countNotification: notification.countNotification + 1,
      commentId,
      replyId,
    },
    {
      where: {
        id: notification.id,
      },
    },
    { transaction: t }
  );
};

const deleteUser = async userId => {
  const user = await findOneUser({ where: { id: userId } });
  if (!user) {
    return throwError({
      message: appMessages.userNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const t = await DB.sequelize.transaction();
  try {
    await Promise.all([
      DB.models.users.destroy({
        where: { id: userId },
        transaction: t,
      }),
      deletePost(userId, t),
      deleteReport(userId, t),
      deleteFollowUser(userId, t),
      deleteLikePost(userId, t),
      deleteLikeComment(userId, t),
      deleteComment(userId, t),
      deleteShare(userId, t),
    ]);
    await t.commit();
    return successResponse('Delete user successfully');
  } catch (error) {
    await t.rollback();
    throwError({
      message: error,
      status: 500,
      code: appCodes.internalError,
    });
  }
};

const deletePost = async (userId, t) => {
  return await DB.models.posts.destroy({
    where: {
      userId,
    },
    transaction: t,
  });
};

const deleteReport = async (userId, t) => {
  return await Promise.all([
    DB.models.reports.destroy({
      where: {
        userId,
      },
      transaction: t,
    }),
    DB.models.reportUsers.destroy({
      where: { userId },
      transaction: t,
    }),
  ]);
};

const deleteFollowUser = async (userId, t) => {
  return await DB.models.followers.destroy({
    where: {
      [DB.Op.or]: [
        {
          followerId: userId,
        },
        { followingId: userId },
      ],
    },
    transaction: t,
  });
};

const deleteLikePost = async (userId, t) => {
  const postLike = await DB.models.likes.findAll({
    where: {
      userId,
      likeableType: LIKEABLE_TYPE.POST,
    },
    attributes: ['likeable_id'],
    raw: true,
  });
  await DB.models.likes.destroy({
    where: { userId, likeableType: LIKEABLE_TYPE.POST },
    transaction: t,
  });
  let postLikeIds = postLike.map(item => {
    return item.likeable_id;
  });
  await DB.models.posts.update(
    { likesCount: DB.sequelize.literal('likes_count - 1') },
    {
      where: {
        id: { [DB.Op.in]: postLikeIds },
      },
      transaction: t,
    }
  );
};

const deleteLikeComment = async (userId, t) => {
  return await DB.models.likes.destroy({
    where: { userId, likeableType: LIKEABLE_TYPE.COMMENT },
    transaction: t,
  });
};

const deleteComment = async (userId, t) => {
  const postComment = await DB.models.comments.findAll({
    where: { userId },
    attributes: ['id', 'post_id'],
    raw: true,
  });
  await DB.models.comments.destroy({
    where: { [DB.Op.or]: [{ userId }, { replyId: userId }] },
    transaction: t,
  });
  let commentParentIds = postComment.map(item => {
    return item.id;
  });
  await DB.models.comments.destroy({
    where: { commentParentId: { [DB.Op.in]: commentParentIds } },
    transaction: t,
  });
  let postCommentIds = postComment.map(item => {
    return item.post_id;
  });
  for (const postId of postCommentIds) {
    const totalComments = await DB.models.comments.count({
      where: {
        postId,
      },
    });
    const totalCommentUserId = await DB.models.comments.count({
      where: {
        postId,
        userId,
      },
    });
    await DB.models.posts.update(
      {
        commentsCount: totalComments - totalCommentUserId,
      },
      {
        where: { id: postId },
        transaction: t,
      }
    );
  }
};

const deleteShare = async (userId, t) => {
  const postShare = await DB.models.shares.findAll({
    where: { userId },
    attributes: ['post_id'],
    raw: true,
  });
  let postShareIds = postShare.map(item => {
    return item.post_id;
  });
  return await Promise.all([
    DB.models.shares.destroy({ where: { userId }, transaction: t }),
    DB.models.posts.update(
      {
        sharesCount: DB.sequelize.literal('shares_count - 1'),
      },
      {
        where: {
          id: { [DB.Op.in]: postShareIds },
        },
        transaction: t,
      }
    ),
  ]);
};

module.exports = {
  findOneUser,
  findAdminUser,
  getNotiMessages,
  postsReport,
  userLike,
  userUnlike,
  deleteUser,
  findUsers,
};
