'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('followers', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      followerId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'follower_id',
        onDelete: 'CASCADE',
      },
      followingId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'following_id',
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
    });

    await queryInterface.addIndex('followers', ['follower_id']);
    await queryInterface.addIndex('followers', ['following_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('followers', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
