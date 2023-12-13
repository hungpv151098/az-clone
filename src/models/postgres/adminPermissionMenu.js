const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminPermissionMenu',
    {
      permissionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'permission_id',
      },
      menuId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'menu_id',
      },
    },
    {
      sequelize,
      tableName: 'admin_permission_menu',
      schema: 'public',
      timestamps: true,
      underscored: true,
    }
  );
};
