const { body } = require('express-validator');
const faqService = require('../services/faq.service');

const getFaqCategory = async req => {
  const { categoryId } = req.body;
  return await faqService.getFaqCategory(categoryId);
};

const getSupportProduct = async req => {
  const { productId } = req.body;
  return await faqService.getSupportProduct(productId);
};
const getQuestionWidget = async () => {
  return await faqService.getQuestionWidget();
};
const getQuestionFromCategory = async req => {
  const { categoryId } = req.body;
  return await faqService.getQuestionFromCategory(categoryId);
};
const createdSupportTicket = async req => {
  return await faqService.createdSupportTicket(req.body);
};

module.exports = {
  getFaqCategory,
  getSupportProduct,
  getQuestionWidget,
  getQuestionFromCategory,
  createdSupportTicket,
};
