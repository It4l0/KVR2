import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';

export const login = async (req: Request, res: Response) => {
  try {
    const { email, senha } = req.body;
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ email });
    
    if (!user || !bcrypt.compareSync(senha, user.senha)) {
      return res.status(401).json({ message: 'Credenciais inválidas' });
    }
    
    const token = jwt.sign(
      { id: Number(user.id), email: user.email },
      process.env.JWT_SECRET || 'secret_default',
      { expiresIn: '1h' }
    );
    
    res.json({ token });
  } catch (error) {
    res.status(500).json({ message: 'Erro no login' });
  }
};

export const logout = (req: Request, res: Response) => {
  // Implementar lógica de logout/invalidação de token se necessário
  res.json({ message: 'Logout realizado com sucesso' });
};

export const validateToken = (req: Request, res: Response) => {
  // Middleware já validou o token
  res.json({ valid: true });
};
