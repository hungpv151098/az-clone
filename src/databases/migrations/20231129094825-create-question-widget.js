'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('question_widget', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: 'type_widget',
      },
      validate: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        // get: () => {
        //   return JSON.parse(this.getDataValue('validate'));
        // },
        // set: val => {
        //   return this.setDataValue('validate', JSON.stringify(val));
        // },
      },
      dataOptions: {
        type: Sequelize.DataTypes.STRING,
        allowNull: true,
        field: 'data_options',
        // get: () => {
        //   return JSON.parse(this.getDataValue('dataOptions'));
        // },
        // set: val => {
        //   return this.setDataValue('dataOptions', JSON.stringify(val));
        // },
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
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('question_widget');
    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
