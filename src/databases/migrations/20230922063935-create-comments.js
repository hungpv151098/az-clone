'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('comments', {
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
        references: { model: 'posts', key: 'id' },
        field: 'post_id',
        onDelete: 'CASCADE',
      },
      commentParentId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'comment_parent_id',
      },
      replyId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'reply_id',
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'content',
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
    await queryInterface.addIndex('comments', ['user_id']);
    await queryInterface.addIndex('comments', ['post_id']);
    await queryInterface.addIndex('comments', ['comment_parent_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('comments', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
