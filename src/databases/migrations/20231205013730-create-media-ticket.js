'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('media_ticket', {
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
      },
      media: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
    });
    await queryInterface.addIndex('media_ticket', ['support_ticket_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('media_ticket', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
