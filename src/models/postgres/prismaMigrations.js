const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'prismaMigrations',
    {
      id: {
        type: DataTypes.STRING(36),
        allowNull: false,
        primaryKey: true,
      },
      checksum: {
        type: DataTypes.STRING(64),
        allowNull: false,
      },
      finishedAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'finished_at',
      },
      migrationName: {
        type: DataTypes.STRING(255),
        allowNull: false,
        field: 'migration_name',
      },
      logs: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      rolledBackAt: {
        type: DataTypes.DATE,
        allowNull: true,
        field: 'rolled_back_at',
      },
      startedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.fn('now'),
        field: 'started_at',
      },
      appliedStepsCount: {
        type: DataTypes.INTEGER,
        allowNull: false,
        defaultValue: 0,
        field: 'applied_steps_count',
      },
    },
    {
      sequelize,
      tableName: '_prisma_migrations',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: '_prisma_migrations_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
