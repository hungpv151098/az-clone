const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'cryptoPrices',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      usdt: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 1,
      },
      eth: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      btc: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
      bnb: {
        type: DataTypes.DECIMAL,
        allowNull: false,
        defaultValue: 0,
      },
    },
    {
      sequelize,
      tableName: 'crypto_prices',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'crypto_prices_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
