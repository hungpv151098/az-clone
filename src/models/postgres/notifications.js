const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notifications',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
      },
      adminId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'admin_users',
          key: 'id',
        },
        field: 'admin_id',
      },
      fireUserId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'fire_user_id',
      },
      notificationAdminId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'notification_admin',
          key: 'id',
        },
        field: 'notification_admin_id',
        onUpdate: 'CASCADE',
        onDelete: 'CASCADE',
      },
      type: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      notificationTitle: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'notification_title',
      },
      notificationText: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'notification_text',
      },
      actionId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'action_id',
      },
      actionType: {
        type: DataTypes.STRING(10),
        allowNull: true,
        field: 'action_type',
      },
      commentId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'comment_id',
      },
      replyId:{
        type:DataTypes.BIGINT,
        allowNull:true,
        field:'reply_id'
      },
      countNotification: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'count_notification',
      },
      isCheckable: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 2,
        field: 'is_checkable',
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 2,
      },
    },
    {
      sequelize,
      tableName: 'notifications',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'notifications_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'notifications_user_id',
          fields: [{ name: 'user_id' }],
        },
      ],
    }
  );
};
