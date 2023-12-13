const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'supportProduct',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'support_product',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'product_id',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
