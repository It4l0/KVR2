import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Equipment } from '../models/Equipment';
import { User } from '../models/User';

export const listEquipments = async (req: Request, res: Response) => {
  try {
    const repo = AppDataSource.getRepository(Equipment);
    const items = await repo
      .createQueryBuilder('equipment')
      .leftJoinAndSelect('equipment.usuario', 'usuario')
      .addSelect('equipment.senha_padrao')
      .getMany();
    res.json(items);
  } catch (error) {
    console.error('Erro ao listar equipamentos:', error);
    res.status(500).json({ message: 'Erro ao listar equipamentos' });
  }
};

export const updateEquipment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { tipo, identificacao, marca, modelo, observacoes, ativo, usuarioId, senha_padrao } = req.body as {
      tipo?: string;
      identificacao?: string;
      marca?: string | null;
      modelo?: string | null;
      observacoes?: string | null;
      ativo?: boolean;
      usuarioId?: number | null;
      senha_padrao?: string | null;
    };

    const repo = AppDataSource.getRepository(Equipment);
    const userRepo = AppDataSource.getRepository(User);

    const eq = await repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!eq) return res.status(404).json({ message: 'Equipamento não encontrado' });

    if (tipo !== undefined) eq.tipo = String(tipo);
    if (identificacao !== undefined) eq.identificacao = String(identificacao);
    if (marca !== undefined) (eq as any).marca = marca ?? null;
    if (modelo !== undefined) (eq as any).modelo = modelo ?? null;
    if (observacoes !== undefined) eq.observacoes = observacoes ?? null;
    if (typeof ativo === 'boolean') eq.ativo = ativo;
    if (senha_padrao !== undefined) (eq as any).senha_padrao = senha_padrao ?? null;

    if (usuarioId !== undefined) {
      if (usuarioId === null) {
        eq.usuario = null;
      } else {
        const user = await userRepo.findOne({ where: { id: Number(usuarioId) } });
        if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });
        eq.usuario = user;
      }
    }

    await repo.save(eq);
    const withRel = await repo.findOne({ where: { id }, relations: ['usuario'] });
    return res.json(withRel);
  } catch (error) {
    console.error('Erro ao atualizar equipamento:', error);
    return res.status(500).json({ message: 'Erro ao atualizar equipamento' });
  }
};

export const deleteEquipment = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const repo = AppDataSource.getRepository(Equipment);
    const eq = await repo.findOne({ where: { id } });
    if (!eq) return res.status(404).json({ message: 'Equipamento não encontrado' });
    await repo.remove(eq);
    return res.status(204).send();
  } catch (error) {
    console.error('Erro ao excluir equipamento:', error);
    return res.status(500).json({ message: 'Erro ao excluir equipamento' });
  }
};

export const createEquipment = async (req: Request, res: Response) => {
  try {
    const { tipo, identificacao, marca, modelo, observacoes, ativo = true, usuarioId, senha_padrao } = req.body;

    if (!tipo || !identificacao) {
      return res.status(400).json({ message: 'Campos obrigatórios: tipo, identificacao' });
    }

    const repo = AppDataSource.getRepository(Equipment);
    const userRepo = AppDataSource.getRepository(User);

    const equipment = new Equipment();
    equipment.tipo = String(tipo);
    equipment.identificacao = String(identificacao);
    equipment.marca = marca ?? null;
    equipment.modelo = modelo ?? null;
    equipment.observacoes = observacoes ?? null;
    equipment.senha_padrao = senha_padrao ?? null;
    equipment.ativo = Boolean(ativo);

    if (usuarioId) {
      const user = await userRepo.findOne({ where: { id: Number(usuarioId) } });
      if (!user) {
        return res.status(400).json({ message: 'Usuário não encontrado para usuarioId informado' });
      }
      equipment.usuario = user;
    }

    const saved = await repo.save(equipment);
    const withRel = await repo.findOne({ where: { id: saved.id }, relations: ['usuario'] });
    res.status(201).json(withRel ?? saved);
  } catch (error) {
    console.error('Erro ao criar equipamento:', error);
    res.status(500).json({ message: 'Erro ao criar equipamento' });
  }
};

export const assignEquipmentUser = async (req: Request, res: Response) => {
  try {
    const id = Number(req.params.id);
    const { usuarioId } = req.body as { usuarioId?: number | null };

    const repo = AppDataSource.getRepository(Equipment);
    const userRepo = AppDataSource.getRepository(User);

    const eq = await repo.findOne({ where: { id }, relations: ['usuario'] });
    if (!eq) return res.status(404).json({ message: 'Equipamento não encontrado' });

    if (usuarioId === null || usuarioId === undefined) {
      eq.usuario = null;
    } else {
      const user = await userRepo.findOne({ where: { id: Number(usuarioId) } });
      if (!user) return res.status(400).json({ message: 'Usuário não encontrado' });
      eq.usuario = user;
    }

    await repo.save(eq);
    const withRel = await repo.findOne({ where: { id }, relations: ['usuario'] });
    return res.json(withRel);
  } catch (error) {
    console.error('Erro ao vincular usuário ao equipamento:', error);
    return res.status(500).json({ message: 'Erro ao vincular usuário ao equipamento' });
  }
};
