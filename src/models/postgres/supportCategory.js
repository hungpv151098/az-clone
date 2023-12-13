const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'supportCategory',
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
      supportProductId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'support_product_id',
        references: {
          model: 'supportProduct',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'support_category',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'category_id',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
