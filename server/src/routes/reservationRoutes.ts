import { Router } from 'express';
import {
  createReservation,
  getAvailableSlots,
  getReservations,
  getReservationById,
  updateReservationStatus,
  deleteReservation,
  getTables,
} from '../controllers/reservationController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import {
  createReservationSchema,
  updateReservationStatusSchema,
} from '../validators/reservationValidator';
import { reservationLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public routes
router.post('/', reservationLimiter, validate(createReservationSchema), createReservation);
router.get('/available-slots', getAvailableSlots);

// Protected Admin routes
router.get('/', requireAuth, requireAdmin, getReservations);
router.get('/tables', requireAuth, requireAdmin, getTables);
router.get('/:id', requireAuth, requireAdmin, getReservationById);
router.patch(
  '/:id/status',
  requireAuth,
  requireAdmin,
  validate(updateReservationStatusSchema),
  updateReservationStatus
);
router.delete('/:id', requireAuth, requireAdmin, deleteReservation);

export default router;
