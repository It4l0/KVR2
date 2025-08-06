import 'reflect-metadata';
import { createApp } from './app';
import { connectDB } from './config/database';


const PORT = process.env.PORT || 3000;

async function startServer() {
  try {
    await connectDB();
    const app = await createApp();
    
    app.listen(PORT, () => {
      console.log(`Servidor rodando na porta ${PORT}`);
    });

    process.stdin.resume();
    
  } catch (error) {
    console.error('Falha ao iniciar o servidor:', error);
    process.exit(1);
  }
}

startServer();
