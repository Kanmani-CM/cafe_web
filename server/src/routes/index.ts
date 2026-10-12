import { Router } from 'express';
import authRoutes from './authRoutes';
import menuRoutes from './menuRoutes';
import reservationRoutes from './reservationRoutes';
import contactRoutes from './contactRoutes';
import statsRoutes from './statsRoutes';

const router = Router();

router.use('/auth', authRoutes);
router.use('/menu', menuRoutes);
router.use('/reservations', reservationRoutes);
router.use('/contact', contactRoutes);
router.use('/admin/stats', statsRoutes);

// Health check endpoint
router.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', timestamp: new Date().toISOString() });
});

export default router;
