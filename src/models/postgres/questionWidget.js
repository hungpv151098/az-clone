const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'questionWidget',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      name: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      type: {
        type: DataTypes.TEXT,
        allowNull: true,
        field: 'type_widget',
      },
      validate: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
      dataOptions: {
        type: DataTypes.TEXT,
        allowNull: true,
      },
    },
    {
      sequelize,
      tableName: 'question_widget',
      schema: 'public',
      timestamps: true,
      underscored: true,
      indexes: [
        {
          name: 'question_id',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
