const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'mailLogs',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      target: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
      },
      type: {
        type: DataTypes.STRING(30),
        allowNull: false,
      },
      secret: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      attempts: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
      expiredAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'expired_at',
      },
    },
    {
      sequelize,
      tableName: 'mail_logs',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'mail_logs_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'mail_logs_secret_key',
          unique: true,
          fields: [{ name: 'secret' }],
        },
      ],
    }
  );
};
