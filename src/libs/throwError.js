const appCodes = require('../constants/appCodes');

const throwError = ({ message, code, status, errors, skipI18n }) => {
  const e = new Error(message);

  e.code = code || appCodes.unknownError;
  e.status = status || 200;
  e.skipI18n = !!skipI18n;
  e.data = errors || null;

  throw e;
};

module.exports = throwError;
