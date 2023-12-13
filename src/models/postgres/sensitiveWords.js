const Sequelize = require('sequelize');
module.exports = function (sequelize, DataTypes) {
  return sequelize.define(
    'sensitiveWords',
    {
      id: {
        autoIncrement: true,
        type: DataTypes.BIGINT,
        allowNull: false,
        primaryKey: true,
      },
      word:{
        type:DataTypes.STRING(255),
        allowNull:false,
      },
      lang:{
        type:DataTypes.STRING(50),
        allowNull:false,
      }
    },
    {
      sequelize,
      tableName: 'sensitive_words',
      schema: 'public',
      timestamps: true,
      paranoid: true,
      underscored: true,
      indexes: [
        {
          name: 'sensitiveWords_pkey',
          unique: true,
          fields: [{ name: 'id' }],
        },
      ],
    }
  );
};
