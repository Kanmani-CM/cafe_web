import { Router } from 'express';
import { login, logout, getMe } from '../controllers/authController';
import { validate } from '../middleware/validate';
import { loginSchema } from '../validators/authValidator';
import { loginLimiter } from '../middleware/rateLimiter';

const router = Router();

router.post('/login', loginLimiter, validate(loginSchema), login);
router.post('/logout', logout);
router.get('/me', getMe);

export default router;
