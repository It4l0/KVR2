import { Router } from 'express';
import { 
  createUser, 
  getUsers,
  getUserById,
  updateUser,
  deleteUser,
  getCurrentUser
} from '../controllers/userController';

const router = Router();

router.post('/', createUser);
router.get('/', getUsers);
router.get('/me', getCurrentUser);
router.get('/:id', getUserById);
router.put('/:id', updateUser);
router.patch('/:id', updateUser);
router.delete('/:id', deleteUser);

export default router;
