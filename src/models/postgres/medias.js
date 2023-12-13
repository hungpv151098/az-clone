const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'medias',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      mediableId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'mediable_id',
      },
      mediableType: {
        type: DataTypes.STRING(10),
        allowNull: false,
        field: 'mediable_type',
      },
      type: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      thumbUrl: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'thumb_url',
      },
      mediaUrl: {
        type: DataTypes.TEXT,
        allowNull: false,
        field: 'media_url',
      },
    },
    {
      sequelize,
      tableName: 'medias',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'medias_mediable_id',
          fields: [{ name: 'mediable_id' }],
        },
        {
          name: 'medias_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
