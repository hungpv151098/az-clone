const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'sequelizeMeta',
    {
      name: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'SequelizeMeta',
      schema: 'public',
      timestamps: true,
      underscored: true,
    }
  );
};
