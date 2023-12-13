const DB = require('../models/postgres');
const appCodes = require('../constants/appCodes');
const appMessages = require('../constants/appMessages');
const throwError = require('../libs/throwError');
const { findOneUser } = require('./user.service');
const dayjs = require('dayjs');
const axios = require('axios');
const { botSendMessage } = require('../libs/telegram');

const getFaqCategory = async id => {
  try {
    let query = {};
    if (id) query = { id: id };
    const result = await DB.models.faqCategory.findAll({
      where: query,
      include: [
        {
          model: DB.sequelize.model('faq'),
          as: 'faq',
        },
      ],
    });
    if (!result) {
      throwError({
        message: 'error',
        code: appCodes.unknownError,
        status: 405,
      });
    }
    return result;
  } catch (error) {
    console.log(error);
    return;
  }
};

const getSupportProduct = async id => {
  try {
    let query = {};
    if (id) query = { id: id };
    let res = await DB.models.supportProduct.findAll({
      where: query,
      include: [
        {
          model: DB.sequelize.model('supportCategory'),
          as: 'supportCategory',
        },
      ],
    });
    if (!res) {
      throwError({
        message: 'error',
        code: appCodes.unknownError,
        status: 405,
      });
    }
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
};

const getQuestionWidget = async () => {
  try {
    let res = await DB.models.questionWidget.findAll();
    if (!res) {
      throwError({
        message: 'error',
        code: appCodes.unknownError,
        status: 405,
      });
    }
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
};

const getQuestionFromCategory = async id => {
  try {
    let res = await DB.models.supportCategoryQuestion.findAll({
      where: { support_category_id: id },
      include: [
        {
          model: DB.sequelize.model('questionWidget'),
          attributes: ['id', 'name', 'type_widget', 'validate', 'dataOptions'],
          as: 'questionWidget',
        },
      ],
    });
    if (!res) {
      throwError({
        message: 'Error! get category question',
        code: appCodes.unknownError,
        status: 405,
      });
    }
    return res;
  } catch (error) {
    console.log(error);
    return;
  }
};

const createdSupportTicket = async body => {
  const { email, fullName, supportCategoryId, title, desc, content, media, captcha, productId } = body;
  try {
    if (!email || !fullName || !supportCategoryId || !captcha || !desc || !productId) {
      throwError({
        message: appMessages.requiredField,
        code: appCodes.unknownError,
        status: 405,
      });
    }
    if (supportCategoryId === 'other' && !title) {
      throwError({
        message: appMessages.requiredField,
        code: appCodes.unknownError,
        status: 405,
      });
    }
    let data = {
      statusRequest: 'new',
      adminId: null,
      createdAt: new Date(),
      updatedAt: new Date(),
      priority: 1,
    };
    //message for telegram bot
    let messageTel = {
      titleProduct: '',
      titleCategory: 'Other',
      desc: desc,
      media: 'No',
    };
    let product = await DB.models.supportProduct.findOne({
      where: { id: productId },
      include: [
        {
          model: DB.sequelize.model('supportCategory'),
          as: 'supportCategory',
        },
      ],
    });
    if (product) {
      let category = product.supportCategory.find(x => x.id == supportCategoryId);
      messageTel.titleProduct = product.title;
      if (category) {
        messageTel.titleCategory = category.title;
      }
    } else {
      throwError({
        message: appMessages.requiredField,
        code: appCodes.unknownError,
        status: 405,
      });
    }
    //check user
    const user = await findOneUser({ where: { email: email } });
    if (!user) {
      data.typeUserRequest = 'other';
      data.userId = null;
    } else {
      data.typeUserRequest = 'system';
      data.userId = user.dataValues.id;
    }
    //check mail createAt
    const findTicket = await DB.models.supportTicket.findOne({ where: { email: email } });
    const currentDate = new Date();
    if (findTicket && dayjs(findTicket.createdAt).isSame(currentDate, 'day')) {
      throwError({
        message: appMessages.receivedRequest,
        code: appCodes.unknownError,
        status: 405,
      });
    }
    //get question from category id
    const questions = await DB.models.supportCategoryQuestion.findAll({
      where: { support_category_id: supportCategoryId === 'other' ? null : supportCategoryId },
    });
    // check captcha
    let resCap = await axios.post(
      `${process.env.HOST_VERIFY_CAPTCHA}?secret=${process.env.SECRET_KEY_RECAPTCHA}&response=${captcha}`
    );
    if (resCap.data.success) {
      //create ticket
      const result = await DB.models.supportTicket.create({
        ...data,
        supportCategoryId: supportCategoryId === 'other' ? null : supportCategoryId,
        fullName: fullName,
        title: title,
        email: email,
        desc: desc,
      });
      let newMedia = media && JSON.parse(media);
      if (newMedia) {
        messageTel.media = JSON.stringify(newMedia.map(x => x.mediaUrl));
        for (let i = 0; i < newMedia.length; i++) {
          await DB.models.mediaTicket.create({
            supportTicketId: result.id ? result.id : null,
            media: newMedia[i]['mediaUrl'] || null,
          });
        }
      }
      if (result) {
        if (questions) {
          let newContent = content ? JSON.parse(content) : {};
          for (let i = 0; i < questions.length; i++) {
            await DB.models.supportTicketDetail.create({
              supportTicketId: result.id,
              categoryQuestionId: questions[i]['id'],
              content: newContent[[questions[i]['id']]] ?? '',
              createdAt: new Date(),
              updatedAt: new Date(),
            });
          }
        }
        //Send message to telegram upon request
        await botSendMessage({
          botToken: process.env.CHATBOT_SUPPORT_TOKEN,
          message: `ID: ${result.id} - There is a support request from ${email} email with content:\n1. Product: ${
            messageTel.titleProduct
          }\n2. Category: ${messageTel.titleCategory}\n3. Description: ${
            messageTel.desc
          }\n4. Media: ${messageTel.media.slice(1, -1)}\npending approval. Pls check!`,
          chatId: process.env.CHATBOT_SUPPORT_ID,
        });
        return result;
      } else {
        throwError({
          message: appMessages.unknownError,
          code: appCodes.unknownError,
          status: 405,
        });
      }
    } else {
      throwError({
        message: 'Captcha error',
        code: appCodes.unknownError,
        status: 405,
      });
    }
  } catch (error) {
    console.log(error);
    return;
  }
};

module.exports = {
  getFaqCategory,
  getSupportProduct,
  getQuestionWidget,
  getQuestionFromCategory,
  createdSupportTicket,
};
