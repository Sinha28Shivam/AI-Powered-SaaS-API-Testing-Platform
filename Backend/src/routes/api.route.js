import express from 'express';
import { validate } from '../middlewares/validate.middleware.js';
import { addApiSchema } from '../utils/validators.js';
import { addApi, getApis, testApiEndpoint, getApiReports, getApiDocs, deleteApi } from '../controllers/api.controller.js';
import { getApiAnalytics } from '../controllers/analytics.controller.js';
import { protect } from '../middlewares/auth.middleare.js';
import rateLimit from 'express-rate-limit';

const apiLimiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: { success: false, message: "Too many requests, please try again after 15 minutes." }
});

const testLimiter = rateLimit({
    windowMs: 1 * 60 * 1000,
    max: 10,
    message: { success: false, message: "Test queue heavily utilized. Limit to 10 tests per minute." }
});

const router = express.Router();
router.use(apiLimiter);

router.post('/add', protect, validate(addApiSchema), addApi);
router.get('/', protect, getApis);
router.post('/:id/test', protect, testLimiter, testApiEndpoint);
router.get('/:id/reports', protect, getApiReports);
router.get('/:id/docs', protect, getApiDocs);
router.get('/:id/analytics', protect, getApiAnalytics);
router.delete('/:id', protect, deleteApi);

export default router;