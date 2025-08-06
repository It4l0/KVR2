import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Sistema } from '../models/Sistema';
import { User } from '../models/User';

async function createTestSistema() {
  try {
    await AppDataSource.initialize();
    
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const userRepository = AppDataSource.getRepository(User);
    
    // Busca o usuário teste (assumindo que já existe)
    const usuario = await userRepository.findOneBy({ email: 'teste@exampdle.com' });
    
    if (!usuario) {
      throw new Error('Usuário teste não encontrado');
    }
    
    const testSistema = {
      nome: 'Sistema de Teste',
      empresa: 'Empresa Teste',
      perfis: 'admin,user',
      descricao: 'Sistema para testes automatizados',
      url: 'http://sistema-teste.com',
      ativo: true,
      usuario: usuario
    };
    
    const sistema = sistemaRepository.create(testSistema);
    await sistemaRepository.save(sistema);
    
    console.log('✅ Sistema teste criado com sucesso!');
    console.log(sistema);
  } catch (error) {
    console.error('❌ Erro ao criar sistema teste:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

createTestSistema();
