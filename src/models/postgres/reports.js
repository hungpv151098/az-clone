const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'reports',
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
      reason: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      explaination: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'reports',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'reports_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'reports_post_id',
          fields: [{ name: 'post_id' }],
        },
        {
          name: 'reports_user_id',
          fields: [{ name: 'user_id' }],
        },
      ],
    }
  );
};
