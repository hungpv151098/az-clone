const { Athena } = require('aws-sdk');
const config = require('../app.config');
const { POST_STATUS, MEDIA_LINK, MEDIABLE_TYPE, USER_POPULAR_STATUS, USER_IS_BAN } = require('../constants/const');
const DB = require('../models/postgres');
const { sortTags } = require('../libs/util');

const getNews = async (userId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getTotalNews(userId);
  const maxPage = Math.ceil(total / pageSize);
  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });
  if (!userId) {
    const data = await getDataNews(userId, currentPage, pageSize);
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
  const data = await getDataNews(userId, currentPage, pageSize);
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
            isLiked: likedPostsIds.has(item.id),
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
};
const getTotalNews = async userId => {
  if (!userId) {
    const total = await DB.models.posts.count({
      where: { status: POST_STATUS.APPROVED },
      include: [
        {
          model: DB.sequelize.model('users'),
          where: { isBan: USER_IS_BAN.IS_NOT_BAN },
        },
      ],
    });
    return total;
  }
  const total = await DB.models.posts.count({
    where: {
      status: POST_STATUS.APPROVED,
      [DB.Op.and]: [
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "block_users" WHERE "deleted_at" is null AND "block_users"."user_id" = ${userId} AND "block_users"."user_blocked_id" = "posts"."user_id")`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "hidden_posts" WHERE "deleted_at" is null AND "hidden_posts"."user_id" = ${userId} AND "hidden_posts"."post_id" = "posts"."id")`
        ),
      ],
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        where: { isBan: USER_IS_BAN.IS_NOT_BAN },
      },
    ],
  });
  return total;
};

