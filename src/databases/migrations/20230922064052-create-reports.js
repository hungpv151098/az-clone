'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('reports', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
      },
      postId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'post_id',
      },
      reason: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        field: 'reason',
      },
      explaination: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'explaination',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    });
    await queryInterface.addIndex('reports', ['user_id']);
    await queryInterface.addIndex('reports', ['post_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('reports', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
