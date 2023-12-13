const express = require('express');
const path = require('path');
const appCodes = require('./constants/appCodes');
const cookieParser = require('cookie-parser');
const logger = require('morgan');
const cors = require('cors');
const router = require('./app.router');
const config = require('./app.config');
const i18next = require('i18next');
const middleware = require('i18next-http-middleware');
const FileSystemBackend = require('i18next-fs-backend');
const { processAction } = require('./libs/processor');
const throwError = require('./libs/throwError');
const multer = require('multer');

i18next
  .use(middleware.LanguageDetector)
  .use(FileSystemBackend)
  .init({
    preload: ['en', 'vi'],
    ns: ['common'],
    fallbackLng: 'en',
    backend: {
      loadPath: __dirname + '/locales/{{lng}}/{{ns}}.json',
      addPath: __dirname + '/locales/{{lng}}/{{ns}}.missing.json',
    },
  });

const app = express();

app.use(middleware.handle(i18next, {}));
app.use(cors());
app.set('trust proxy', true);
app.use(logger('dev'));
app.use(express.json());
app.use(express.urlencoded({ extended: false, limit: '50mb' }));
app.use(cookieParser());

app.use(config.basePath, router);
app.use('/assets/', express.static(path.join(process.cwd(), 'public')));
app.all(
  '*',
  processAction(async () =>
    throwError({
      message: '404',
      code: appCodes.endPointNotFound,
      status: 404,
    })
  )
);
app.use((err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.error(err)
        return res.status(500).send({ error: err.message, code: appCodes.multerError })
    }
    console.error(err)
    return res.status(500).send({ error: 'Something failed!', code: appCodes.unknownError })
})

module.exports = app;
