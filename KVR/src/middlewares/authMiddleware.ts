import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';

declare module 'express' {
  interface Request {
    user?: {
      id: string;
      email: string;
    };
  }
}

export const authenticateJWT = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const token = req.headers.authorization?.split(' ')[1];
    
    if (!token) {
      return res.status(401).json({ message: 'Token não fornecido' });
    }

    // Use the same fallback used when signing tokens in authController
    const secret = process.env.JWT_SECRET || 'secret_default';
    const decoded = jwt.verify(token, secret) as { id: string, email: string };
    
    req.user = {
      id: decoded.id,
      email: decoded.email
    };

    next();
  } catch (error) {
    return res.status(401).json({ message: 'Token inválido' });
  }
};
