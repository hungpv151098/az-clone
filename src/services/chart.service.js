const DB = require('../models/postgres');
const { POST_STATUS, MEDIABLE_TYPE, MEDIA_LINK } = require('../constants/const');
const config = require('../app.config');
const { sortTags } = require('../libs/util');
const { default: axios } = require('axios');
const throwError = require('../libs/throwError');
const appMessages = require('../constants/appMessages');
const appCodes = require('../constants/appCodes');

const getChartPost = async (userId, tagId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const tags = await DB.models.postTags.findAll({
    where: {
      tagId,
    },
    attributes: ['postId'],
    raw: true,
  });
  const total = tags.length;
  const postIds = tags.map(item => item.postId);

  const maxPage = Math.ceil(total / pageSize);
  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });
  const data = await DB.models.posts.findAll({
    where: {
      status: POST_STATUS.APPROVED,
      id: {
        [DB.Op.in]: postIds,
      },
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
      },
      { model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name'], as: 'admin' },
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
  let likedPosts = [];
  if (userId) {
    likedPosts = await DB.models.likes.findAll({
      attributes: ['likeable_id'],
      where: { userId, likeable_type: 'posts' },
      raw: true,
    });
  }
  const likedPostsIds = new Set(likedPosts?.map(comment => comment.likeable_id));

  return {
    postData: !data
      ? []
      : data.map(item => {
          return {
            id: item?.id,
            user: item?.user?.adminId === null ? item?.user : null,
            admin:
              item?.user?.adminId !== null
                ? {
                    id: adminData.id,
                    full_name: adminData?.admin?.name,
                    avatar:
                      adminData?.admin?.avatar !== null ? `${config.adminWebView}${adminData?.admin?.avatar}` : null,
                  }
                : null,
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
            isLiked: userId ? likedPostsIds.has(item.id) : false,
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

const getAZNews = async (tagId, currentPage, pageSize) => {
  const tag = await DB.models.tags.findOne({ where: { id: tagId }, attributes: ['name', 'symbol'] });
  const nameCoins = [tag.name, tag.symbol];
  try {
    const response = await axios.get(`${config.azNewsAPI}api/list-new-by-coin`, {
      params: {
        name_coins: nameCoins,
        page: currentPage,
        per_page: pageSize,
      },
    });
    if (response.data.status_code == 404) {
      throwError({
        message: appMessages.postNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
    let data = response.data.data;

    return data;
  } catch (error) {
    throwError(error);
  }
};

const getAZDetail = async postId => {
  try {
    const response = await axios.get(`${config.azNewsAPI}api/${postId}/detail-new-by-coin`);
    if (response.data.status_code == 404) {
      throwError({
        message: appMessages.postNotFound,
        status: 404,
        code: appCodes.notFound,
      });
    }
    let data = response.data.data;
    return data;
  } catch (error) {
    throwError(error);
  }
};

const getTokenDetail = async cmcTokenId => {
  const token = await DB.models.tags.findOne({
    where: {
      cmcTokenId,
    },
  });
  if (token) {
    return token;
  }
  try {
    const response = await axios.post(`${config.cmcAPI}api/tokenInfoByIds`, null, {
      params: {
        ids: [cmcTokenId],
      },
    });
    const data = response.data.data;
    const tokenData = await DB.models.tags.create({
      name: data[0]?.name,
      symbol: data[0]?.symbol,
      logo: data[0]?.token_info?.logo,
      cmcTokenId: data[0]?.cmc_token_id,
      cmcRank: typeof data[0]?.cmc_rank === 'string' ? parseInt(data[0]?.cmc_rank) : data[0]?.cmc_rank,
      createdAt: data[0]?.created_at,
      updatedAt: data[0]?.updated_at,
    });
    return tokenData;
  } catch (error) {
    throwError({ message: error.message, code: appCodes.notFound, status: 404 });
  }
};
module.exports = {
  getChartPost,
  getAZNews,
  getAZDetail,
  getTokenDetail,
};
