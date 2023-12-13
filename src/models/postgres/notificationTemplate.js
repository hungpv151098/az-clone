const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'notificationTemplate',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      type: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'notification_template',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'notification_template_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
