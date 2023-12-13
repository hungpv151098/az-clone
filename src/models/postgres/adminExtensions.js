const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminExtensions',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(100),
        allowNull: false,
        unique: 'admin_extensions_name_unique',
      },
      version: {
        type: DataTypes.STRING(20),
        allowNull: false,
        defaultValue: '',
      },
      isEnabled: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 0,
        field: 'is_enabled',
      },
      options: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'admin_extensions',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_extensions_name_unique',
          unique: true,
          fields: [{ name: 'name' }],
        },
        {
          name: 'admin_extensions_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
