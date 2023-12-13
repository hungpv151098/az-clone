const dotenv = require('dotenv');
dotenv.config();
const { sleep } = require('./utils/utils');
const { updateToken } = require('./services/updateToken.service');

const run = async () => {
  while (true) {
    try {
      await updateToken();
    } catch (error) {
      console.error(error);
    }
    await sleep(process.env.UPDATE_TOKEN_TIME);
  }
};

run();
