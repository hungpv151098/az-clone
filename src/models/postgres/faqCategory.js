const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'faqCategory',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      category: {
        type: DataTypes.STRING(255),
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'faq_category',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'id',
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
