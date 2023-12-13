'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'support_category',
      [
        {
          support_product_id: 1,
          title: 'category 1: productId-1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          support_product_id: 1,
          title: 'category 2: productId-1',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          support_product_id: 2,
          title: 'category 1: productId-2',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          support_product_id: 2,
          title: 'category 2: productId-2',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          support_product_id: 3,
          title: 'I can not log into my account, the system notify that "unusual issue',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          support_product_id: 3,
          title: 'I do not know where to get my referal code',
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('support_category', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
