const dotEnv = require('dotenv');
const SequelizeAuto = require('sequelize-auto');
const path = require('path');
const { Sequelize } = require('sequelize');

dotEnv.config({});

const config = {
  host: process.env.DB_HOST,
  database: process.env.DB_DATABASE,
  username: process.env.DB_USERNAME,
  password: process.env.DB_PASSWORD,
  port: +process.env.DB_PORT,
  dialect: 'postgres',
};

const main = async () => {
  const sequelize = new Sequelize(
    config.database,
    config.username,
    config.password,
    config
  );

  const options = {
    caseFile: 'c',
    caseModel: 'c',
    caseProp: 'c',
    directory: path.resolve(process.cwd(), 'src', 'models', 'postgres'),
    additional: {
      timestamps: true,
      underscored: true,
    },
  };

  const auto = new SequelizeAuto(sequelize, null, null, options);

  auto.run();
};

main();
