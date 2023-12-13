'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('support_category', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      title: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      supportProductId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'support_product_id',
        references: { model: 'support_product', key: 'id' },
        onDelete: 'CASCADE',
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
    await queryInterface.addIndex('support_category', ['support_product_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('support_category', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
