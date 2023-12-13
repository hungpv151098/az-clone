'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'followers',
      [
        {
          follower_id: 1,
          following_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 2,
          following_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 3,
          following_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 6,
          following_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 7,
          following_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 9,
          following_id: 4,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 4,
          following_id: 1,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 4,
          following_id: 2,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 4,
          following_id: 3,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          follower_id: 4,
          following_id: 7,
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
    return queryInterface.bulkDelete('followers', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
