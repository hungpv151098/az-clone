'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('tags', 'cmc_token_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
      unique: true,
    });
    await queryInterface.addColumn('tags', 'cmc_rank', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: false,
    });
    await queryInterface.removeColumn('tags', 'coin_id');
    await queryInterface.changeColumn('tags', 'logo', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: true,
      field: 'logo',
    });
    await queryInterface.addIndex('tags', ['cmc_rank']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.addColumn('tags', 'coin_id', {
      type: Sequelize.DataTypes.STRING(255),
      allowNull: false,
    });
    await queryInterface.removeColumn('tags', 'cmc_token_id');
    await queryInterface.removeColumn('tags', 'cmc_rank');
    await queryInterface.changeColumn('tags', 'logo', {
      type: Sequelize.DataTypes.TEXT,
      allowNull: false,
      field: 'logo',
    });
    // await queryInterface.removeIndex('tags', ['cmc_rank']);

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
