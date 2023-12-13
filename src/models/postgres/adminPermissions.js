const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'adminPermissions',
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
        unique: 'admin_permissions_slug_unique',
      },
      httpMethod: {
        type: DataTypes.STRING(255),
        allowNull: true,
        field: 'http_method',
      },
      httpPath: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'http_path',
      },
      order: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
      },
      parentId: {
        type: DataTypes.BIGINT,
        allowNull: false,
        defaultValue: 0,
        field: 'parent_id',
      },
    },
    {
      sequelize,
      tableName: 'admin_permissions',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'admin_permissions_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'admin_permissions_slug_unique',
          unique: true,
          fields: [{ name: 'slug' }],
        },
      ],
    }
  );
};
