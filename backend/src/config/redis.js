const { default: IORedis } = require('ioredis');

let redisClient = null;

const REDIS_OPTIONS = {
  maxRetriesPerRequest: null, // required by BullMQ
  enableOfflineQueue: false,  // fail fast instead of queuing commands
  lazyConnect: true,          // don't auto-connect on instantiation
  retryStrategy: (times) => {
    if (times > 3) return null; // stop retrying after 3 attempts
    return Math.min(times * 500, 2000);
  },
};

const getRedisClient = () => {
  if (redisClient) return redisClient;
  redisClient = new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', REDIS_OPTIONS);
  redisClient.on('connect', () => console.log('[Redis] Connected'));
  redisClient.on('error', (err) => console.warn('[Redis] Unavailable (certificates disabled):', err.message));
  return redisClient;
};

const getRedisConnection = () => {
  return new IORedis(process.env.REDIS_URL || 'redis://localhost:6379', REDIS_OPTIONS);
};

module.exports = { getRedisClient, getRedisConnection };
