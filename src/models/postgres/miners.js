const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'miners',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'user_id',
      },
      connectUserId: {
        type: DataTypes.INTEGER,
        allowNull: false,
        field: 'connect_user_id',
      },
    },
    {
      sequelize,
      tableName: 'miners',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'miners_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'miners_user_id_connect_user_id_key',
          unique: true,
          fields: [{ name: 'user_id' }, { name: 'connect_user_id' }],
        },
      ],
    }
  );
};
