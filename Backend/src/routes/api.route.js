import express from 'express';
import { addApi, getApis, testApiEndpoint, getApiReports, getApiDocs, deleteApi } from '../controllers/api.controller.js';
import { getApiAnalytics } from '../controllers/analytics.controller.js';
import { protect } from '../middlewares/auth.middleare.js';

const router = express.Router();

router.post('/add', protect, addApi);
router.get('/', protect, getApis);
router.post('/:id/test', protect, testApiEndpoint);
router.get('/:id/reports', protect, getApiReports);
router.get('/:id/docs', protect, getApiDocs);
router.get('/:id/analytics', protect, getApiAnalytics);
router.delete('/:id', protect, deleteApi);


export default router;