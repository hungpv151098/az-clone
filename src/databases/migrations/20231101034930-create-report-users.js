'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('report_users', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      userId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'user_id',
        onDelete: 'CASCADE',
      },
      reportId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        references: { model: 'users', key: 'id' },
        field: 'report_id',
        onDelete: 'CASCADE',
      },
      reason: {
        type: Sequelize.DataTypes.STRING(255),
        allowNull: false,
        field: 'reason',
      },
      explaination: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'explaination',
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
    await queryInterface.addIndex('report_users', ['user_id']);
    await queryInterface.addIndex('report_users', ['report_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('report_users', { cascade: true });

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
