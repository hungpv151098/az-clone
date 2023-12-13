'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notification_template', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        field: 'type',
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: 'content',
      },
      createdAt: { type: Sequelize.DataTypes.DATE, allowNull: true, field: 'created_at' },
      updatedAt: { type: Sequelize.DataTypes.DATE, allowNull: true, field: 'updated_at' },
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notification_template');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
