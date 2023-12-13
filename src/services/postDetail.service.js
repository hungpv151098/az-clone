const {
  MEDIABLE_TYPE,
  MEDIA_LINK,
  NOTIFICATION_TYPE,
  NOTIFICATION_CHECK,
  NOTIFICATION_ACTION_TYPE,
  NOTIFICATION_STATUS,
  DEFAULT_PARENT_COMMENT,
  POST_STATUS,
  POST_TYPE,
  ACTION_POST,
} = require('../constants/const');
const throwError = require('../libs/throwError');
const DB = require('../models/postgres');
const { successResponse } = require('../utils/response');
const { sendNotificationReply } = require('./fcm/firebase.service');
const appMessages = require('../constants/appMessages');
const appCodes = require('../constants/appCodes');
const { findOneUser } = require('./user.service');
const config = require('../app.config');
const { checkSensitiveWord, sortTags } = require('../libs/util');
const { checkBalance, processingTransaction } = require('./chargeFee.service');

const getDetail = async (userId, postId, userName) => {
  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });

  let query = {};
  if (userName) {
    query = { key_post: postId };
  } else {
    query = { id: postId };
  }
  const post = await DB.models.posts.findOne({ where: query });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const exitsUser = await DB.models.users.findOne({ where: { id: post.userId } });
  if (exitsUser && userName && exitsUser.userName !== userName) {
    throwError({
      message: 'Username does not exist! Please check the link again',
      status: 404,
      code: appCodes.notFound,
    });
  }
  const data = await DB.models.posts.findOne({
    where: query,
    include: [
      {
        model: DB.sequelize.model('users'),
        attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
      },
      { model: DB.sequelize.model('adminUsers'), attributes: ['name'], as: 'admin' },
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
      { model: DB.sequelize.model('postTags'), include: [{ model: DB.sequelize.model('tags') }] },
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
  });

  if (!userId) {
    return {
      id: data?.id,
      admin:
        data?.user?.adminId !== null
          ? {
              id: adminData.id,
              full_name: adminData?.admin?.name,
              avatar: adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
            }
          : null,
      user: data?.user?.adminId === null ? data?.user : null,
      content: data?.content,
      createdAt: data?.createdAt,
      media: data?.medias,
      link: data?.link,
      postTag: sortTags(data?.postTags),
      share:
        typeof data?.share?.id !== 'undefined'
          ? {
              id: data?.share?.id,
              user: data?.share?.user?.adminId === null ? data?.share?.user : null,
              admin:
                data?.share?.user?.adminId !== null
                  ? {
                      id: adminData.id,
                      full_name: adminData?.admin?.name,
                      avatar:
                        adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
                    }
                  : null,
              content: data?.share?.content,
              status: data?.share?.status,
              createdAt: data?.share?.createdAt,
              updatedAt: data?.share?.updatedAt,
              media: data?.share?.medias,
              link: data?.share?.link,
              postTag: sortTags(data?.share?.postTags),
            }
          : null,
      likesCount: data?.likesCount,
      commentsCount: data?.commentsCount,
      sharesCount: data?.sharesCount,
      type: data?.type,
    };
  }
  const likedPost = await DB.models.likes.findOne({
    attributes: ['likeable_id'],
    where: { likeable_id: postId, userId, likeable_type: 'posts' },
    raw: true,
  });
  return {
    id: data?.id,
    admin:
      data?.user?.adminId !== null
        ? {
            id: adminData.id,
            full_name: adminData?.admin?.name,
            avatar: adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
          }
        : null,
    user: data?.user?.adminId === null ? data?.user : null,
    content: data?.content,
    createdAt: data?.createdAt,
    media: data?.medias,
    link: data?.link,
    postTag: sortTags(data?.postTags),
    share:
      typeof data?.share?.id !== 'undefined'
        ? {
            id: data?.share?.id,
            user: data?.share?.user?.adminId === null ? data?.share?.user : null,
            admin:
              data?.share?.user?.adminId !== null
                ? {
                    id: adminData.id,
                    full_name: adminData?.admin?.name,
                    avatar:
                      adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
                  }
                : null,
            content: data?.share?.content,
            status: data?.share?.status,
            createdAt: data?.share?.createdAt,
            updatedAt: data?.share?.updatedAt,
            media: data?.share?.medias,
            link: data?.share?.link,
            postTag: sortTags(data?.share?.postTags),
          }
        : null,
    likesCount: data?.likesCount,
    commentsCount: data?.commentsCount,
    sharesCount: data?.sharesCount,
    type: data?.type,
    isLiked: likedPost?.likeable_id === data.id ? true : false,
  };
};

