const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'chatMessages',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      senderUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'sender_user_id',
        onDelete: 'CASCADE',
      },
      receiverUserId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        references: {
          model: 'users',
          key: 'id',
        },
        field: 'receiver_user_id',
        onDelete: 'CASCADE',
      },
      content: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      status: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 2,
      },
    },
    {
      sequelize,
      tableName: 'chat_messages',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'chat_messages_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'chat_messages_receiver_user_id',
          fields: [{ name: 'receiver_user_id' }],
        },
        {
          name: 'chat_messages_sender_user_id',
          fields: [{ name: 'sender_user_id' }],
        },
      ],
    }
  );
};
