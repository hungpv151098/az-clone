const axios = require('axios');
const DB = require('../models/postgres');
const config = require('../app.config');

const updateToken = async () => {
  let maxPage = 0;
  try {
    const response = await axios.get(`${config.cmcAPI}api/tokenList`);
    const data = response.data.data;
    maxPage = Math.ceil(data.total / data.per_page);
  } catch (err) {
    throw new Error(err.message);
  }
  let tokenList = [];

  for (let i = 1; i <= maxPage; i++) {
    try {
      const response = await axios.get(`${config.cmcAPI}api/tokenList?page=${i}`);
      const data = response.data.data.data;
      const tokenInfo = data.map(item => {
        return {
          cmcTokenId: item?.cmc_token_id,
          cmcRank: parseInt(item?.cmc_rank),
          name: item.name,
          symbol: item.symbol,
          logo: item?.token_info?.logo,
          created_at: item?.token_info?.created_at,
          updated_at: item?.token_info?.updated_at,
        };
      });
      tokenList = tokenList.concat(tokenInfo);
    } catch (err) {
      console.error(err);
    }
  }
  const t = await DB.sequelize.transaction();
  try {
    await DB.models.tags.update(
      {
        cmcRank: 10000000,
      },
      {
        where: { cmcTokenId: { [DB.Op.ne]: null } },
        transaction: t,
      }
    );
    await DB.models.tags.bulkCreate(tokenList, {
      updateOnDuplicate: ['name', 'symbol', 'logo', 'cmcRank', 'createdAt', 'updatedAt'],
      transaction: t,
    });
    await t.commit();
  } catch (e) {
    await t.rollback();
    throw new Error(e.message);
  }
};

module.exports = {
  updateToken,
};
