const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'supportTicketDetail',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      supportTicketId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'support_ticket_id',
        references: { model: 'support_ticket', key: 'id' },
      },
      categoryQuestionId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'category_question_id',
        references: {
          model: 'support_category_question',
          key: 'id',
        },
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'support_ticket_detail',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'support_detail_id',
          fields: [{ name: 'id' }],
        },
        {
          name: 'support_detail_ticket_id',
          fields: [{ name: 'support_ticket_id' }],
        },
        {
          name: 'support_ticket_category_id',
          fields: [{ name: 'category_question_id' }],
        },
      ],
    }
  );
};
