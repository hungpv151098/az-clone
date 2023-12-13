'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'notification_template',
      [
        {
          type: 4,
          content: '{user} has started following you.',
        },
        {
          type: 4,
          content: '{user} and {number} others has started following you.',
        },
        {
          type: 8,
          content: '{user} has posted a new post',
        },
        {
          type: 1,
          content: '{user} liked your post',
        },
        {
          type: 1,
          content: '{user} and {number} others liked your post',
        },
        {
          type: 3,
          content: '{user} commented on your post',
        },
        { type: 3, content: '{user} and {number} others commented on your post' },
        { type: 5, content: '{user} mentioned you in a comment' },
        { type: 11, content: '{user} liked your comment' },
        { type: 11, content: '{user} and {number} others liked your comment' },
        { type: 2, content: '{user} shared your post' },
        { type: 2, content: '{user} and {number} others shared your post' },
        { type: 12, content: '{user} just replied to your comment' },
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
    return queryInterface.bulkDelete('notification_template', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
