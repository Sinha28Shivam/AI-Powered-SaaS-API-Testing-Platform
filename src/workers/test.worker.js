import { Worker } from 'bullmq';
import Redis from 'ioredis';
import API from '../models/api.model.js';
import TestReport from '../models/testReport.model.js';
import { runApiTest } from '../services/tester.service.js';
import { analyzeTestResult } from '../services/ai.service.js';
import dotenv from 'dotenv';

dotenv.config();

const redisConnection = new Redis(process.env.REDIS_URL || 'redis://localhost:6379', {
    maxRetriesPerRequest: null
});

export const setupTestWorker = () => {
    // The Worker constantly checks 'testApiQueue' for new Jobs
    const worker = new Worker('testApiQueue', async (job) => {
        const { apiId, userId } = job.data;
        console.log(`[Worker] Picked up job! Testing API: ${apiId}`);

        try {
            // 1. Fetch the API definition
            const api = await API.findOne({ _id: apiId, userId });
            if (!api) throw new Error("API not found in database.");

            // 2. Run the actual HTTP test (Takes time)
            const testResult = await runApiTest(api);

            // 3. Let Gemini analyze the payload (Takes time)
            const aiInsights = await analyzeTestResult(api, testResult);

            // 4. Save to MongoDB
            await TestReport.create({
                apiId: api._id,
                userId,
                url: api.url,
                method: api.method,
                responseTime: testResult.responseTime,
                status: testResult.status,
                responseData: testResult.responseData,
                success: testResult.success,
                aiInsights
            });

            console.log(`[Worker] Successfully completed testing API!`);
            return { success: true };
        } catch (err) {
            console.error(`[Worker] Failed testing API: ${apiId}`, err);
            throw err; // Throws error back to BullMQ to handle retries if you ever want them!
        }
    }, { connection: redisConnection });

    worker.on('failed', (job, err) => {
        console.log(`[Worker] Job ${job.id} failed with error: ${err.message}`);
    });

    console.log('[Worker] Connected to Redis and strictly listening to testApiQueue...');
};
