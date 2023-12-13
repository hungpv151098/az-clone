'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.changeColumn('tags', 'cmc_token_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
      unique: true,
    });
    await queryInterface.changeColumn('tags', 'cmc_rank', {
      type: Sequelize.DataTypes.DECIMAL(15, 2),
      allowNull: true,
    });
    await queryInterface.addColumn('tags', 'created_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    });
    await queryInterface.addColumn('tags', 'created_by', {
      type: Sequelize.DataTypes.STRING(50),
      allowNull: true,
    });
    await queryInterface.changeColumn('tags', 'symbol', {
      type: Sequelize.DataTypes.STRING(20),
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
    await queryInterface.changeColumn('tags', 'cmc_token_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    });

    await queryInterface.changeColumn('tags', 'cmc_rank', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
    });

    await queryInterface.removeColumn('tags', 'created_id');
    await queryInterface.removeColumn('tags', 'created_by');
    await queryInterface.changeColumn('tags', 'symbol', {
      type: Sequelize.DataTypes.STRING(20),
      allowNull: false,
    });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
