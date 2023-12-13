'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('post_trade_histories', {
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
      postId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        references: { model: 'posts', key: 'id' },
        field: 'post_id',
        onDelete: 'CASCADE',
      },
      balance: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      balanceLock: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        field: 'balance_lock',
      },
      cost: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      costLock: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        field: 'cost_lock',
      },
      balanceAfter: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        field: 'balance_after',
      },
      balanceLockAfter: {
        type: Sequelize.DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        field: 'balance_lock_after',
      },
      type: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
      },
      action: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
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
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('post_trade_histories', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
