'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('block_users', {
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
      userBlockedId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'user_blocked_id',
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
      deletedAt:{
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      }
    });

    await queryInterface.addIndex('block_users', ['user_id']);
    await queryInterface.addIndex('block_users', ['user_blocked_id']);
    await queryInterface.addConstraint('block_users', {
      fields: ['user_id', 'user_blocked_id'],
      type: 'unique',
      name: 'user_user_blocked_unique',
    });
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('block_users', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
