const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'shares',
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
      postId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'posts',
          key: 'id',
        },
        field: 'post_id',
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'shares',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'shares_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'shares_post_id',
          fields: [{ name: 'post_id' }],
        },
        {
          name: 'shares_user_id',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'user_post_unique_key',
          unique: true,
          fields: ['user_id', 'post_id'],
        },
      ],
    }
  );
};
