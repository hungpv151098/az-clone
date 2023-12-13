'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('medias', 'mediable_type', {
      type: Sequelize.DataTypes.STRING(25),
      allowNull: false,
      field: 'mediable_type',
    });
    /**
     *
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('medias', 'mediable_type', {
      type: Sequelize.DataTypes.STRING(10),
      allowNull: false,
      field: 'mediable_type',
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
