import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Sistema } from '../models/Sistema';
import { UsuarioSistema } from '../models/UsuarioSistema';
import bcrypt from 'bcryptjs';

async function createTestUser() {
  try {
    await AppDataSource.initialize();
    
    const userRepository = AppDataSource.getRepository(User);
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const usuarioSistemaRepository = AppDataSource.getRepository(UsuarioSistema);
    
    const hashedPassword = await bcrypt.hash('senha123', 10);
    
    // Cria o usuário
    const testUser = {
      nome_completo: 'Usuário Tester',
      email: 'teste@exampdle.com',
      senha: hashedPassword,
      empresa: 'Empresa Teste',
      telefone: '(11) 99989-9999',
      setor: 'TI',
      cargo: 'Desenvolvedor',
      data_nascimento: new Date('1990-01-01'),
      sistemas: [
        { sistema_id: 1, perfil: 'admin' } // Assumindo que existe um sistema com ID 1
      ]
    };
    
    const user = userRepository.create(testUser);
    await userRepository.save(user);
    
    // Associa os sistemas
    for (const sistemaPerfil of testUser.sistemas) {
      const sistema = await sistemaRepository.findOneBy({ id: sistemaPerfil.sistema_id });
      if (sistema) {
        const usuarioSistema = usuarioSistemaRepository.create({
          usuario: user,
          sistema,
          perfil: sistemaPerfil.perfil
        });
        await usuarioSistemaRepository.save(usuarioSistema);
      }
    }
    
    console.log('✅ Usuário teste criado com sucesso!');
    console.log(user);
  } catch (error) {
    console.error('❌ Erro ao criar usuário teste:', error);
  } finally {
    await AppDataSource.destroy();
  }
}

createTestUser();
