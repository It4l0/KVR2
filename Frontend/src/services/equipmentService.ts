import { api } from './api';

export interface EquipmentDTO {
  id?: number;
  tipo: string;
  identificacao: string;
  marca?: string | null;
  modelo?: string | null;
  observacoes?: string | null;
  senha_padrao?: string | null;
  ativo?: boolean;
  usuarioId?: number | null;
  data_cadastro?: string;
  usuario?: any;
}

export const EquipmentService = {
  async list(): Promise<EquipmentDTO[]> {
    const { data } = await api.get('/equipamentos');
    return data;
  },
  async create(payload: Omit<EquipmentDTO, 'id' | 'data_cadastro' | 'usuario'>) {
    const { data } = await api.post('/equipamentos', payload);
    return data;
  },
  async assign(id: number, usuarioId: number | null) {
    const { data } = await api.patch(`/equipamentos/${id}/assign`, { usuarioId });
    return data as EquipmentDTO;
  },
  async update(id: number, payload: Partial<Omit<EquipmentDTO, 'id' | 'data_cadastro' | 'usuario'>>) {
    const { data } = await api.put(`/equipamentos/${id}`, payload);
    return data as EquipmentDTO;
  },
  async remove(id: number) {
    await api.delete(`/equipamentos/${id}`);
    return true;
  }
};
