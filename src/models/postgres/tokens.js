const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'tokens',
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
      amountLock: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'amount_lock',
      },
      amountUnlock: {
        type: DataTypes.DOUBLE,
        allowNull: false,
        defaultValue: 0,
        field: 'amount_unlock',
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
    },
    {
      sequelize,
      tableName: 'tokens',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'tokens_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
