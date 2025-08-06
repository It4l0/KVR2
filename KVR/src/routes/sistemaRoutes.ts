import { Router } from 'express';
import { 
  createSistema, 
  getSistemas,
  getSistemaById,
  updateSistema,
  deleteSistema
} from '../controllers/sistemaController';

const router = Router();

router.post('/', createSistema);
router.get('/', getSistemas);
router.get('/:id', getSistemaById);
router.put('/:id', updateSistema);
router.patch('/:id', updateSistema);
router.delete('/:id', deleteSistema);

export default router;
