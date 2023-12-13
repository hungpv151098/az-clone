const dotenv = require('dotenv');
const dayjs = require('dayjs');
const utc = require('dayjs/plugin/utc');
const path = require('path');
const isBetween = require('dayjs/plugin/isBetween');
const customParseFormat = require('dayjs/plugin/customParseFormat');
dotenv.config();
dayjs.extend(isBetween);
dayjs.extend(utc);
dayjs.extend(customParseFormat);

const environments = {
  prod: 'prod',
  staging: 'staging',
  dev: 'dev',
};

const getDotEnvConfig = nodeEnv => {
  if (nodeEnv === environments.prod)
    return {
      path: path.resolve(process.cwd(), '.env.prod'),
      env: environments.prod,
    };

  if (nodeEnv === environments.staging)
    return {
      path: path.resolve(process.cwd(), '.env.staging'),
      env: environments.staging,
    };

  if (nodeEnv === environments.dev)
    return {
      path: path.resolve(process.cwd(), '.env.dev'),
      env: environments.dev,
    };

  return {
    path: path.resolve(process.cwd(), '.env'),
    env: environments.dev,
  };
};

const { path: nodeEnvPath, env } = getDotEnvConfig(process.env.NODE_ENV);

dotenv.config({
  path: nodeEnvPath,
});

const config = {
  path: nodeEnvPath,
  env: env,
  host: process.env.APP_HOST,
  feHost: process.env.FE_HOST,
  port: process.env.PORT || 3000,
  defaultLang: 'en',
  postgreSql: {
    host: process.env.DB_HOST,
    database: process.env.DB_DATABASE,
    username: process.env.DB_USERNAME,
    user: process.env.DB_USERNAME,
    password: process.env.DB_PASSWORD,
    port: +process.env.DB_PORT,
    dialect: 'postgres',
    pool: {
      max: 100,
      min: 0,
      acquire: 60000,
      idle: 10000,
    },
  },
};

config.basePath = process.env.BASE_PATH || '/';

config.redis = process.env.REDIS_QUEUE;

config.multer = {
  storage: process.env.MULTER_STORAGE,
  storageImage: process.env.MULTER_STORAGE_IMAGE,
  storageS3: process.env.MULTER_STORATE_S3,
};

config.aws = {
  secretAccessKey: process.env.AWS_SECRET_ACCESS_KEY,
  accessKeyId: process.env.AWS_ACCESS_KEY_ID,
  region: process.env.AWS_REGION,
  bucket: process.env.AWS_BUCKET,
  cloudFront: process.env.AWS_CLOUDFRONT,
};

config.fcm = {
  sender_name: process.env.FCM_SENDER_NAME,
};

config.resize = {
  width: process.env.MAX_WIDTH || 800,
  height: process.env.MAX_HEIGHT || 1440,
};

config.maxFileSize = process.env.MAX_FILE_UPLOAD || 100;
config.maxSizeImgForSupport = process.env.MAX_FILE_UPLOAD_FOR_SUPPORT * 1024 * 1024 || 3;

config.maxCrop = process.env.MAX_CROP || 800;

config.mainAPI = process.env.MAIN_API;

config.post = {
  limitCreatePost: process.env.LIMIT_CREATE_POST,
  limitCreatePostTime: process.env.LIMIT_CREATE_POST_TIME,
};

config.adminWebView = process.env.ADMIN_WEB_VIEW;

config.cmcAPI = process.env.CMC_API;

config.setting = {
  basicFeeCost: process.env.BASIC_FEE_COST || 0.1,
  imageCost: process.env.IMAGE_COST || 0.5,
  videoCost: process.env.VIDEO_COST || 2,
  shareWallCost: process.env.SHARE_WALL_COST || 0.1,
};

config.azNewsAPI = process.env.API_AZ_NEWS;

module.exports = config;
