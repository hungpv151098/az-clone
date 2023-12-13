const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'coutries',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.SMALLINT,
        allowNull: false,
        primaryKey: true,
      },
      code: {
        type: DataTypes.STRING(10),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'coutries',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'coutries_code_key',
          unique: true,
          fields: [{ name: 'code' }],
        },
        {
          name: 'coutries_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
