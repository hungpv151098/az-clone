const faqController = require('../controllers/faq.controller');

const userRouter = [
  {
    url: '/faqCategories',
    action: faqController.getFaqCategory,
    isAuthenticate: false,
    method: 'post',
  },
  {
    url: '/supportProduct',
    action: faqController.getSupportProduct,
    isAuthenticate: false,
    method: 'post',
  },
  {
    url: '/questionWidget',
    action: faqController.getQuestionWidget,
    isAuthenticate: false,
    method: 'get',
  },
  {
    url: '/supportCategoryQuestion',
    action: faqController.getQuestionFromCategory,
    isAuthenticate: false,
    method: 'post',
  },
  {
    url: '/createdSupportTicket',
    action: faqController.createdSupportTicket,
    isAuthenticate: false,
    method: 'post',
  },
];

module.exports = userRouter;
