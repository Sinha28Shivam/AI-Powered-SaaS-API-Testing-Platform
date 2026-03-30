import express from 'express';
import { addApi, getApis } from '../controllers/api.controller.js';
import { protect } from '../middlewares/auth.middleare.js';

const router = express.Router();

router.post('/add', protect, addApi);
router.get('/', protect, getApis);

export default router;