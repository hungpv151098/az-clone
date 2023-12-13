const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'migrations',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      migration: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      batch: {
        type: DataTypes.INTEGER,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'migrations',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'migrations_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
