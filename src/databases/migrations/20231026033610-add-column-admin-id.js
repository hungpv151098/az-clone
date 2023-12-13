'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await await queryInterface.addColumn('users', 'admin_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    });
    await queryInterface.addConstraint('users', {
      fields: ['admin_id'],
      type: 'foreign key',
      name: 'admin_users_fkey',
      references: {
        table: 'admin_users',
        field: 'id',
      },
      onUpdate: 'CASCADE',
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
    await queryInterface.removeConstraint('users', 'admin_id');
    await queryInterface.removeColumn('users', 'admin_id');

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
