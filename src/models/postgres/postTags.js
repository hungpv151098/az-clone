const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'postTags',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
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
      tagId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'tags',
          key: 'id',
        },
        field: 'tag_id',
      },
      deletedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    },
    {
      sequelize,
      tableName: 'post_tags',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'post_tags_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'post_tags_post_id',
          fields: [{ name: 'post_id' }],
        },
        {
          name: 'post_tags_tag_id',
          fields: [{ name: 'tag_id' }],
        },
      ],
    }
  );
};
