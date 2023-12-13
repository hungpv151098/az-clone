const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminRoles',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.STRING(50),
        allowNull: false,
      },
      slug: {
        type: DataTypes.STRING(50),
        allowNull: false,
        unique: 'admin_roles_slug_unique',
      },
    },
    {
      sequelize,
      tableName: 'admin_roles',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_roles_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'admin_roles_slug_unique',
          unique: true,
          fields: [{ name: 'slug' }],
        },
      ],
    }
  );
};
