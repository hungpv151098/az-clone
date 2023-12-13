const { config } = require('dotenv');

config({ path: `.env` });

const host = process.env.DB_HOST;
const username = process.env.DB_USERNAME;
const password = process.env.DB_PASSWORD;
const database = process.env.DB_DATABASE;
const port = process.env.DB_PORT;

module.exports = {
  local: {
    username,
    password,
    database,
    host,
    port,
    dialect: 'postgres',
    define: {
      timestamps: true,
    },
  },
  development: {
    username,
    password,
    database,
    host,
    port,
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
    username,
    password,
    database,
    host,
    port,
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
