const axios = require('axios');
const appUrl = process.env.APP_API_URL;
const apiKey = process.env.APP_API_KEY;
const get = async (path, params = '') => {
  const url = appUrl + path + `?apiKey=${apiKey}` + '&' + params;
  return await axios.get(url);
};

const post = async (path, body = {}) => {
  const url = appUrl + path + `?apiKey=${apiKey}`;
  return await axios.post(url, body);
};

module.exports = {
  get,
  post,
};
