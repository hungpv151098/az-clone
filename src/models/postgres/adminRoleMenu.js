const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminRoleMenu',
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'role_id',
      },
      menuId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'menu_id',
      },
    },
    {
      sequelize,
      tableName: 'admin_role_menu',
      schema: 'public',
      timestamps: true,
      underscored: true,
    }
  );
};
