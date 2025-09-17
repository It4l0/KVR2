import { Router } from 'express';
import { exportBackup } from '../controllers/backupController';

const router = Router();

router.get('/export', exportBackup);

export default router;
