const winston = require('winston');
const fs = require('fs');
const path = require('path');

const basePath = path.join(process.cwd(), 'logs');

if (!fs.existsSync(basePath)) {
  fs.mkdirSync(basePath);
}

const getFile = file => path.join(process.cwd(), 'logs', file);

const createLogger = service => {
  return winston.createLogger({
    level: 'info',
    format: winston.format.combine(winston.format.timestamp(), winston.format.json()),
    defaultMeta: { service: service },
    transports: [
      new winston.transports.File({
        filename: getFile(`${service}.info.log`),
        level: 'info',
      }),
      new winston.transports.File({
        filename: getFile(`${service}.error.log`),
        level: 'error',
      }),
    ],
  });
};

const loggerServices = {
  saveExerciseResult: 'save-exercise-result',
};

exports.loggerServices = loggerServices;
exports.createLogger = createLogger;