const getDataNews = async (userId, currentPage, pageSize) => {
  if (!userId) {
    const data = await DB.models.posts.findAll({
      where: { status: POST_STATUS.APPROVED },
      include: [
        {
          model: DB.sequelize.model('users'),
          attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
          where: { isBan: USER_IS_BAN.IS_NOT_BAN },
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
    return data;
  }
  const data = await DB.models.posts.findAll({
    where: {
      status: POST_STATUS.APPROVED,
      [DB.Op.and]: [
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "block_users" WHERE "deleted_at" is null AND "block_users"."user_id" = ${userId} AND "block_users"."user_blocked_id" = "posts"."user_id")`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "hidden_posts" WHERE "deleted_at" is null AND "hidden_posts"."user_id" = ${userId} AND "hidden_posts"."post_id" = "posts"."id")`
        ),
      ],
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
        where: { isBan: USER_IS_BAN.IS_NOT_BAN },
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
  return data;
};

const getPopulars = async (userId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getTotalPopular(userId);
  const maxPage = Math.ceil(total / pageSize);
  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });
  if (!userId) {
    const data = await getDataPopular(userId, currentPage, pageSize);
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
  const data = await getDataPopular(userId, currentPage, pageSize);
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
            isLiked: likedPostsIds.has(item.id),
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
};

const getTotalPopular = async userId => {
  if (!userId) {
    const total = await DB.models.posts.count({
      where: { status: POST_STATUS.APPROVED },
      include: [
        {
          model: DB.sequelize.model('users'),
          where: { isPopular: USER_POPULAR_STATUS.IS_POPULAR, isBan: USER_IS_BAN.IS_NOT_BAN },
        },
      ],
    });
    return total;
  }
  const total = await DB.models.posts.count({
    where: {
      status: POST_STATUS.APPROVED,
      [DB.Op.and]: [
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "block_users" WHERE "deleted_at" is null AND "block_users"."user_id" = ${userId} AND "block_users"."user_blocked_id" = "posts"."user_id")`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "hidden_posts" WHERE "deleted_at" is null AND "hidden_posts"."user_id" = ${userId} AND "hidden_posts"."post_id" = "posts"."id")`
        ),
      ],
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        where: {
          isPopular: USER_POPULAR_STATUS.IS_POPULAR,
          isBan: USER_IS_BAN.IS_NOT_BAN,
        },
      },
    ],
  });
  return total;
};

const getDataPopular = async (userId, currentPage, pageSize) => {
  if (!userId) {
    const data = await DB.models.posts.findAll({
      where: { status: POST_STATUS.APPROVED },
      include: [
        {
          model: DB.sequelize.model('users'),
          attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
          where: { isPopular: USER_POPULAR_STATUS.IS_POPULAR, isBan: USER_IS_BAN.IS_NOT_BAN },
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
    return data;
  }
  const data = await DB.models.posts.findAll({
    where: {
      status: POST_STATUS.APPROVED,
      [DB.Op.and]: [
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "block_users" WHERE "deleted_at" is null AND "block_users"."user_id" = ${userId} AND "block_users"."user_blocked_id" = "posts"."user_id")`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "hidden_posts" WHERE "deleted_at" is null AND "hidden_posts"."user_id" = ${userId} AND "hidden_posts"."post_id" = "posts"."id")`
        ),
      ],
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
        where: { isPopular: USER_POPULAR_STATUS.IS_POPULAR, isBan: USER_IS_BAN.IS_NOT_BAN },
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
  return data;
};

const getFollowing = async (userId, currentPage, pageSize) => {
  currentPage = currentPage >= 0 ? currentPage : 0;
  const total = await getTotalFollowing(userId);
  const maxPage = Math.ceil((total[0]?.count || 0) / pageSize);

  let include = [{ model: DB.sequelize.model('adminUsers'), attributes: ['id', 'name', 'avatar'], as: 'admin' }];
  const adminData = await DB.models.users.findOne({
    include,
    order: [['admin_id', 'ASC']],
  });
  const data = await getDataFollowing(userId, currentPage, pageSize);
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

const getTotalFollowing = async userId => {
  const total = await DB.models.posts.count({
    where: {
      status: POST_STATUS.APPROVED,
      [DB.Op.and]: [
        DB.sequelize.literal(
          `EXISTS (SELECT 1 FROM followers WHERE deleted_at is null AND follower_id = ${userId} AND "posts"."user_id" ="followers".following_id)`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "block_users" WHERE "deleted_at" is null AND "block_users"."user_id" = ${userId} AND "block_users"."user_blocked_id" = "posts"."user_id")`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "hidden_posts" WHERE "deleted_at" is null AND "hidden_posts"."user_id" = ${userId} AND "hidden_posts"."post_id" = "posts"."id")`
        ),
      ],
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        where: { isBan: USER_IS_BAN.IS_NOT_BAN },
      },
    ],
  });
  return total;
};

const getDataFollowing = async (userId, currentPage, pageSize) => {
  const data = await DB.models.posts.findAll({
    where: {
      status: POST_STATUS.APPROVED,
      [DB.Op.and]: [
        DB.sequelize.literal(
          `EXISTS (SELECT 1 FROM followers WHERE deleted_at is null AND follower_id = ${userId} AND "posts"."user_id" ="followers".following_id)`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "block_users" WHERE "deleted_at" is null AND "block_users"."user_id" = ${userId} AND "block_users"."user_blocked_id" = "posts"."user_id")`
        ),
        DB.sequelize.literal(
          `NOT EXISTS (SELECT 1 FROM "hidden_posts" WHERE "deleted_at" is null AND "hidden_posts"."user_id" = ${userId} AND "hidden_posts"."post_id" = "posts"."id")`
        ),
      ],
    },
    include: [
      {
        model: DB.sequelize.model('users'),
        attributes: ['id', 'full_name', 'avatar', ['is_blue_tick', 'isBlueTick'], ['admin_id', 'adminId']],
        where: { isBan: USER_IS_BAN.IS_NOT_BAN },
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
  return data;
};

module.exports = {
  getNews,
  getPopulars,
  getFollowing,
};
