import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Sistema } from '../models/Sistema';

export async function addNomeToSistema() {
  try {
    await AppDataSource.initialize();
    
    // Primeiro adiciona a coluna permitindo nulos
    await AppDataSource.query(`ALTER TABLE "sistema" ADD COLUMN "nome" character varying`);
    
    // Depois atualiza os registros existentes
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const sistemas = await sistemaRepository.find();
    
    for (const sistema of sistemas) {
      sistema.nome = sistema.descricao;
      await sistemaRepository.save(sistema);
    }
    
    // Finalmente altera a coluna para NOT NULL
    await AppDataSource.query(`ALTER TABLE "sistema" ALTER COLUMN "nome" SET NOT NULL`);
    
    console.log('✅ Campo nome adicionado aos sistemas existentes');
  } catch (error) {
    console.error('❌ Erro ao atualizar sistemas:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

addNomeToSistema();
