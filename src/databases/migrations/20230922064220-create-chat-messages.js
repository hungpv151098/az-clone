'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('chat_messages', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      senderUserId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'sender_user_id',
      },
      receiverUserId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'receiver_user_id',
      },
      content: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: 'content',
      },
      status: {
        type: Sequelize.DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 2,
        field: 'status',
      },
      createdAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'created_at',
      },
      updatedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'updated_at',
      },
    });
    await queryInterface.addIndex('chat_messages', ['sender_user_id']);
    await queryInterface.addIndex('chat_messages', ['receiver_user_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('chat_messages', { cascade: true });

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
