import express from 'express';
import { addApi, getApis, testApiEndpoint, getApiReports } from '../controllers/api.controller.js';
import { protect } from '../middlewares/auth.middleare.js';

const router = express.Router();

router.post('/add', protect, addApi);
router.get('/', protect, getApis);
router.post('/:id/test', protect, testApiEndpoint);
router.get('/:id/reports', protect, getApiReports);

export default router;