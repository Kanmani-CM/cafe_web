import { Router } from 'express';
import { getDashboardStats } from '../controllers/statsController';
import { requireAuth, requireAdmin } from '../middleware/auth';

const router = Router();

router.get('/', requireAuth, requireAdmin, getDashboardStats);

export default router;
