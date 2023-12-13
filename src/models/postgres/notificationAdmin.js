const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notificationAdmin',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
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
    },
    {
      sequelize,
      tableName: 'notification_admin',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'notification_admin_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
