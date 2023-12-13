'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'comments',
      [
        {
          user_id: 1,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Greatly',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 2,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Greatly',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 3,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Beautiful',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Wow',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 6,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Delicious',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 7,
          post_id: 1,
          comment_parent_id: 0,
          content: 'This is so helpful',
          created_at: new Date(),
          updated_at: new Date(),
        },

        {
          user_id: 9,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Greatly',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 10,
          post_id: 1,
          comment_parent_id: 0,
          content: 'Good luck',
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
    return queryInterface.bulkDelete('comments', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
