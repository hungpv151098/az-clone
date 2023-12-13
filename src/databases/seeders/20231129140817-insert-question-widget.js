'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    return queryInterface.bulkInsert(
      'question_widget',
      [
        {
          name: 'label01',
          type_widget: 'text',
          validate: '{"maxlength": 250, "regex": "/"}',
          data_options: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
        {
          name: 'label02',
          type_widget: 'textArea',
          validate: '{"maxlength": 250, "regex": "/"}',
          data_options: null,
          created_at: new Date(),
          updated_at: new Date(),
        },
      ],
      {}
    );
  },

  async down(queryInterface, Sequelize) {
    return queryInterface.bulkDelete('question_widget', null, {});
    /**
     * Add commands to revert seed here.
     *
     * Example:
     * await queryInterface.bulkDelete('People', null, {});
     */
  },
};
