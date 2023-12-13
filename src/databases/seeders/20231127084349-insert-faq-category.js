'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'faq_category',
      [
        { category: 'Account issue', created_at: new Date(), updated_at: new Date() },
        { category: 'Web3 issue', created_at: new Date(), updated_at: new Date() },
        { category: 'KYC issue', created_at: new Date(), updated_at: new Date() },
        { category: 'Tokenomics', created_at: new Date(), updated_at: new Date() },
        { category: 'Communities', created_at: new Date(), updated_at: new Date() },
        { category: 'Contact', created_at: new Date(), updated_at: new Date() },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('faq_category', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
