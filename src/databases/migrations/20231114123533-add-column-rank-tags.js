'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tags', 'cmc_rank', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    });
    await queryInterface.addColumn('tags', 'rank', {
      type: Sequelize.DataTypes.DECIMAL(15, 2),
      allowNull: true,
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tags', 'cmc_rank', {
      type: Sequelize.DataTypes.DECIMAL(15, 2),
      allowNull: true,
    });
    await queryInterface.removeColumn('tags', 'rank');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
