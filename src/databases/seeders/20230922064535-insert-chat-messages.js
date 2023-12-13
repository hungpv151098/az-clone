'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'chat_messages',
      [
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'Hello',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'Hi',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'My name is',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'Nice to meet you ',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'TRWRWRWRWRASF<Klasfk',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'Testststs',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'HelraAsfafaslo',
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          sender_user_id: 1,
          receiver_user_id: 4,
          content: 'Helfasfasfaslo',
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
    return queryInterface.bulkDelete('chat_messages', null, {});

    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
