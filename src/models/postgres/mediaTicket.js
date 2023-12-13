const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'mediaTicket',
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
      media: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'media_ticket',
      schema: 'public',
      timestamps: false,
      indexes: [
        {
          name: 'media_id',
          fields: [{ name: 'id' }],
        },
        {
          name: 'media_support_ticket_id',
          fields: [{ name: 'support_ticket_id' }],
        },
      ],
    }
  );
};
