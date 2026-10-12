import { Router } from 'express';
import {
  createContactMessage,
  getContactMessages,
  markMessageAsRead,
  deleteContactMessage,
} from '../controllers/contactController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { contactMessageSchema } from '../validators/contactValidator';
import { contactLimiter } from '../middleware/rateLimiter';

const router = Router();

// Public route
router.post('/', contactLimiter, validate(contactMessageSchema), createContactMessage);

// Protected Admin routes
router.get('/', requireAuth, requireAdmin, getContactMessages);
router.patch('/:id/read', requireAuth, requireAdmin, markMessageAsRead);
router.delete('/:id', requireAuth, requireAdmin, deleteContactMessage);

export default router;
