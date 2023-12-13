const homeService = require('../services/home.service');

const getNews = async req => {
  const { userId, currentPage, pageSize } = req.query;
  return await homeService.getNews(userId, currentPage, pageSize);
};

const getPopulars = async req => {
  const { userId, currentPage, pageSize } = req.query;
  return await homeService.getPopulars(userId, currentPage, pageSize);
};

const getFollowing = async req => {
  const userId = req.user.id;
  const { currentPage, pageSize } = req.query;
  return await homeService.getFollowing(userId, currentPage, pageSize);
};

module.exports = {
  getNews,
  getPopulars,
  getFollowing
};
