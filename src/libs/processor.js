const { validationResult } = require('express-validator');
const throwError = require('../libs/throwError');
const validateFormat = require('../libs/validateFormat');
const config = require('../app.config');
const appCodes = require('../constants/appCodes');
const removeFiles = require('./removeFiles');
const { createLogger } = require('./winston');
const { sequelize } = require('../models/postgres');

const process = async (action, req, res, next, needSqlTransaction, afterCommit, customerLogger, validation = null) => {
  const logger = customerLogger ? createLogger(customerLogger) : null;
  try {
    if (validation) {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return throwError({
          message: 'Validation Error!',
          code: appCodes.validationErrors,
          status: 422,
          errors: validateFormat.formatMessage(errors.array(), req),
        });
      }
    }

    const data = await (needSqlTransaction
      ? sequelize.transaction(t => {
          t.afterCommit(async () => {
            if (!afterCommit) return;
            if (typeof afterCommit !== 'function') return;

            return afterCommit(req, res);
          });

          return action(req, res, t);
        })
      : action(req, res));

    if (next) return next();

    const resp = JSON.stringify({
      code: appCodes.ok,
      data: data || null,
    });

    return res.json(JSON.parse(resp));
  } catch (e) {
    const { code = appCodes.unknownError, status = 200, skipI18n } = e;
    console.error(e);
    if (logger)
      logger.error({
        message: e.message,
        request: { ...req.body, ...req.query },
        user: req.user.id,
      });

    let message = skipI18n ? e.message : req.t(e.message);
    if (code === appCodes.unknownError) {
      if (config.env !== 'dev') message = req.t('Error occurred');
    }
    if (req.files)
      setTimeout(async () => {
        const files = Object.values(req.files).reduce((files, file) => {
          if (!Array.isArray(file)) return files;

          return [...files, ...file.filter(Boolean)];
        }, []);
        if (files.length) await removeFiles(files);
      });

    const resp = JSON.stringify({
      code: code,
      data: e.data || null,
      message: message,
    });

    return res.status(status).json(JSON.parse(resp));
  }
};

exports.processAction = (action, needSqlTransaction, afterCommit, customerLogger, validation) => (req, res) =>
  process(action, req, res, null, needSqlTransaction, afterCommit, customerLogger, validation);

exports.processMiddleware = middleware => (req, res, next) => process(middleware, req, res, next);

exports.processActionValidate = action => action();
