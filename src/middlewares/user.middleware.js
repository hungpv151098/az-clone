const throwError = require('../libs/throwError');
const appCodes = require('../constants/appCodes');
const userService = require('../services/user.service');
const config = require('../app.config');
const axios = require('axios');

const checkUser = async req => {
  let token = '';
  if (req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
    token = req.headers.authorization.split(' ')[1];
  }
  if (!token) {
    return throwError({
      message: req.t('auth.need_auth'),
      code: appCodes.unauthorized,
      status: 401,
    });
  }
  const data = await userProcessingProd(token);
  if (!data) {
    return throwError({
      message: req.t('auth.need_auth'),
      code: appCodes.unauthorized,
      status: 401,
    });
  }
  const userQuery = await userService.findOneUser({
    where: {
      id: data.id,
    },
  });
  req.user = { ...data, isBlueTick: userQuery?.isBlueTick };
};
const userProcessingProd = async token => {
  let headers = {
    headers: {
      Authorization: 'Bearer ' + token,
    },
  };
  try {
    const response = await axios.get(`${config.mainAPI}/me`, headers);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};
module.exports = checkUser;
