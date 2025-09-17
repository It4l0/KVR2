import express, { Application } from 'express';
import cors from 'cors';
import { connectDB, AppDataSource } from './config/database';
import userRoutes from './routes/userRoutes';
import sistemaRoutes from './routes/sistemaRoutes';
import authRoutes from './routes/authRoutes';
import backupRoutes from './routes/backupRoutes';
import { authenticateJWT } from './middlewares/authMiddleware';
import equipmentRoutes from './routes/equipmentRoutes';

export const createApp = async (): Promise<Application> => {
  await connectDB();
  
  const app: Application = express();
  
  app.use(cors());
  app.use(express.json());
  
  // Rotas públicas
  app.use('/api/auth', authRoutes);
  
  // Rotas protegidas
  app.use('/api/users', authenticateJWT, userRoutes);
  app.use('/api/sistemas', authenticateJWT, sistemaRoutes);
  app.use('/api/backup', authenticateJWT, backupRoutes);
  app.use('/api/equipamentos', authenticateJWT, equipmentRoutes);
  
  app.get('/', (req, res) => {
    res.json({ message: 'API funcionando!' });
  });
  
  return app;
};

export default createApp;
