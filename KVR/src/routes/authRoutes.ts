import { Router, RequestHandler } from 'express';
import { login, logout, validateToken } from '../controllers/authController';

const router = Router();

router.post('/login', login as unknown as RequestHandler);
router.post('/logout', logout as unknown as RequestHandler);
router.get('/validate', validateToken as unknown as RequestHandler);

export default router;
