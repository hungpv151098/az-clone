'use strict';

const axios = require('axios');
const config = require('../../app.config');

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    let maxPage = 0;
    try {
      const response = await axios.get('http://cmcapi.azcoiner.com/api/tokenList');
      const data = response.data.data;
      maxPage = Math.ceil(data.total / data.per_page);
    } catch (err) {
      throw new Error(err.message);
    }

    for (let i = 1; i <= maxPage; i++) {
      try {
        const response = await axios.get(`http://cmcapi.azcoiner.com/api/tokenList?page=${i}`);
        const data = response.data.data.data;
        const tokenInfo = data.map(item => {
          return {
            cmc_token_id: item?.cmc_token_id,
            cmc_rank: parseInt(item?.cmc_rank),
            name: item.name,
            symbol: item.symbol,
            logo: item?.token_info?.logo,
            created_at: item?.token_info?.created_at,
            updated_at: item?.token_info?.updated_at,
          };
        });
        await queryInterface.bulkInsert('tags', tokenInfo, {});
      } catch (err) {
        throw new Error(err.message);
      }
    }
    /**
     * Add seed commands here.
     *
     * Example:
     * await queryInterface.bulkInsert('People', [{
     *   name: 'John Doe',
     *   isBetaMember: false
     * }], {});
     */
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('tags', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
