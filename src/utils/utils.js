const { isString } = require('../libs/util');

const toLowerCase = str => (isString(str) ? str.toLowerCase() : str);

const sleep = ms => new Promise(resolve => setTimeout(resolve, ms));

const randomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1) + min);
};

const formatIntCoin = number => {
  return number ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 0 }).format(number) : number;
};

const abbreviateNumber = number => {
  const SI_SYMBOL = ['', 'K', 'M', 'G', 'T', 'P', 'E'];
  // what tier? (determines SI symbol)
  const tier = (Math.log10(Math.abs(number)) / 3) | 0;

  // if zero, we don't need a suffix
  if (tier === 0) return number;

  // get suffix and determine scale
  const suffix = SI_SYMBOL[tier];
  const scale = Math.pow(10, tier * 3);

  // scale the number
  const scaled = number / scale;

  // format number and add suffix
  return formatCoin(scaled) + suffix;
};

const formatCoin = number => {
  return number ? new Intl.NumberFormat('en-US', { maximumFractionDigits: 1 }).format(number) : number;
};

module.exports = {
  toLowerCase,
  sleep,
  randomInt,
  formatIntCoin,
  abbreviateNumber,
  formatCoin,
};
