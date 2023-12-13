const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'miningSessions',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.INTEGER,
        allowNull: false,
        primaryKey: true,
      },
      minerId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'miners',
          key: 'id',
        },
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
        type: DataTypes.DECIMAL,
        allowNull: false,
        field: 'mining_speed',
      },
      baseRate: {
        type: DataTypes.DECIMAL,
        allowNull: true,
        field: 'base_rate',
      },
      startAtMinute: {
        type: DataTypes.STRING(15),
        allowNull: true,
        field: 'start_at_minute',
      },
    },
    {
      sequelize,
      tableName: 'mining_sessions',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'mining_sessions_miner_id_start_at_minute_key',
          unique: true,
          fields: [{ name: 'miner_id' }, { name: 'start_at_minute' }],
        },
        {
          name: 'mining_sessions_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
