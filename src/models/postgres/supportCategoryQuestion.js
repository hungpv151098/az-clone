const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'supportCategoryQuestion',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      supportCategoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'support_category_id',
        references: {
          model: 'support_category',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
      questionWidgetId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'question_widget_id',
        references: {
          model: 'question_widget',
          key: 'id',
        },
        onDelete: 'CASCADE',
      },
    },
    {
      sequelize,
      tableName: 'support_category_question',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'category_question_id',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'category_question_id',
          fields: [{ name: 'support_category_id' }],
        },
        {
          name: 'category_question_widget_id',
          fields: [{ name: 'question_widget_id' }],
        },
      ],
    }
  );
};
