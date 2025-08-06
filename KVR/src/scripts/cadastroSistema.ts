import 'reflect-metadata';
import { AppDataSource } from '../config/database';
import { Sistema } from '../models/Sistema';
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

async function cadastrarSistema() {
  try {
    await AppDataSource.initialize();
    
    console.log('=== CADASTRO DE SISTEMA ===');
    
    const nome = await questionAsync('Nome do sistema: ');
    const empresa = await questionAsync('Empresa: ');
    const perfis = await questionAsync('Perfis disponíveis (separados por vírgula): ');
    const descricao = await questionAsync('Descrição: ');
    const url = await questionAsync('URL: ');
    
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const sistema = sistemaRepository.create({
      nome,
      empresa,
      perfis,
      descricao,
      url,
      ativo: true
    });
    
    await sistemaRepository.save(sistema);
    
    console.log('\n✅ Sistema cadastrado com sucesso!');
    console.log(`ID: ${sistema.id}`);
    console.log(`Nome: ${sistema.nome}`);
    console.log(`Empresa: ${sistema.empresa}`);
    
  } catch (error: unknown) {
    if (error instanceof Error) {
      console.error('❌ Erro ao cadastrar sistema:', error.message);
    } else {
      console.error('❌ Erro desconhecido ao cadastrar sistema');
    }
  } finally {
    rl.close();
    await AppDataSource.destroy();
  }
}

cadastrarSistema();