const sharePost = async (userId, postId) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const t = await DB.sequelize.transaction();
  try {
    const shareData = await DB.models.shares.findOne({
      where: {
        userId,
        postId,
      },
    });
    if (!shareData) {
      await DB.models.shares.create(
        {
          userId,
          postId,
          createdAt: new Date(),
          updatedAt: new Date(),
        },
        { transaction: t }
      );
      if (userId !== post.userId) {
        await createNotificationShare(userId, postId, t);
      }
      await t.commit();

      const totalShare = await DB.models.shares.count({ where: { postId } });
      await DB.models.posts.update(
        {
          sharesCount: totalShare,
        },
        { where: { id: postId } }
      );
      return { total: totalShare };
    }
    await DB.models.shares.update(
      {
        updatedAt: new Date(),
      },
      {
        where: { userId, postId },
      },
      { transaction: t }
    );
    await t.commit();
    const totalShare = await DB.models.shares.count({ where: { postId } });
    return { total: totalShare };
  } catch (e) {
    await t.rollback();
    throwError({
      message: e,
      status: 500,
      code: appCodes.internalError,
    });
  }
};

const createNotificationShare = async (userId, postId, t) => {
  const [user, post] = await Promise.all([
    DB.models.users.findOne({ where: { id: userId } }),
    DB.models.posts.findOne({ where: { id: postId } }),
  ]);
  let postUser = {};
  if (post.adminId !== null) {
    postUser = await findOneUser({ where: { adminId: post.adminId } });
  } else {
    postUser = await findOneUser({ where: { id: post.userId } });
  }
  postUser = await DB.models.users.findOne({ where: { id: post.userId } });
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: post.userId,
      type: NOTIFICATION_TYPE.SHARE,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (!notification) {
    const content = `${user?.fullName} shared your post`;
    await DB.models.notifications.create(
      {
        userId: postUser?.id,
        fireUserId: userId,
        type: NOTIFICATION_TYPE.SHARE,
        notificationTitle: content,
        actionId: postId,
        actionType: NOTIFICATION_ACTION_TYPE.POST,
        isCheckable: NOTIFICATION_CHECK.UNCHECKED,
        status: NOTIFICATION_STATUS.UNREAD,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
    return successResponse('Send successfully notification!');
  }
  const content = `${user?.fullName} and ${notification?.countNotification + 1} others shared your post`;
  await updateNotificationShare(postUser, postId, userId, content, t);
  return successResponse('Send successfully notification!');
};

const updateNotificationShare = async (postUser, postId, userId, content, t) => {
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: postUser?.id,
      type: NOTIFICATION_TYPE.SHARE,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
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
      countNotification: notification?.countNotification + 1,
    },
    {
      where: {
        id: notification.id,
      },
    },
    { transaction: t }
  );
};

