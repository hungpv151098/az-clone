'use strict';

/** @type {import('sequelize-cli').Migration} */
module.exports = {
  async up(queryInterface, Sequelize) {
    await queryInterface.createTable('medias', {
      id: {
        autoIncrement: true,
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      mediableId: {
        type: Sequelize.DataTypes.BIGINT,
        allowNull: false,
        field: 'mediable_id',
        onDelete: 'CASCADE',
      },
      mediableType: {
        type: Sequelize.DataTypes.STRING(10),
        allowNull: false,
        field: 'mediable_type',
      },
      type: {
        type: Sequelize.DataTypes.STRING(50),
        allowNull: false,
        field: 'type',
      },
      thumbUrl: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: true,
        field: 'thumb_url',
      },
      mediaUrl: {
        type: Sequelize.DataTypes.TEXT,
        allowNull: false,
        field: 'media_url',
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
    await queryInterface.addIndex('medias', ['mediable_id']);
    /**
     * Add altering commands here.
     *
     * Example:
     * await queryInterface.createTable('users', { id: Sequelize.INTEGER });
     */
  },

  async down(queryInterface, Sequelize) {
    await queryInterface.dropTable('medias', { cascade: true });

    /**
     * Add reverting commands here.
     *
     * Example:
     * await queryInterface.dropTable('users');
     */
  },
};
