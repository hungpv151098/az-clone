'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'posts',
      [
        {
          user_id: 4,
          content: 'Lorem ipsum dolor sit amet',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 12,
          content: 'Consectetur adipiscing elit ',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 10,
          content: 'Nullam feugiat venenatis pharetra',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 22,
          content: 'Proin dictum a sem nec accumsan',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 23,
          content: 'Ut non aliquet dolor',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 24,
          content: 'Id porta nunc',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 25,
          content: ' Vivamus in sodales dui',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 6,
          content: 'Etiam elementum bibendum sapien',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 3,
          content: 'Quis fringilla elit dictum ac',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          content: 'Aliquam quis enim at magna sodales condimentum a vel diam',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 1,
          content: 'Donec tristique enim non fringilla elementum',
          status: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
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
    return queryInterface.bulkDelete('posts', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
