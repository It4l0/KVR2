import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Sistema } from '../models/Sistema';


async function createTables() {
  try {
    await AppDataSource.initialize();
    
    // Sincroniza todas as entidades com o banco de dados
    await AppDataSource.synchronize();
    
    console.log('✅ Tabelas criadas com sucesso!');
    
    // Lista as tabelas criadas
    const tables = await AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
    
    console.log('Tabelas disponíveis:', tables.map((t: any) => t.table_name));
  } catch (error) {
    console.error('❌ Erro ao criar tabelas:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

createTables();
