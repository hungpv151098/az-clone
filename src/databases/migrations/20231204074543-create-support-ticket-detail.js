'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_ticket_detail', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      supportTicketId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'support_ticket_id',
        references: {
          model: 'support_ticket',
          key: 'id',
        },
      },
      categoryQuestionId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'category_question_id',
        references: {
          model: 'support_category_question',
          key: 'id',
        },
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
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
      updatedBy: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'updated_by',
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    });
    await queryInterface.addIndex('support_ticket_detail', ['support_ticket_id']);
    await queryInterface.addIndex('support_ticket_detail', ['category_question_id']);
  },
  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('support_ticket_detail', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
