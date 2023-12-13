const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'passwordResets',
    {
      email: {
        type: DataTypes.STRING,
        allowNull: false,
        primaryKey: true,
      },
      token: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    },
    {
      sequelize,
      tableName: 'password_resets',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'password_resets_pkey',
          unique: true,
          fields: [{ name: 'email' }],
        },
      ],
    }
  );
};
