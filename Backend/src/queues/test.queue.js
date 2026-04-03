import { Queue } from "bullmq";
import Redis from "ioredis";
import dotenv from "dotenv";

dotenv.config();

// connect to docker redis
const redisUrl = process.env.REDIS_URL ? process.env.REDIS_URL.trim() : 'redis://localhost:6379';
const redisConnection = new Redis(redisUrl, {
    maxRetriesPerRequest: null,
    family: 4 // Force IPv4 resolution which fixes bugs in Alpine node images
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