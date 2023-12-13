const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminExtensionHistories',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      type: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '0',
      },
      detail: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'admin_extension_histories',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_extension_histories_name_index',
          fields: [{ name: 'name' }],
        },
        {
          name: 'admin_extension_histories_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
