const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'hiddenPosts',
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
      tableName: 'hidden_posts',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'hidden_posts_user_sid',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'hidden_posts_user_blocked_id',
          fields: [{ name: 'posts_id' }],
        },
        {
          name: 'hidden_posts_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'user_post_unique',
          unique: true,
          fields: ['user_id', 'post_id'],
        },
      ],
    }
  );
};
