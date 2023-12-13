'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up (queryInterface, Sequelize) {
    await queryInterface.addColumn('likes', 'deleted_by', {
      type: Sequelize.DataTypes.SMALLINT,
      allowNull: true,
      comment:'1:user, 2:admin, 3:ban'
    });
    await queryInterface.addColumn('comments', 'deleted_by', {
      type: Sequelize.DataTypes.SMALLINT,
      allowNull: true,
      comment:'1:user, 2:admin, 3:ban'
    });
    await queryInterface.addColumn('followers', 'deleted_by', {
      type: Sequelize.DataTypes.SMALLINT,
      allowNull: true,
      comment:'1:user, 2:admin, 3:ban'
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down (queryInterface, Sequelize) {
    await queryInterface.removeColumn('likes', 'deleted_by');
    await queryInterface.removeColumn('comments', 'deleted_by');
    await queryInterface.removeColumn('followers', 'deleted_by');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  }
};
