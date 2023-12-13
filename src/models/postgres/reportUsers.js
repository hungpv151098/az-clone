const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'reportUsers',
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
      reportId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'report_id',
      },
      reason: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      explaination: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'report_users',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'report_users_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'report_users_report_id',
          fields: [{ name: 'report_id' }],
        },
        {
          name: 'report_users_user_id',
          fields: [{ name: 'user_id' }],
        },
      ],
    }
  );
};
