const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'displayedNotifications',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
      },
      notificationUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'notification_user_id',
      },
      activityId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'activity_id',
      },
      activityType: {
        type: DataTypes.STRING(20),
        allowNull: false,
        field: 'activity_type',
      },
    },
    {
      sequelize,
      tableName: 'displayed_notifications',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'displayed_notifications_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
