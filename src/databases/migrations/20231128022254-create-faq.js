'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('faq', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      question: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'question',
      },
      answer: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'answer',
      },
      categoryId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: true,
        field: 'category_id',
        references: { model: 'faq_category', key: 'id' },
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
    await queryInterface.addIndex('faq', ['category_id']);
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('faq', { cascade: true });
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
