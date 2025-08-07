import { config } from 'dotenv';
import { createClient } from 'redis';

config();

const redisClient = createClient({
    url: `redis://${process.env.REDIS_USERNAME}:${process.env.REDIS_PASSWORD}@${process.env.REDIS_HOST}:${process.env.REDIS_PORT}/0`,
})

redisClient.on('connect', ()=> {
    console.info('Redis connected!');
});

redisClient.on('error', (err)=> {
    console.error('Redis Client Error', err);
});

redisClient.connect().then();

export default redisClient;