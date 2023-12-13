'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'post_share_id', {
      type: Sequelize.DataTypes.BIGINT,
      allowNull: true,
    });
    await queryInterface.addColumn('posts', 'type', {
      type: Sequelize.DataTypes.STRING(50),
      defaultValue: 'posts',
      allowNull: false,
    });

    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.removeColumn('posts', 'post_share_id');
    await queryInterface.removeColumn('posts', 'type');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
