'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('notification_admin', 'admin_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    });
    queryInterface.addConstraint('notification_admin', {
      fields: ['admin_id'],
      type: 'foreign key',
      name: 'admin_notifications_admin_fkey',
      references: {
        table: 'admin_users',
        field: 'id',
      },
      onDelete: 'CASCADE',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    queryInterface.removeConstraint('notification_admin', 'admin_id');
    await queryInterface.removeColumn('notification_admin', 'admin_id');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
