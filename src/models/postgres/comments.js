const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'comments',
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
      commentParentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'comment_parent_id',
      },
      replyId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'reply_id',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      deletedBy: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'deleted_by',
      },
    },
    {
      sequelize,
      tableName: 'comments',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'comments_comment_parent_id',
          fields: [{ name: 'comment_parent_id' }],
        },
        {
          name: 'comments_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'comments_post_id',
          fields: [{ name: 'post_id' }],
        },
        {
          name: 'comments_user_id',
          fields: [{ name: 'user_id' }],
        },
      ],
    }
  );
};
