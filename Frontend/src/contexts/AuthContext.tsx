import React, { createContext, useContext, useState, ReactNode } from 'react';
import axios from 'axios';

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
}

interface AuthContextType {
  user: User | null;
  login: (email: string, senha: string) => Promise<boolean>;
  logout: () => void;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);

  // Safely decode Base64URL (JWT) strings to UTF-8
  const safeBase64UrlDecode = (input: string): string => {
    try {
      // Convert base64url to base64
      let base64 = input.replace(/-/g, '+').replace(/_/g, '/');
      // Pad string to length multiple of 4
      const pad = base64.length % 4;
      if (pad) {
        base64 += '='.repeat(4 - pad);
      }
      // Decode and handle UTF-8
      const binary = atob(base64);
      // Convert binary string to UTF-8 string
      const bytes = Uint8Array.from(binary, (c) => c.charCodeAt(0));
      const decoded = new TextDecoder('utf-8').decode(bytes);
      return decoded;
    } catch (_) {
      return '';
    }
  };

  const login = async (email: string, senha: string): Promise<boolean> => {
    try {
      // Use relative path to hit Nginx proxy (/api -> backend:3000) in Docker
      const response = await axios.post('/api/auth/login', {
        email,
        senha
      });
      
      const token = response.data.token;
      if (typeof token !== 'string') {
        throw new Error('Token inválido recebido do servidor');
      }
      localStorage.setItem('token', token);

      // Decodificar token para obter dados do usuário
      const parts = token.split('.');
      if (parts.length !== 3) {
        throw new Error('Estrutura de JWT inválida');
      }
      const payloadStr = safeBase64UrlDecode(parts[1]);
      if (!payloadStr) {
        throw new Error('Falha ao decodificar payload do token');
      }
      const decoded = JSON.parse(payloadStr);

      setUser({
        id: decoded.id,
        name: 'Nome do Usuário', // Pode ser obtido de outra chamada API
        email: decoded.email,
        role: 'User'
      });
      
      return true;
    } catch (error) {
      console.error('Erro no login:', error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('token');
  };

  // Check if user is stored in localStorage on component mount
  React.useEffect(() => {
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      try {
        const parts = storedToken.split('.');
        if (parts.length !== 3) {
          throw new Error('Estrutura de JWT inválida');
        }
        const payloadStr = safeBase64UrlDecode(parts[1]);
        if (!payloadStr) {
          throw new Error('Falha ao decodificar payload do token');
        }
        const decoded = JSON.parse(payloadStr);
        setUser({
          id: decoded.id,
          name: 'Nome do Usuário', // Pode ser obtido de outra chamada API
          email: decoded.email,
          role: 'User'
        });
      } catch (e) {
        console.warn('Token inválido no localStorage. Removendo...', e);
        localStorage.removeItem('token');
        setUser(null);
      }
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        isAuthenticated: !!user,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};