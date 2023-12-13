const { query } = require('express-validator');
const chargeFeeService = require('../services/chargeFee.service');

const checkBalance = async req => {
  const userId = req.user.id;
  const totalCost = req.query.totalCost;
  return await chargeFeeService.checkBalance(userId, totalCost);
};

const validate = {
  checkBalance: [query('totalCost').exists().withMessage('validate.required')],
};
module.exports = { checkBalance, validate };
