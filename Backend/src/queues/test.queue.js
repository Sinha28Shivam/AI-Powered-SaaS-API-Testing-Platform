import { Queue } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// connect to docker redis
const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

// create the inbox queue
export const testQueue = new Queue('testApiQueue', {
    connection: redisConnection
});

// Helper function to easily  add jobs to the inbox
export const enqueueTest = async (apiId, userId) => {
    const job = await testQueue.add('testJob', {
        apiId,
        userId
    });
    return job;
};  