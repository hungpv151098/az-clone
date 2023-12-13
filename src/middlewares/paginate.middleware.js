const { DEFAULT_CURRENT_PAGE, DEFAULT_PER_PAGE} = require('../constants/const');

const addDefaultPaginate = async req => {
  const { currentPage, pageSize } = req.query;
  if (!currentPage || isNaN(currentPage)) {
    req.query.currentPage = DEFAULT_CURRENT_PAGE;
  }
  if (!pageSize || isNaN(pageSize)) {
    req.query.pageSize = DEFAULT_PER_PAGE;
  }
};

module.exports = addDefaultPaginate;
