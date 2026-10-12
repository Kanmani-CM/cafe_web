import { Router } from 'express';
import {
  getMenuItems,
  getMenuItemById,
  createMenuItem,
  updateMenuItem,
  deleteMenuItem,
} from '../controllers/menuController';
import { requireAuth, requireAdmin } from '../middleware/auth';
import { validate } from '../middleware/validate';
import { menuItemSchema, updateMenuItemSchema } from '../validators/menuValidator';

const router = Router();

// Public routes
router.get('/', getMenuItems);
router.get('/:id', getMenuItemById);

// Protected Admin routes
router.post('/', requireAuth, requireAdmin, validate(menuItemSchema), createMenuItem);
router.put('/:id', requireAuth, requireAdmin, validate(updateMenuItemSchema), updateMenuItem);
router.delete('/:id', requireAuth, requireAdmin, deleteMenuItem);

export default router;
