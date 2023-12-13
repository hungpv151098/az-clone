const successResponse = (data = {}, message = '') => {
  return {
    status_code: 200,
    message,
    data,
  };
};

const errorResponse = (message = '', status_code = 400) => {
  return {
    status_code,
    message,
  };
};

module.exports = {
  successResponse,
  errorResponse,
};