const getComments = async (userId, postId, currentPage, pageSize) => {
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
    where: {
      postId,
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
      { model: DB.sequelize.model('users'), attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick']] },
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
    paginationOptions: {
      total,
      maxPage: !maxPage ? 0 : maxPage,
      currentPage: currentPage / 1,
      pageSize: pageSize / 1,
    },
  };
};

const postComment = async (userId, postId, commentParentId, replyId, content) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  if (commentParentId !== 0) {
    const comment = await DB.models.comments.findOne({
      where: { id: commentParentId, postId, commentParentId: 0 },
    });
    if (!comment) {
      throwError({
        message: appMessages.commentNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
    if (replyId !== undefined) {
      const replyUser = await DB.models.users.findOne({
        where: { id: replyId },
      });
      if (!replyUser) {
        throwError({
          message: 'ReplyUser not found!',
          status: 404,
          code: appCodes.notFound,
        });
      }
    }
  }

  const t = await DB.sequelize.transaction();
  await checkSensitiveWord(content);

  try {
    const data = await DB.models.comments.create(
      {
        userId,
        postId,
        commentParentId,
        replyId,
        content,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      {
        transaction: t,
      }
    );
    if (data.commentParentId === 0) {
      if (userId !== post.userId) {
        await createNotificationComment(userId, postId, data, t);
      }
      await t.commit();

      const totalComments = await DB.models.comments.count({ where: { postId } });
      await DB.models.posts.update(
        {
          commentsCount: totalComments,
        },
        { where: { id: postId } }
      );
      return { comment: data, total: totalComments };
    }
    const userCommentParent = await DB.models.comments.findOne({
      where: { id: commentParentId, postId, commentParentId: 0 },
    });

    if (replyId === undefined) {
      if (userId !== userCommentParent.userId) {
        await createNotificationReply(userId, postId, commentParentId, data, t);
      }
      await t.commit();

      const totalComments = await DB.models.comments.count({ where: { postId } });
      await DB.models.posts.update(
        {
          commentsCount: totalComments,
        },
        { where: { id: postId } }
      );
      return { comment: data, total: totalComments };
    }
    if (userId !== replyId) {
      await createNotificationMention(userId, postId, replyId, data, t);
    }
    await t.commit();

    const totalComments = await DB.models.comments.count({ where: { postId } });
    await DB.models.posts.update(
      {
        commentsCount: totalComments,
      },
      { where: { id: postId } }
    );
    return { comment: data, total: totalComments };
  } catch (e) {
    await t.rollback();
    throwError({
      message: e,
      status: 500,
      code: appCodes.internalError,
    });
  }
};

const editComment = async (userId, postId, commentId, content, reply) => {
  const replyId = reply || null;
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const comment = await DB.models.comments.findOne({ where: { id: commentId, userId, postId } });
  if (!comment) {
    throwError({
      message: appMessages.commentNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const needUpdateComment =
    typeof reply === 'undefined'
      ? false
      : comment.commentParentId !== 0 &&
        (replyId === null ? comment.replyId !== null : comment.replyId !== parseInt(replyId));
  if (needUpdateComment && replyId !== null) {
    const userReply = await DB.models.users.findOne({ where: { id: replyId } });
    if (!userReply || (userReply && userReply.id === parseInt(userId))) {
      throwError({
        message: 'Reply user not found!',
        status: 404,
        code: appCodes.notFound,
      });
    }
  }
  let params = {
    content,
    updatedAt: new Date(),
  };
  if (needUpdateComment) {
    params = {
      ...params,
      replyId,
    };
  }
  await checkSensitiveWord(content);
  await DB.models.comments.update(params, {
    where: { userId, id: commentId, postId },
  });
  const totalComments = await DB.models.comments.count({
    where: {
      postId,
    },
  });
  return { total: totalComments };
};

const deleteComment = async (userId, postId, commentId) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  if (userId === post.userId) {
    const comment = await DB.models.comments.findOne({ where: { id: commentId, postId } });
    if (!comment) {
      throwError({
        message: appMessages.commentNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
    if (comment.commentParentId === 0) {
      await DB.models.comments.destroy({
        where: { postId, commentParentId: comment.id },
      });
    }
    await DB.models.comments.destroy({
      where: { postId, id: commentId },
    });
    const totalComments = await DB.models.comments.count({
      where: {
        postId,
      },
    });

    await DB.models.posts.update(
      {
        commentsCount: totalComments,
      },
      { where: { id: postId } }
    );

    return { total: totalComments };
  }
  const comment = await DB.models.comments.findOne({ where: { id: commentId, userId, postId } });
  if (!comment) {
    throwError({
      message: appMessages.commentNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  if (comment.commentParentId === 0) {
    await DB.models.comments.destroy({
      where: { postId, commentParentId: comment.id },
    });
  }
  await DB.models.comments.destroy({
    where: { userId, postId, id: commentId },
  });
  const totalComments = await DB.models.comments.count({
    where: {
      postId,
    },
  });

  await DB.models.posts.update(
    {
      commentsCount: totalComments,
    },
    { where: { id: postId } }
  );

  return { total: totalComments };
};

const createNotificationComment = async (userId, postId, data, t) => {
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  const commentUser = await DB.models.users.findOne({ where: { id: userId } });
  let user = {};
  if (post.adminId !== null) {
    user = await findOneUser({ where: { adminId: post.adminId } });
  } else {
    user = await findOneUser({ where: { id: post.userId } });
  }
  const checkExistsNotification = await DB.models.notifications.findOne({
    where: {
      userId: user.id,
      type: NOTIFICATION_TYPE.COMMENT,
      fireUserId: commentUser.id,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  const notification = await DB.models.notifications.findOne({
    where: {
      userId: user.id,
      type: NOTIFICATION_TYPE.COMMENT,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  const checkDisplay = await DB.models.displayedNotifications.findOne({
    where: {
      userId: commentUser.id,
      notificationUserId: user.id,
      activityId: postId,
      activityType: NOTIFICATION_ACTION_TYPE.COMMENT,
    },
  });
  if (!notification) {
    const content = `${commentUser.fullName} commented on your post`;
    await DB.models.notifications.create(
      {
        userId: user.id,
        fireUserId: commentUser.id,
        type: NOTIFICATION_TYPE.COMMENT,
        notificationTitle: content,
        actionId: postId,
        actionType: NOTIFICATION_ACTION_TYPE.POST,
        commentId: data.id,
        isCheckable: NOTIFICATION_CHECK.UNCHECKED,
        status: NOTIFICATION_STATUS.UNREAD,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
    await updateDisplayedNotificationComment(commentUser.id, user.id, postId, t);
    return successResponse('Send successfully notification!');
  }
  if (notification?.commentId !== data.id && notification?.fireUserId === commentUser.id) {
    await DB.models.notifications.update(
      {
        commentId: data.id,
      },
      { where: { id: checkExistsNotification.id } },
      { transaction: t }
    );
    return successResponse('Send successfully notification!');
  }
  if (checkDisplay) {
    const content = `${commentUser.fullName} and ${notification?.countNotification} others commented on your post`;
    await updateNotificationComment(user.id, commentUser.id, data, content, t);
    return successResponse('Send successfully notification!');
  }
  if (notification?.fireUserId !== commentUser.id) {
    const content = `${commentUser.fullName} and ${notification?.countNotification + 1} others commented on your post`;
    await updateCountNotificationComment(user.id, commentUser.id, data, content, t);
    await updateDisplayedNotificationComment(commentUser.id, user.id, postId, t);
    return successResponse('Send successfully notification!');
  }
};

const createNotificationReply = async (userId, postId, commentParentId, data, t) => {
  const [user, commentParent] = await Promise.all([
    DB.models.users.findOne({ where: { id: userId } }),
    DB.models.comments.findOne({
      where: {
        id: commentParentId,
      },
    }),
  ]);
  const notificationReply = await DB.models.notifications.findOne({
    where: {
      userId: commentParent.userId,
      fireUserId: userId,
      type: NOTIFICATION_TYPE.REPLY,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      commentId: data.commentParentId,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (notificationReply) {
    return await DB.models.notifications.update(
      {
        replyId: data.id,
      },
      {
        where: {
          id: notificationReply.id,
        },
      },
      {
        transaction: t,
      }
    );
  }
  const content = `${user.fullName} just replied to your comment`;
  await DB.models.notifications.create(
    {
      userId: commentParent.userId,
      fireUserId: userId,
      type: NOTIFICATION_TYPE.REPLY,
      notificationTitle: content,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      commentId: data.commentParentId,
      replyId: data.id,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
      status: NOTIFICATION_STATUS.UNREAD,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
  return successResponse('Send successfully notification!');
};

const createNotificationMention = async (userId, postId, replyId, data, t) => {
  const user = await DB.models.users.findOne({ where: { id: userId } });
  const replyUser = await DB.models.users.findOne({ where: { id: replyId } });
  const notificationMention = await DB.models.notifications.findOne({
    where: {
      userId: replyId,
      fireUserId: userId,
      type: NOTIFICATION_TYPE.MENTION,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      commentId: data.commentParentId,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
    },
  });
  if (notificationMention) {
    return await DB.models.notifications.update(
      {
        replyId: data.id,
      },
      {
        where: {
          id: notificationMention.id,
        },
      },
      {
        transaction: t,
      }
    );
  }
  const content = `${user.fullName} mentioned you in a comment`;
  await sendNotificationReply(
    replyUser?.deviceToken,
    content,
    postId,
    NOTIFICATION_ACTION_TYPE.POST,
    data.commentParentId,
    data.id
  );
  await DB.models.notifications.create(
    {
      userId: replyId,
      fireUserId: userId,
      type: NOTIFICATION_TYPE.MENTION,
      notificationTitle: content,
      actionId: postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      commentId: data.commentParentId,
      replyId: data.id,
      isCheckable: NOTIFICATION_CHECK.UNCHECKED,
      status: NOTIFICATION_STATUS.UNREAD,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
  return successResponse('Send successfully notification!');
};

const updateCountNotificationComment = async (userId, commentUserId, comment, content, t) => {
  const notification = await DB.models.notifications.findOne({
    where: {
      type: NOTIFICATION_TYPE.COMMENT,
      userId,
      actionId: comment.postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      replyId: {
        [DB.Op.eq]: null,
      },
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
      fireUserId: commentUserId,
      notificationTitle: content,
      countNotification: notification.countNotification + 1,
      commentId: comment.id,
    },
    {
      where: {
        id: notification.id,
      },
    },
    { transaction: t }
  );
};

const updateNotificationComment = async (userId, commentUserId, comment, content, t) => {
  const notification = await DB.models.notifications.findOne({
    where: {
      type: NOTIFICATION_TYPE.COMMENT,
      userId,
      actionId: comment.postId,
      actionType: NOTIFICATION_ACTION_TYPE.POST,
      replyId: {
        [DB.Op.eq]: null,
      },
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
      fireUserId: commentUserId,
      notificationTitle: content,
      commentId: comment.id,
    },
    {
      where: {
        id: notification.id,
      },
    },
    { transaction: t }
  );
};

const updateDisplayedNotificationComment = async (userId, notificationUserId, activityId, t) => {
  return await DB.models.displayedNotifications.create(
    {
      userId,
      notificationUserId,
      activityId,
      activityType: NOTIFICATION_ACTION_TYPE.COMMENT,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    {
      transaction: t,
    }
  );
};

const getReplies = async (userId, postId, commentId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const post = await DB.models.posts.findOne({ where: { id: postId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const comment = await DB.models.comments.findOne({
    where: {
      id: commentId,
      postId,
      commentParentId: DEFAULT_PARENT_COMMENT,
    },
  });
  if (!comment) {
    throwError({
      message: appMessages.commentNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const total = await DB.models.comments.count({
    where: { postId, commentParentId: commentId },
  });
  const maxPage = Math.ceil(total / pageSize);
  let include = [
    { model: DB.sequelize.model('users'), attributes: ['id', 'full_name'] },
    { model: DB.sequelize.model('users'), attributes: ['id', 'full_name'], as: 'replyUser' },
    { model: DB.sequelize.model('likes') },
  ];
  const data = await DB.models.comments.findAll({
    where: { postId, commentParentId: commentId },
    include,
    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [['createdAt', 'DESC']],
  });
  return {
    commentsData: !data
      ? []
      : data.map(item => {
          return {
            id: item?.id,
            user: item?.user,
            commentParentId: item?.commentParentId,
            content: item?.content,
            replyUser: item?.replyUser,
            likesCount: item?.likes.length,
            createdAt: item?.createdAt,
            isLiked: userId ? !!item?.likes.find(itemLike => itemLike.userId === parseInt(userId)) : false,
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

const shareWallPost = async (userId, postId, content) => {
  const user = await findOneUser({ where: { id: userId } });
  if (!user) {
    throwError({
      message: appMessages.userNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const post = await DB.models.posts.findOne({
    where: { id: postId },
  });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const t = await DB.sequelize.transaction();
  await checkSensitiveWord(content);
  try {
    const post = await DB.models.posts.create(
      {
        userId,
        content,
        status: POST_STATUS.APPROVED,
        postShareId: postId,
        type: POST_TYPE.SHARES,
      },
      {
        transaction: t,
      }
    );
    let totalCost = parseFloat(config.setting.shareWallCost);
    await processingTransaction(user, post.id, totalCost, ACTION_POST.SHARE, t);
    await t.commit();
    await checkBalance(userId, config.setting.shareWallPost);
    return post;
  } catch (e) {
    await t.rollback();
    throwError({
      code: e?.code,
      message: e,
      status: e?.status,
      errors: e?.data,
    });
  }
};

const hidePost = async (userId, postId) => {
  const post = await DB.models.posts.findOne({
    where: { id: postId },
  });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const data = await DB.models.hiddenPosts.findOne({ where: { userId, postId } });
  if (data) {
    return successResponse('Hide post successfully');
  }
  await DB.models.hiddenPosts.create({
    userId,
    postId,
  });
  return successResponse('Hide post successfully');
};

module.exports = {
  getDetail,
  sharePost,
  getComments,
  postComment,
  editComment,
  deleteComment,
  getReplies,
  shareWallPost,
  hidePost,
};
