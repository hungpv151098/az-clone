'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'notifications',
      [
        {
          user_id: 4,
          type: 1,
          notification_text: 'Like 1',
          action_id: 1,
          action_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          type: 2,
          notification_text: 'Like 2',
          action_id: 2,
          action_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          type: 3,
          notification_text: 'Like 3',
          action_id: 3,
          action_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          type: 4,
          notification_text: 'Like 4',
          action_id: 4,
          action_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          type: 5,
          notification_text: 'Like 5',
          action_id: 5,
          action_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          type: 6,
          notification_text: 'Like 6',
          action_id: 6,
          action_type: 'posts',
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
    return queryInterface.bulkDelete('notifications', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
