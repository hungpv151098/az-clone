const { query, param } = require('express-validator');
const chartService = require('../services/chart.service');
const throwError = require('../libs/throwError');
const appCodes = require('../constants/appCodes');

const getChartPost = async req => {
  const { userId, tagId, currentPage, pageSize } = req.query;
  if (!tagId) {
    throwError({
      message: 'Tag must be required',
      code: appCodes.validationErrors,
      status: 400,
    });
  }
  return await chartService.getChartPost(userId, tagId, currentPage, pageSize);
};

const getAZNews = async req => {
  const tagId = req.params.tagId;
  const { currentPage, pageSize } = req.query;
  return await chartService.getAZNews(tagId, currentPage, pageSize);
};

const getAZDetail = async req => {
  const postId = req.params.postId;
  return await chartService.getAZDetail(postId);
};

const getTokenDetail = async req => {
  const cmcTokenId = req.params.cmcTokenId;
  return await chartService.getTokenDetail(cmcTokenId);
};

const validate = {
  getChartPost: [query('tagId').exists().withMessage('validate.required')],
  getTokenDetail: [param('cmcTokenId').exists().withMessage('validate.required').isInt('validate.is_integer')],
};

module.exports = {
  getChartPost,
  getAZNews,
  getAZDetail,
  getTokenDetail,
  validate,
};
