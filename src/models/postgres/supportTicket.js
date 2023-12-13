const { literal } = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'supportTicket',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        field: 'user_id',
        onDelete: 'CASCADE',
      },
      fullName: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'full_name',
      },
      email: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'email',
      },
      title: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      desc: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      adminId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'admin_id',
        references: { model: 'admin_users', key: 'id' },
      },
      note: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      typeUserRequest: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'type_user_request',
      },
      supportCategoryId: {
        type: DataTypes.BIGINT,
        allowNull: true,
        field: 'support_category_id',
        references: { model: 'support_category', key: 'id' },
      },
      priority: {
        type: DataTypes.BIGINT,
        allowNull: true,
      },
      statusRequest: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'status_request',
      },
    },
    {
      sequelize,
      tableName: 'support_ticket',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'support_ticket_id',
          fields: [{ name: 'id' }],
        },
        {
          name: 'support_ticket_user_id',
          fields: [{ name: 'user_id' }],
        },
        {
          name: 'support_ticket_admin_id',
          fields: [{ name: 'admin_id' }],
        },
        {
          name: 'support_ticket_category_id',
          fields: [{ name: 'support_category_id' }],
        },
      ],
    }
  );
};
