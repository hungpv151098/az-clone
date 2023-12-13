const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'likes',
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
      likeableId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'likeable_id',
      },
      likeableType: {
        type: DataTypes.STRING(50),
        allowNull: false,
        field: 'likeable_type',
      },
      deletedBy: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'deleted_by',
      },
    },
    {
      sequelize,
      tableName: 'likes',
      schema: 'public',
      timestamps: true,
      underscored: true,
      paranoid: true,
      indexes: [
        {
          name: 'likes_likeable_id',
          fields: [{ name: 'likeable_id' }],
        },
        {
          name: 'likes_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'likes_user_id',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'user_like_unique_key',
          unique: true,
          fields: ['user_id', 'likeable_id', 'likeable_type'],
        },
      ],
    }
  );
};
