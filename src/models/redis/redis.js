const { createClient } = require('redis');
const config = require('../../app.config');

const redis = createClient(config.redis);
redis.on('error', err => console.log('Redis Client Error', err));

exports.connectRedis = async () => {
  await redis.connect();
  console.log('Redis connected');
};

exports.redisGet = async key => redis.get(key);

exports.redisSet = async (key, value) => redis.set(key, value);

exports.redisDel = async key => redis.del(key);

exports.redisDelByPattern = async key => {
  const keys = await redis.keys(key);

  await Promise.all(keys.map(async k => redis.del(k)));
};

exports.redis = redis;
