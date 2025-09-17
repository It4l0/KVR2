import 'reflect-metadata';
import dotenv from 'dotenv';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

dotenv.config();

async function run() {
  try {
    if (!AppDataSource.isInitialized) {
      await AppDataSource.initialize();
    }

    const userRepo = AppDataSource.getRepository(User);
    const email = process.env.SEED_ADMIN_EMAIL || 'admin@example.com';
    const plain = process.env.SEED_ADMIN_PASSWORD || 'admin123';

    let user = await userRepo.findOne({ where: { email } });

    const hashed = bcrypt.hashSync(plain, 10);

    if (!user) {
      user = userRepo.create({
        nome_completo: 'Administrador',
        email,
        senha: hashed,
        empresa: 'Empresa X',
        telefone: '(00)0000-0000',
        setor: 'TI',
        cargo: 'Administrador',
        data_nascimento: new Date('1990-01-01'),
        status: true,
      });
      await userRepo.save(user);
      console.log(`✅ Admin criado: ${email}`);
    } else {
      user.senha = hashed;
      await userRepo.save(user);
      console.log(`✅ Admin atualizado: ${email}`);
    }
  } catch (err) {
    console.error('❌ Seed admin falhou:', err);
    process.exitCode = 1;
  } finally {
    if (AppDataSource.isInitialized) {
      await AppDataSource.destroy();
    }
  }
}

run();
