import express from 'express';
import { getHealthStatus, getSampleData } from '../controllers/apiController.js';

const router = express.Router();

// Route: GET /api/health
router.get('/health', getHealthStatus);

// Route: GET /api/data
router.get('/data', getSampleData);

export default router;
