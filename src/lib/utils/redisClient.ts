const Redis = require("ioredis");

const {
  REDIS_URL,
  REDIS_PORT,
  REDIS_PASSWORD
} = process.env;

const client = new Redis(`rediss://:${REDIS_PASSWORD}@${REDIS_URL}:${REDIS_PORT}`);

client.on('error', (err) => { console.log('redis:: ' + err); });

export default client;
