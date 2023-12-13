const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'miningHistories',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      minerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'miner_id',
      },
      startAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'start_at',
      },
      endAt: {
        type: DataTypes.DATE,
        allowNull: false,
        field: 'end_at',
      },
      miningSpeed: {
        type: DataTypes.REAL,
        allowNull: false,
        field: 'mining_speed',
      },
      balanceLocked: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
        field: 'balance_locked',
      },
    },
    {
      sequelize,
      tableName: 'mining_histories',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'mining_histories_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
