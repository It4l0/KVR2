import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { Sistema } from '../models/Sistema';
import { UsuarioSistema } from '../models/UsuarioSistema';

export const createSistema = async (req: Request, res: Response) => {
  try {
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const sistema = sistemaRepository.create(req.body);
    await sistemaRepository.save(sistema);
    res.status(201).json(sistema);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar sistema' });
  }
};

export const getSistemas = async (req: Request, res: Response) => {
  try {
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const sistemas = await sistemaRepository.find();
    res.json(sistemas);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar sistemas' });
  }
};

export const getSistemaById = async (req: Request, res: Response) => {
  try {
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const sistema = await sistemaRepository.findOneBy({ id: parseInt(req.params.id) });
    sistema ? res.json(sistema) : res.status(404).json({ message: 'Sistema não encontrado' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar sistema' });
  }
};

export const updateSistema = async (req: Request, res: Response) => {
  try {
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const sistema = await sistemaRepository.findOneBy({ id: parseInt(req.params.id) });
    
    if (!sistema) return res.status(404).json({ message: 'Sistema não encontrado' });
    
    // Atualiza campos permitidos
    const { nome, empresa, perfis, descricao, url, ativo } = req.body;
    sistemaRepository.merge(sistema, {
      nome,
      empresa,
      perfis,
      descricao,
      url,
      ativo
    });
    
    await sistemaRepository.save(sistema);
    res.json(sistema);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar sistema' });
  }
};

export const deleteSistema = async (req: Request, res: Response) => {
  try {
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const usuarioSistemaRepository = AppDataSource.getRepository(UsuarioSistema);
    
    const sistema = await sistemaRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['usuarioSistemas']
    });
    
    if (!sistema) return res.status(404).json({ message: 'Sistema não encontrado' });
    
    // Primeiro remove todas as associações com usuários
    await usuarioSistemaRepository.remove(sistema.usuarioSistemas || []);
    
    // Depois remove o sistema
    await sistemaRepository.remove(sistema);
    
    res.json({ message: 'Sistema removido com sucesso' });
  } catch (error) {
    console.error('Erro detalhado:', error);
    res.status(500).json({ 
      message: 'Erro ao remover sistema',
      error: error instanceof Error ? error.message : 'Erro desconhecido'
    });
  }
};
