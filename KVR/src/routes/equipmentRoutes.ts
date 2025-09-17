import { Router } from 'express';
import { listEquipments, createEquipment, assignEquipmentUser, updateEquipment, deleteEquipment } from '../controllers/equipmentController';

const router = Router();

router.get('/', listEquipments);
router.post('/', createEquipment);
router.patch('/:id/assign', assignEquipmentUser);
router.put('/:id', updateEquipment);
router.delete('/:id', deleteEquipment);

export default router;
