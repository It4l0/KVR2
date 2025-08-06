import { Router } from 'express';
import { login, logout, validateToken } from '../controllers/authController';

const router = Router();

router.post('/login', login);
router.post('/logout', logout);
router.get('/validate', validateToken);

export default router;
