import { Router, RequestHandler } from 'express';
import { 
  createUser, 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser,
  resetPassword
} from '../controllers/userController';

const router = Router();

router.post('/', createUser as unknown as RequestHandler);
router.get('/', getUsers as unknown as RequestHandler);
router.get('/me', getCurrentUser as unknown as RequestHandler);
router.get('/:id', getUserById as unknown as RequestHandler);
router.put('/:id', updateUser as unknown as RequestHandler);
router.patch('/:id', updateUser as unknown as RequestHandler);
router.post('/:id/reset-password', resetPassword as unknown as RequestHandler);
router.delete('/:id', deleteUser as unknown as RequestHandler);

export default router;
