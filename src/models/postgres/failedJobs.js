const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'failedJobs',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      uuid: {
        type: DataTypes.STRING(255),
        allowNull: false,
        unique: 'failed_jobs_uuid_unique',
      },
      connection: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      queue: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      payload: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      exception: {
        type: DataTypes.TEXT,
        allowNull: false,
      },
      failedAt: {
        type: DataTypes.DATE,
        allowNull: false,
        defaultValue: Sequelize.Sequelize.literal('CURRENT_TIMESTAMP'),
        field: 'failed_at',
      },
    },
    {
      sequelize,
      tableName: 'failed_jobs',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'failed_jobs_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
        {
          name: 'failed_jobs_uuid_unique',
          unique: true,
          fields: [{ name: 'uuid' }],
        },
      ],
    }
  );
};
