'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_ticket', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        references: { model: 'users', key: 'id' },
        field: 'user_id',
        onDelete: 'CASCADE',
      },
      fullName: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: 'full_name',
      },
      email: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
      },
      title: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      desc: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      adminId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        references: { model: 'admin_users', key: 'id' },
        field: 'admin_id',
        onDelete: 'CASCADE',
      },
      note: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      typeUserRequest: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'type_user_request',
      },
      supportCategoryId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'support_category_id',
        references: { model: 'support_category', key: 'id' },
      },
      priority: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
      },
      statusRequest: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'status_request',
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
      updatedBy: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'updated_by',
      },
      deletedAt: {
        type: Sequelize.DataTypes.DATE,
        allowNull: true,
        field: 'deleted_at',
      },
    });
    await queryInterface.addIndex('support_ticket', ['support_category_id']);
    await queryInterface.addIndex('support_ticket', ['admin_id']);
    await queryInterface.addIndex('support_ticket', ['user_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('support_ticket', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
