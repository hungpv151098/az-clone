const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'tags',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      cmcTokenId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'cmc_token_id',
      },
      cmcRank: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'cmc_rank',
      },
      symbol: {
        type: DataTypes.STRING(20),
        allowNull: true,
      },
      logo: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      createId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'created_id',
      },
      createdBy: {
        type: DataTypes.STRING(50),
        allowNull: true,
        field: 'created_by',
      },
      rank: {
        type: DataTypes.DECIMAL(15, 2),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'tags',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'tags_pkey',
          fields: ['id'],
        },
        {
          name: 'cmc_token_id_tags_unique',
          unique: true,
          fields: ['cmc_token_id'],
        },
      ],
    }
  );
};
