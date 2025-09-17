import { api } from './api';

export const SystemService = {
  async getSystems() {
    try {
      const response = await api.get('/sistemas');
      return response.data;
    } catch (error) {
      console.error('Erro ao buscar sistemas:', error);
      throw error;
    }
  },

  async createSystem(systemData: {
    name: string;
    empresa: string;
    perfis: string;
    description: string;
    url: string;
  }) {
    try {
      // Transforma a string de perfis em array
      const perfisArray = systemData.perfis
        .split(',')
        .map(p => p.trim())
        .filter(p => p.length > 0);

      const payload = {
        nome: systemData.name,
        empresa: systemData.empresa,
        perfis: perfisArray,
        descricao: systemData.description,
        url: systemData.url
      };

      const response = await api.post('/sistemas', payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao criar sistema:', error);
      throw error;
    }
  }
  ,

  async updateSystem(id: number, systemData: {
    name?: string;
    empresa?: string;
    perfis?: string | string[];
    description?: string;
    url?: string;
  }) {
    try {
      let perfisArray: string[] | undefined = undefined;
      if (typeof systemData.perfis === 'string') {
        perfisArray = systemData.perfis
          .split(',')
          .map(p => p.trim())
          .filter(p => p.length > 0);
      } else if (Array.isArray(systemData.perfis)) {
        perfisArray = systemData.perfis;
      }

      const payload: any = {
        ...(systemData.name !== undefined ? { nome: systemData.name } : {}),
        ...(systemData.empresa !== undefined ? { empresa: systemData.empresa } : {}),
        ...(perfisArray !== undefined ? { perfis: perfisArray } : {}),
        ...(systemData.description !== undefined ? { descricao: systemData.description } : {}),
        ...(systemData.url !== undefined ? { url: systemData.url } : {}),
      };

      const response = await api.put(`/sistemas/${id}`, payload);
      return response.data;
    } catch (error) {
      console.error('Erro ao atualizar sistema:', error);
      throw error;
    }
  }
};
