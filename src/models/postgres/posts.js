const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'posts',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'user_id',
        onDelete: 'CASCADE',
      },
      adminId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: {
          model: 'admin_users',
          key: 'id',
        },
        field: 'admin_id',
        onDelete: 'CASCADE',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
      },
      likesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'likes_count',
      },
      commentsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'comments_count',
      },
      sharesCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'shares_count',
      },
      postShareId: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: 'posts',
      },
      deletedBy: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'deleted_by',
      },
      keyPost: {
        type: DataTypes.UUID,
        allowNull: false,
        defaultValue: literal('gen_random_uuid()'),
        field: 'key_post',
        unique: true,
      },
    },
    {
      sequelize,
      tableName: 'posts',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'posts_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'posts_user_id',
          fields: [{ name: 'user_id' }],
        },
      ],
    }
  );
};
