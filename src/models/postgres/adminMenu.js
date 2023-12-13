const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminMenu',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      parentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'parent_id',
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      title: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      icon: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      uri: {
        type: DataTypes.STRING(50),
        allowNull: true,
      },
      show: {
        type: DataTypes.SMALLINT,
        allowNull: false,
        defaultValue: 1,
      },
      extension: {
        type: DataTypes.STRING(50),
        allowNull: false,
        defaultValue: '',
      },
    },
    {
      sequelize,
      tableName: 'admin_menu',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_menu_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
