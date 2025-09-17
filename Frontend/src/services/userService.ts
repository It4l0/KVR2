import { api } from './api';
import bcrypt from 'bcryptjs';

export const UserService = {
  async getUsers() {
    try {
      const response = await api.get('/users');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar usuários:', error);
      throw error;
    }
  },
  
  async createUser(userData: {
    name: string;
    email: string;
    password: string;
    empresa: string;
    telefone: string;
    setor: string;
    cargo: string;
    data_nascimento: string;
    sistemas: number[];
  }) {
    try {
      // Criptografa a senha antes de enviar
      const hashedPassword = await bcrypt.hash(userData.password, 10);

      // Mapeia os campos para o formato esperado pelo backend
      const payload = {
        nome_completo: userData.name,
        email: userData.email,
        senha: hashedPassword, // Usa a senha criptografada
        empresa: userData.empresa,
        telefone: userData.telefone,
        setor: userData.setor,
        cargo: userData.cargo,
        data_nascimento: userData.data_nascimento,
        sistemas: userData.sistemas.map(id => ({
          sistema_id: id,
          perfil: 'usuario' // Valor padrão, pode ser ajustado
        }))
      };

      const response = await api.post('/users', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar usuário:', error);
      throw error;
    }
  },
  
  async updateUser(id: number, userData: {
    name?: string;
    email?: string;
    password?: string;
    empresa?: string;
    telefone?: string;
    setor?: string;
    cargo?: string;
    data_nascimento?: string;
    sistemas?: number[];
    status?: boolean;
  }) {
    try {
      const payload: any = {
        ...(userData.name !== undefined ? { nome_completo: userData.name } : {}),
        ...(userData.email !== undefined ? { email: userData.email } : {}),
        ...(userData.password ? { senha: userData.password } : {}),
        ...(userData.empresa !== undefined ? { empresa: userData.empresa } : {}),
        ...(userData.telefone !== undefined ? { telefone: userData.telefone } : {}),
        ...(userData.setor !== undefined ? { setor: userData.setor } : {}),
        ...(userData.cargo !== undefined ? { cargo: userData.cargo } : {}),
        ...(userData.data_nascimento !== undefined ? { data_nascimento: userData.data_nascimento } : {}),
        ...(userData.sistemas ? { sistemas: userData.sistemas.map(id => ({ sistema_id: id })) } : {}),
        ...(typeof userData.status === 'boolean' ? { status: userData.status } : {}),
      };

      const response = await api.put(`/users/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar usuário:', error);
      throw error;
    }
  },
  
  async resetPassword(id: number) {
    try {
      const response = await api.post(`/users/${id}/reset-password`);
      return response.data;
    } catch (error) {
      console.error('Erro ao redefinir senha do usuário:', error);
      throw error;
    }
  },
  
  // Outros métodos como deleteUser podem ser adicionados aqui
};
