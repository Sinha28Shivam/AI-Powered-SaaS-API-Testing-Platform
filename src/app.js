import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import connectDB from './config/db.js';

import authRoutes from './routes/auth.route.js';
import apiRoutes from './routes/api.route.js';


import { logger } from './middlewares/loggerMiddleware.js';
import { errorHandler } from './middlewares/errorMiddleware.js';


dotenv.config();
const app = express();

app.use(express.json());
app.use(cors());

app.use(logger);

// Database connection
connectDB();

// Routes
app.get('/', (req, res) => {
    res.send('Welcome to the AI-powered SaaS API');
});

app.use('/api/auth', authRoutes);
app.use('/api/apis', apiRoutes);

app.use(errorHandler);
export default app;