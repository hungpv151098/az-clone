'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('displayed_notifications', {
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
      notificationUserId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'notification_user_id',
      },
      activityId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'activity_id',
      },
      activityType: {
        type: Sequelize.DataTypes.STRING(20),
        allowNull: false,
        field: 'activity_type',
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
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('displayed_notifications', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
