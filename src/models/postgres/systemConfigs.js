const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'systemConfigs',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true,
      },
      key: {
        type: DataTypes.STRING(100),
        allowNull: false,
      },
      value: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'system_configs',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'system_configs_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
