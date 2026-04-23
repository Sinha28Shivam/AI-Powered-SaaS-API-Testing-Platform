import express from 'express';
import { signup, login } from '../controllers/auth.controller.js';
import rateLimit from 'express-rate-limit';

const authLimiter = rateLimit({
    windowMs: 15 * 60 * 1000, // 15 minutes
    max: 10, // Limit each IP to 10 login/signup requests per `window` (here, per 15 minutes)
    message: { success: false, message: "Too many authentication attempts from this IP, please try again after 15 minutes." }
});

const router = express.Router();

router.post('/signup', authLimiter, signup);
router.post('/login', authLimiter, login);

export default router;