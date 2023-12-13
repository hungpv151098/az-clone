const { successResponse } = require('../utils/response');
const {
  POST_STATUS,
  MEDIABLE_TYPE,
  NOTIFICATION_TYPE,
  NOTIFICATION_ACTION_TYPE,
  NOTIFICATION_CHECK,
  NOTIFICATION_STATUS,
  MEDIA_LINK,
  LIKEABLE_TYPE,
  DEFAULT_CMC_RANK_USER,
  ROLE_TABLE,
  ACTION_POST,
} = require('../constants/const');
const throwError = require('../libs/throwError');
const DB = require('../models/postgres');
const appCodes = require('../constants/appCodes');
const config = require('../app.config');
const { findOneUser } = require('./user.service');
const moment = require('moment');
const typeErrors = require('../constants/typeErrors');
const { checkSensitiveWord } = require('../libs/util');
const appMessages = require('../constants/appMessages');
const { processingTransaction, checkBalance } = require('./chargeFee.service');
const Decimal = require('decimal.js');

const s3Config = {
  secretAccessKey: config.aws.secretAccessKey,
  accessKeyId: config.aws.accessKeyId,
  region: config.aws.region,
};

const createPost = async (userId, content, mediaData, linkData, tagData) => {
  const t = await DB.sequelize.transaction();
  const user = await findOneUser({ where: { id: userId } });
  if (!user) {
  }
  await checkSensitiveWord(content);
  try {
    const postData = await DB.models.posts.create(
      {
        userId,
        content,
        status: POST_STATUS.APPROVED,
        createdAt: new Date(),
        updated_at: new Date(),
      },
      { transaction: t }
    );
    let totalCostMedia = 0;
    if (mediaData) {
      totalCostMedia = await createMedia(postData, mediaData, t);
    }
    if (linkData) {
      await createLink(postData, linkData, t);
    }
    if (tagData) {
      await createTags(userId, postData, tagData, t);
    }
    await createNotificationPost(userId, postData.id, t);

    let totalCost = new Decimal(config.setting.basicFeeCost).add(new Decimal(totalCostMedia).toNumber()).toNumber();
    await processingTransaction(user, postData.id, totalCost, ACTION_POST.CREATE, t);
    await t.commit();
    await checkBalance(userId, totalCost);

    return postData;
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

const createMedia = async (postData, mediaData, t) => {
  let totalMediaCost = 0;
  let totalImage = 0;
  let totalVideo = 0;
  for (const media of mediaData) {
    if (media.type.startsWith('image/')) {
      totalImage++;
    } else if (media.type.startsWith('video/')) {
      totalVideo++;
    }
    await DB.models.medias.create(
      {
        mediableId: postData.id,
        mediableType: MEDIABLE_TYPE.POST,
        type: media.type,
        mediaUrl: media.mediaUrl,
        thumbUrl: media.thumbUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
  }
  totalMediaCost = new Decimal(totalImage * new Decimal(config.setting.imageCost))
    .add(totalVideo * new Decimal(config.setting.videoCost))
    .toNumber();
  return totalMediaCost;
};

const createLink = async (postData, linkData, t) => {
  await DB.models.medias.create(
    {
      mediableId: postData.id,
      mediableType: MEDIABLE_TYPE.POST,
      type: MEDIA_LINK.LINK,
      mediaUrl: linkData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
};

const createTags = async (userId, postData, tagData, t) => {
  for (const tag of tagData) {
    await userCreateTagData(userId, postData, tag, t);
  }
};

const userCreateTagData = async (userId, postData, tag, t) => {
  const tagData = await DB.models.tags.findOne({
    where: { name: tag.name },
  });
  if (!tagData) {
    await checkSensitiveWord(tag.name);
    const tagUser = await DB.models.tags.create({
      name: tag.name.toLowerCase(),
      rank: DEFAULT_CMC_RANK_USER,
      createId: userId,
      createBy: ROLE_TABLE.USER,
    });
    return await DB.models.postTags.create(
      {
        postId: typeof postData?.id === 'undefined' ? parseInt(postData) : postData?.id,
        tagId: tagUser.id,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
  }
  return await DB.models.postTags.create(
    {
      postId: typeof postData?.id === 'undefined' ? parseInt(postData) : postData?.id,
      tagId: tagData.id,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
};
const createNotificationPost = async (userId, postId, t) => {
  const userData = await findOneUser({ where: { id: userId } });
  const userFollowers = await DB.models.followers.findAll({
    where: { followingId: userId },
    attributes: ['followerId'],
    raw: true,
  });
  if (userFollowers.length === 0) {
    return successResponse('Sending notifications successfully');
  }
  const content = `${userData.fullName} has posted a new post`;
  const deviceTokens = [];
  const userNotifications = [];
  for (const userFollow of userFollowers) {
    const user = await DB.models.users.findOne({
      where: { id: userFollow?.followerId },
    });
    if (user) {
      userNotifications.push({
        userId: user.id,
        fireUserId: userId,
        type: NOTIFICATION_TYPE.POST_FOLLOW,
        notificationTitle: content,
        actionId: postId,
        actionType: NOTIFICATION_ACTION_TYPE.POST,
        isCheckable: NOTIFICATION_CHECK.UNCHECKED,
        status: NOTIFICATION_STATUS.UNREAD,
        createdAt: new Date(),
        updatedAt: new Date(),
      });
      deviceTokens.push(user?.deviceToken);
    }
  }
  const resultData = await DB.models.notifications.bulkCreate(userNotifications, { transaction: t });
  if (!resultData) {
    throwError({
      message: 'Sending notification unsuccessfully',
      status: 500,
      code: appCodes.internalError,
    });
  }
  return successResponse('Sending notifications successfully');
};

const editPost = async (userId, postId, postData, mediaData, linkData, tagData) => {
  const user = await DB.models.users.findOne({ where: { id: userId } });
  if (!user) {
    throwError({
      message: appMessages.userNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const post = await DB.models.posts.findOne({ where: { id: postId, userId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const t = await DB.sequelize.transaction();
  await checkSensitiveWord(postData.content);

  try {
    await DB.models.posts.update(
      { content: postData.content, updatedAt: new Date() },
      {
        where: {
          userId,
          id: postId,
        },
      },
      {
        transaction: t,
      }
    );
    let totalCost = 0;
    totalCost = await editMedia(postId, mediaData, linkData, t);
    await editTags(userId, postId, tagData, t);
    if (typeof totalCost === 'undefined') {
      totalCost = 0;
    }
    await processingTransaction(user, postId, totalCost, ACTION_POST.EDIT, t);
    await t.commit();
    await checkBalance(userId, totalCost);
    const post = await DB.models.posts.findOne({
      where: { id: postId },
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
        { model: DB.sequelize.model('postTags'), include: [{ model: DB.sequelize.model('tags') }] },
      ],
    });
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
const editMedia = async (postId, mediaData, linkData, t) => {
  const mediaDB = await DB.models.medias.findAll({
    where: {
      mediableId: postId,
      mediableType: MEDIABLE_TYPE.POST,
    },
  });

  if (mediaData.length === 0) {
    await DB.models.medias.destroy({
      where: { mediableId: postId, mediableType: MEDIABLE_TYPE.POST },
      transaction: t,
    });
    if (linkData === null) {
      return;
    }
    return await editLink(postId, linkData, t);
  }
  await DB.models.medias.destroy({
    where: { mediableId: postId, mediableType: MEDIABLE_TYPE.POST },
    transaction: t,
  });
  return await totalEditCost(mediaDB, postId, mediaData, t);
};

const totalEditCost = async (mediaDB, postId, mediaData, t) => {
  let totalImageDB = 0;
  let totalVideoDB = 0;
  let totalImage = 0;
  let totalVideo = 0;
  let totalMediaCost = 0;
  for (const media of mediaDB) {
    if (media.type.startsWith('image/')) {
      totalImageDB++;
    } else if (media.type.startsWith('video/')) {
      totalVideoDB++;
    }
  }

  for (const media of mediaData) {
    if (media.type.startsWith('image/')) {
      totalImage++;
    } else if (media.type.startsWith('video/')) {
      totalVideo++;
    }
    await DB.models.medias.create(
      {
        mediableId: postId,
        mediableType: MEDIABLE_TYPE.POST,
        type: media.type,
        mediaUrl: media.mediaUrl,
        thumbUrl: media.thumbUrl,
        createdAt: new Date(),
        updatedAt: new Date(),
      },
      { transaction: t }
    );
  }
  let totalImageAfter = totalImage - totalImageDB;
  let totalVideoAfter = totalVideo - totalVideoDB;
  if (totalImageAfter <= 0 && totalVideoAfter <= 0) {
    return;
  }
  totalMediaCost = new Decimal((totalImageAfter < 0 ? 0 : totalImageAfter) * new Decimal(config.setting.imageCost).toNumber())
    .add((totalVideoAfter < 0 ? 0 : totalVideoAfter) * new Decimal(config.setting.videoCost).toNumber())
    .toNumber();
  return totalMediaCost;
};

const editLink = async (postId, linkData, t) => {
  await DB.models.medias.destroy({
    where: { mediableId: postId, mediableType: MEDIABLE_TYPE.POST, type: MEDIA_LINK.LINK },
    transaction: t,
  });

  return await DB.models.medias.create(
    {
      mediableId: postId,
      mediableType: MEDIABLE_TYPE.POST,
      type: MEDIA_LINK.LINK,
      mediaUrl: linkData,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
    { transaction: t }
  );
};

const editTags = async (userId, postId, tagData, t) => {
  if (tagData.length === 0) {
    return await DB.models.postTags.destroy({
      where: { postId },
      transaction: t,
    });
  }
  await DB.models.postTags.destroy({
    where: { postId },
    transaction: t,
  });

  for (const tag of tagData) {
    await userCreateTagData(userId, postId, tag, t);
  }
};

const deletePost = async (userId, postId) => {
  const post = await DB.models.posts.findOne({ where: { id: postId, userId } });
  if (!post) {
    throwError({
      message: appMessages.postNotFound,
      status: 404,
      code: appCodes.notFound,
    });
  }
  const t = await DB.sequelize.transaction();
  try {
    await DB.models.posts.destroy({
      where: { id: postId, userId },

      transaction: t,
    });
    await Promise.all([
      deletePostMedia(postId, t),
      deletePostTags(postId, t),
      deleteLikePost(postId, t),
      deleteCommentPost(postId, t),
      deleteSharePost(postId, t),
    ]);
    await t.commit();
    return successResponse('Post deleted');
  } catch (e) {
    await t.rollback();
    throwError({
      message: e,
      status: 500,
      code: appCodes.internalError,
    });
  }
};
const deletePostMedia = async (postId, t) => {
  // const mediaData = await DB.models.medias.findAll({
  //   where: { mediableId: postId, mediableType: MEDIABLE_TYPE.POST },
  //   raw: true,
  // });
  // for (const media of mediaData) {
  //   if (media.type.startsWith('video/')) {
  //     await removeS3File(s3Config, convertUrlAws(media.mediaUrl));
  //     await removeS3File(s3Config, convertUrlAws(media.thumbUrl));
  //   } else if (media.type.startsWith('image/')) {
  //     await removeS3File(s3Config, convertUrlAws(media.mediaUrl));
  //   }
  // }
  await DB.models.medias.destroy({
    where: { mediableId: postId, mediableType: MEDIABLE_TYPE.POST },
    transaction: t,
  });
};

const deletePostTags = async (postId, t) => {
  await DB.models.postTags.destroy({
    where: { postId },
    transaction: t,
  });
};

const deleteLikePost = async (postId, t) => {
  await DB.models.likes.destroy({
    where: { likeableId: postId, likeableType: LIKEABLE_TYPE.POST },
    transaction: t,
  });
};

const deleteCommentPost = async (postId, t) => {
  await DB.models.comments.destroy({
    where: { postId },
    transaction: t,
  });
};

const deleteSharePost = async (postId, t) => {
  await DB.models.shares.destroy({
    where: { postId },
    transaction: t,
  });
};

const getTags = async (keyword, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await DB.models.tags.count();
  const maxPage = Math.ceil(total / pageSize);
  const data = await DB.models.tags.findAll({
    where: {
      [DB.Op.or]: [
        DB.sequelize.where(DB.sequelize.fn('LOWER', DB.sequelize.col('name')), {
          [DB.Op.regexp]: `.*${keyword.toLowerCase()}.*`,
        }),
        DB.sequelize.where(DB.sequelize.fn('LOWER', DB.sequelize.col('symbol')), {
          [DB.Op.regexp]: `.*${keyword.toLowerCase()}.*`,
        }),
      ],
    },

    offset: Math.abs((currentPage / 1 - 1) * pageSize),
    limit: Math.abs(pageSize),
    order: [[DB.sequelize.literal(`COALESCE(rank,cmc_rank)`), 'ASC']],
  });
  return {
    tagsData: !data
      ? []
      : data.map(item => {
          return {
            id: item?.id,
            name: item?.name,
            cmcTokenId: item?.cmcTokenId,
            cmcRank: item?.cmcRank,
            symbol: item?.symbol,
            logo: item?.logo,
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

const checkCreatePost = async userId => {
  const currentTime = new Date();
  const startOfDay = moment(currentTime).startOf('day').toDate();
  const endOfDay = moment(currentTime).endOf('day').toDate();
  const user = await findOneUser({
    where: {
      id: userId,
    },
  });
  const postCount = await DB.models.posts.count({
    where: {
      userId,
      createdAt: {
        [DB.Op.between]: [startOfDay, endOfDay],
      },
    },
  });
  if (user.postBlockedAt) {
    if (currentTime < user.postBlockedAt) {
      return throwError({
        message: 'Request is block',
        code: appCodes.tooManyRequests,
        status: 429,
        errors: {
          postBlockedAt: user.postBlockedAt,
          type: typeErrors.postBlockedTime,
        },
      });
    }
  }
  if (postCount >= parseInt(config.post.limitCreatePost)) {
    return throwError({
      message: 'Request limit exceeded',
      code: appCodes.tooManyRequests,
      status: 429,
      errors: {
        type: typeErrors.postLimitRequest,
      },
    });
  }
  return successResponse('User can post now!');
};

module.exports = {
  createPost,
  editPost,
  deletePost,
  getTags,
  checkCreatePost,
  processingTransaction,
};
