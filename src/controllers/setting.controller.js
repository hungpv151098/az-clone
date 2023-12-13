const config = require('../app.config');

const setting = async () => {
  const basicFeeCost = parseFloat(config.setting.basicFeeCost);
  const imageCost = parseFloat(config.setting.imageCost);
  const videoCost = parseFloat(config.setting.videoCost);
  const shareWallCost = parseFloat(config.setting.shareWallCost);

  return {
    basicFeeCost,
    imageCost,
    videoCost,
    shareWallCost,
  };
};

module.exports = {
  setting,
};
