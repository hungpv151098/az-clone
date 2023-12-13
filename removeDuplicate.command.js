const dotEnv = require('dotenv');
const path = require('path');
const { Sequelize } = require('sequelize');

dotEnv.config({});

const config = {
  local: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    dialect: 'postgres',
    define: {
      timestamps: true,
    },
  },
  development: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
    },
  },
  production: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    dialect: 'postgres',
    dialectOptions: {
      decimalNumbers: true,
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    },
    define: {
      timestamps: true,
    },
  },
};

const sequelize = new Sequelize(config.production);

const main = async () => {
  Promise.all([
    await sequelize.query(
      'DELETE FROM likes n1 USING likes n2 WHERE n1.user_id = n2.user_id AND n1.likeable_id = n2.likeable_id AND n1.likeable_type = n2.likeable_type AND n1.id > n2.id',
      { type: Sequelize.QueryTypes.DELETE }
    ),
    await sequelize.query(
      'DELETE FROM shares n1 USING shares n2 WHERE n1.user_id = n2.user_id AND n1.post_id = n2.post_id AND n1.id > n2.id',
      { type: Sequelize.QueryTypes.DELETE }
    ),
    await sequelize.query(
      'DELETE FROM followers n1 USING followers n2 WHERE n1.follower_id = n2.follower_id AND n1.following_id = n2.following_id AND n1.id > n2.id',
      { type: Sequelize.QueryTypes.DELETE }
    ),
  ]);
  return;
};
main();
