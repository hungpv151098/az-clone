const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminUsers',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      username: {
        type: DataTypes.STRING(120),
        allowNull: false,
        unique: 'admin_users_username_unique',
      },
      password: {
        type: DataTypes.STRING(80),
        allowNull: false,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      avatar: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
      rememberToken: {
        type: DataTypes.STRING(100),
        allowNull: true,
        field: 'remember_token',
      },
    },
    {
      sequelize,
      tableName: 'admin_users',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_users_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'admin_users_username_unique',
          unique: true,
          fields: [{ name: 'username' }],
        },
      ],
    }
  );
};
