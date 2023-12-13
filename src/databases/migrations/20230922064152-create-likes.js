'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('likes', {
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
        onDelete: 'CASCADE',
      },
      likeableId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'likeable_id',
        onDelete: 'CASCADE',
      },
      likeableType: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        field: 'likeable_type',
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
    await queryInterface.addIndex('likes', ['user_id']);
    await queryInterface.addIndex('likes', ['likeable_id']);
    /**
     *
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    queryInterface.dropTable('likes', { cascade: true });

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
