const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminRoleUsers',
    {
      roleId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'role_id',
      },
      userId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        field: 'user_id',
      },
    },
    {
      sequelize,
      tableName: 'admin_role_users',
      schema: 'public',
      timestamps: true,
      underscored: true,
    }
  );
};
