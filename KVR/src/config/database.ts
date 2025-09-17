import 'reflect-metadata';
import { DataSource } from 'typeorm';
import dotenv from 'dotenv';
import { User } from '../models/User';
import { Sistema } from '../models/Sistema';
import { UsuarioSistema } from '../models/UsuarioSistema';
import { Equipment } from '../models/Equipment';

dotenv.config();

export const AppDataSource = new DataSource({
  type: 'postgres',
  host: process.env.DB_HOST,
  port: parseInt(process.env.DB_PORT || '5432'),
  username: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  entities: [User, Sistema, UsuarioSistema, Equipment],
  // We will run structured migrations instead of synchronize in production
  synchronize: false,
  logging: false,
  migrations: [
    // Only load timestamped migrations (e.g., 1694960000000-Name.js),
    // excluding legacy ad-hoc scripts in this folder
    __dirname + '/../migrations/*-*.{js,ts}'
  ],
  // Automatically run pending migrations on initialize
  migrationsRun: true
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
