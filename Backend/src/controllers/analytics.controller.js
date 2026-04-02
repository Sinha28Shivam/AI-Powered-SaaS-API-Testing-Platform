import { prisma } from '../prismaClient.js';
import API from '../models/api.model.js';

export const getApiAnalytics = async (req, res, next) => {
    try {
        const { id } = req.params;
        
        // 1. Verify User Authorization to view this API's data
        const api = await API.findOne({ _id: id, userId: req.user.id });
        if (!api) return res.status(404).json({ message: "API not found" });

        // 2. Fetch Time-Series Relational Data from PostgreSQL via Prisma
        const metrics = await prisma.apiMetric.findMany({
            where: { apiId: id },
            orderBy: { timestamp: 'desc' },
            take: 50 // Limit to last 50 transactions for performance
        });

        if (!metrics.length) return res.status(404).json({ message: "No analytics available yet. Run your first AI test!" });

        // 3. Mathematical Aggregations
        const totalCount = metrics.length;
        const successCount = metrics.filter(m => m.success).length;
        const successRate = (successCount / totalCount) * 100;
        
        const totalTime = metrics.reduce((acc, curr) => acc + curr.responseTime, 0);
        const averageResponseTime = Math.round(totalTime / totalCount);

        // 4. Return clean payload to generate UI Charts
        res.json({
            apiId: id,
            totalCount,
            successRate,
            averageResponseTime,
            history: metrics
        });
    } catch(err) {
        next(err);
    }
};
