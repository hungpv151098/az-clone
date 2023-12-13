const { Sequelize, Op } = require('sequelize');
const config = require('../../app.config');
const { initModels } = require('./init-models');
const { ENV } = require('../../constants/const');
require('pg').defaults.parseInt8 = true;
var types = require('pg').types;
types.setTypeParser(types.NUMERIC, value => parseFloat(value));

let sequelize = {};
if (config.env === ENV.PROD) {
  sequelize = new Sequelize(config.postgreSql.database, config.postgreSql.username, config.postgreSql.password, {
    ...config.postgreSql,
    dialectOptions: {
      decimalNumbers: true,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
  });
} else {
  sequelize = new Sequelize(config.postgreSql.database, config.postgreSql.username, config.postgreSql.password, {
    ...config.postgreSql,
    dialectOptions: { decimalNumbers: true },
  });
}

exports.postgresqlConnect = async () => {
  await sequelize.authenticate();
  console.log('DB connected');
};

exports.models = initModels(sequelize);

exports.sequelize = sequelize;
exports.Op = Op;
exports.Sequelize = Sequelize;
