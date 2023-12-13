'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('posts', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        field: 'user_id',
        onDelete: 'CASCADE',
      },
      adminId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        references: { model: 'admin_users', key: 'id' },
        field: 'admin_id',
        onDelete: 'CASCADE',
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'content',
      },
      //1. pending; 2.approved; 3.reported
      status: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        field: 'status',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
      updated_at: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
      likesCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        field: 'likes_count',
        defaultValue: 0,
      },
      commentsCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        field: 'comments_count',
        defaultValue: 0,
      },
      sharesCount: {
        type: Sequelize.DataTypes.INTEGER,
        allowNull: false,
        field: 'shares_count',
        defaultValue: 0,
      },
    });
    await queryInterface.addIndex('posts', ['user_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('posts', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
