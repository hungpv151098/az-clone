'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('notifications', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'user_id',
      },
      adminId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'admin_id',
      },
      fireUserId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'fire_user_id',
      },
      notificationAdminId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'notification_admin_id',
      },
      // 1.Like ; 2.Share; 3.Comment ; 4.Follow ;5.Mention ; 6.Direct Message
      type: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        field: 'type',
      },
      notificationTitle: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'notification_title',
      },
      notificationText: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'notification_text',
      },
      actionId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'action_id',
      },
      actionType: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: true,
        field: 'action_type',
      },
      commentId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'comment_id',
      },
      replyId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'reply_id',
      },
      countNotification: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'count_notification',
        defaultValue: 0,
      },
      //1.checked 2.unchecked
      isCheckable: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 2,
        field: 'is_checkable',
      },
      //1.read ; 2. unread
      status: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 2,
        field: 'status',
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
    await queryInterface.addIndex('notifications', ['user_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('notifications', { cascade: true });

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
