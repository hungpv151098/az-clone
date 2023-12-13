const dayjs = require('dayjs');

const getUtcStartOfDay = time => {
  if (!time) return dayjs().utc().startOf('day');

  return dayjs(time).utc().startOf('day');
};

const differenceDays = (dateStart, dateTo, round = false) => {
  const difference = dateTo.getTime() - dateStart.getTime();
  if (round) {
    return Math.ceil(difference / (1000 * 3600 * 24));
  }
  return Math.floor(difference / (1000 * 3600 * 24));
};

module.exports = {
  getUtcStartOfDay,
  differenceDays,
};
