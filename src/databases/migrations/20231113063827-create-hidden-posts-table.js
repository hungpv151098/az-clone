'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('hidden_posts', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'user_id',
        onDelete: 'CASCADE',
      },
      postId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'posts', key: 'id' },
        field: 'post_id',
        onDelete: 'CASCADE',
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
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    });
    await queryInterface.addIndex('hidden_posts', ['user_id']);
    await queryInterface.addIndex('hidden_posts', ['post_id']);
    await queryInterface.addConstraint('hidden_posts', {
      fields: ['user_id', 'post_id'],
      type: 'unique',
      name: 'user_posts_unique',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('hidden_posts', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
