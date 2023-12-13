'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'support_product',
      [
        { title: 'Web3 Swap', created_at: new Date(), updated_at: new Date() },
        { title: 'Mobile App', created_at: new Date(), updated_at: new Date() },
        { title: 'AZC News', created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('support_product', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
