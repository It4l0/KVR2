import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Sistema } from '../models/Sistema';
import { UsuarioSistema } from '../models/UsuarioSistema';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Sistema, UsuarioSistema],
  synchronize: false,
  logging: false
});

export const connectDB = async () => {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
      console.log('Conectado ao PostgreSQL');
    }
  } catch (error) {
    console.error('Erro ao conectar no PostgreSQL:', error);
    throw error;
  }
};
