'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_category_question', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      supportCategoryId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'support_category_id',
        references: {
          model: 'support_category',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      questionWidgetId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'question_widget_id',
        references: {
          model: 'question_widget',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    });
    await queryInterface.addIndex('support_category_question', ['support_category_id']);
    await queryInterface.addIndex('support_category_question', ['question_widget_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('support_category_question', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
