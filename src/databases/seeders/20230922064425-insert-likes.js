'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'likes',
      [
        {
          user_id: 3,
          likeable_id: 4,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 4,
          likeable_id: 5,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 6,
          likeable_id: 6,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 7,
          likeable_id: 7,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 9,
          likeable_id: 8,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 10,
          likeable_id: 9,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 11,
          likeable_id: 10,
          likeable_type: 'posts',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          user_id: 11,
          likeable_id: 11,
          likeable_type: 'posts',
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
    return queryInterface.bulkDelete('likes', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
