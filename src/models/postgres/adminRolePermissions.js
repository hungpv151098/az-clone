const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminRolePermissions',
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: 'admin_role_permissions_role_id_permission_id_unique',
        field: 'role_id',
      },
      permissionId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        unique: 'admin_role_permissions_role_id_permission_id_unique',
        field: 'permission_id',
      },
    },
    {
      sequelize,
      tableName: 'admin_role_permissions',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_role_permissions_role_id_permission_id_unique',
          unique: true,
          fields: [{ name: 'role_id' }, { name: 'permission_id' }],
        },
      ],
    }
  );
};
