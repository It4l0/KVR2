import { connectDB, AppDataSource } from '../config/database';
import { User } from '../models/User';
import dotenv from 'dotenv';

dotenv.config();

async function testDatabaseConnection() {
  console.log('Variáveis de ambiente:');
  console.log(`DB_HOST: ${process.env.DB_HOST}`);
  console.log(`DB_PORT: ${process.env.DB_PORT}`);
  console.log(`DB_USER: ${process.env.DB_USER}`);
  console.log(`DB_NAME: ${process.env.DB_NAME}`);

  try {
    console.log('\nIniciando teste de conexão com o banco de dados...');
    
    // Conectar ao banco de dados
    console.log('Conectando ao PostgreSQL...');
    await connectDB();
    console.log('Conexão estabelecida com sucesso!');
    
    // Testar operação básica
    console.log('\nTestando operações no banco de dados...');
    const userRepository = AppDataSource.getRepository(User);
    
    // Criar um usuário teste
    console.log('Criando usuário teste...');
    const testUser = userRepository.create({
      nome_completo: 'Usuário Teste',
      email: 'teste@example.com',
      senha: 'senha123'
    });
    
    await userRepository.save(testUser);
    console.log('✅ Usuário teste criado com sucesso:', testUser);
    
    // Limpar o usuário teste
    console.log('\nRemovendo usuário teste...');
    await userRepository.delete(testUser.id);
    console.log('✅ Usuário teste removido com sucesso');
    
    console.log('\n🎉 Teste de conexão concluído com sucesso!');
  } catch (error) {
    console.error('❌ Erro no teste de conexão:');
    console.error(error);
  } finally {
    // Encerrar a conexão
    console.log('\nEncerrando conexão...');
    await AppDataSource.destroy();
    console.log('Conexão encerrada.');
    process.exit(0);
  }
}

testDatabaseConnection();
