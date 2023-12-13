'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.addColumn('posts', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('comments', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('likes', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('shares', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('followers', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('reports', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('post_tags', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
      allowNull: true,
    });
    await queryInterface.addColumn('medias', 'deleted_at', {
      type: Sequelize.DataTypes.DATE,
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
    await queryInterface.removeColumn('posts', 'deleted_at');
    await queryInterface.removeColumn('comments', 'deleted_at');
    await queryInterface.removeColumn('likes', 'deleted_at');
    await queryInterface.removeColumn('shares', 'deleted_at');
    await queryInterface.removeColumn('followers', 'deleted_at');
    await queryInterface.removeColumn('reports', 'deleted_at');
    await queryInterface.removeColumn('post_tags', 'deleted_at');
    await queryInterface.removeColumn('medias', 'deleted_at');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
