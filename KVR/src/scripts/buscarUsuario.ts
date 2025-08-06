import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import readline from 'readline';

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

async function questionAsync(prompt: string): Promise<string> {
  return new Promise(resolve => {
    rl.question(prompt, resolve);
  });
}

async function buscarUsuario() {
  try {
    await AppDataSource.initialize();
    
    console.log('=== BUSCA DE USUÁRIO ===');
    
    const opcao = await questionAsync('Buscar por:\n1. ID\n2. Email\nEscolha: ');
    
    const userRepository = AppDataSource.getRepository(User);
    let user;
    
    if (opcao === '1') {
      const id = await questionAsync('ID do usuário: ');
      user = await userRepository.findOne({
        where: { id: parseInt(id) },
        relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
      });
    } else if (opcao === '2') {
      const email = await questionAsync('Email do usuário: ');
      user = await userRepository.findOne({
        where: { email },
        relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
      });
    } else {
      console.log('❌ Opção inválida');
      return;
    }
    
    if (user) {
      console.log('\n✅ Usuário encontrado:');
      console.log(`ID: ${user.id}`);
      console.log(`Nome: ${user.nome_completo}`);
      console.log(`Email: ${user.email}`);
      console.log(`Empresa: ${user.empresa}`);
      
      if (user.usuarioSistemas?.length) {
        console.log('\nSistemas vinculados:');
        user.usuarioSistemas.forEach(us => {
          console.log(`- ${us.sistema.nome}: ${us.perfil}`);
        });
      } else {
        console.log('\n⚠️ Nenhum sistema vinculado');
      }
    } else {
      console.log('❌ Usuário não encontrado');
    }
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Erro ao buscar usuário:', error.message);
    } else {
      console.error('❌ Erro desconhecido ao buscar usuário');
    }
  } finally {
    rl.close();
    await AppDataSource.destroy();
  }
}

buscarUsuario();
