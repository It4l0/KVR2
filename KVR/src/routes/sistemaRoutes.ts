import { Router, RequestHandler } from 'express';
import { 
  createSistema, 
  getSistemas,
  getSistemaById,
  updateSistema,
  deleteSistema
} from '../controllers/sistemaController';

const router = Router();

router.post('/', createSistema as unknown as RequestHandler);
router.get('/', getSistemas as unknown as RequestHandler);
router.get('/:id', getSistemaById as unknown as RequestHandler);
router.put('/:id', updateSistema as unknown as RequestHandler);
router.patch('/:id', updateSistema as unknown as RequestHandler);
router.delete('/:id', deleteSistema as unknown as RequestHandler);

export default router;
