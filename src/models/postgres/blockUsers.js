const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'blockUsers',
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
        onDelete: 'CASCADE',
      },
      userBlockedId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_blocked_id',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'block_users',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'block_users_user_id',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'block_users_user_blocked_id',
          fields: [{ name: 'user_blocked_id' }],
        },
        {
          name: 'block_users_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'user_user_blocked_unique',
          unique: true,
          fields: ['user_id', 'user_blocked_id'],
        },
      ],
    }
  );
};
