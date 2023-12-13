const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'followers',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      followerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'follower_id',
        onDelete: 'CASCADE',
      },
      followingId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'following_id',
        onDelete: 'CASCADE',
      },
      deletedBy: {
        type: DataTypes.SMALLINT,
        allowNull: true,
        field: 'deleted_by',
      },
    },
    {
      sequelize,
      tableName: 'followers',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'followers_follower_id',
          fields: [{ name: 'follower_id' }],
        },
        {
          name: 'followers_following_id',
          fields: [{ name: 'following_id' }],
        },
        {
          name: 'followers_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'follower_following_unique',
          unique: true,
          fields: ['follower_id', 'following_id'],
        },
      ],
    }
  );
};
