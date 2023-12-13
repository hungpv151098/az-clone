const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'faq',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      question: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'question',
      },
      answer: {
        type: DataTypes.STRING(500),
        allowNull: true,
        field: 'answer',
      },
      categoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'category_id',
        references: {
          model: 'faqCategory',
          key: 'id',
        },
      },
    },
    {
      sequelize,
      tableName: 'faq',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'faq_id',
          fields: [{ name: 'id' }],
        },
        {
          name: 'faq_category_id',
          fields: [{ name: 'category_id' }],
        },
      ],
    }
  );
};
