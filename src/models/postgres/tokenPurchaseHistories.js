const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'tokenPurchaseHistories',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      address: {
        type: DataTypes.STRING(255),
        allowNull: false,
      },
      txnHash: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'txn_hash',
      },
      tokenAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'token_amount',
      },
      paymentAmount: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'payment_amount',
      },
      paymentMethod: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'payment_method',
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'token_purchase_histories',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'token_purchase_histories_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
