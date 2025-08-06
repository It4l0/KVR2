import { Request, Response } from 'express';
import { AppDataSource } from '../config/database';
import { User } from '../models/User';
import { Sistema } from '../models/Sistema';
import { UsuarioSistema } from '../models/UsuarioSistema';
import bcrypt from 'bcryptjs';

export const createUser = async (req: Request, res: Response) => {
  try {
    const { nome_completo, email, senha, empresa, telefone, setor, cargo, data_nascimento, sistemas } = req.body;
    
    const userRepository = AppDataSource.getRepository(User);
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const usuarioSistemaRepository = AppDataSource.getRepository(UsuarioSistema);
    
    // Cria o usuário
    const user = userRepository.create({
      nome_completo, email, senha, empresa, telefone, setor, cargo, data_nascimento
    });
    await userRepository.save(user);
    
    // Associa os sistemas e perfis
    if (sistemas && sistemas.length > 0) {
      for (const sistemaPerfil of sistemas) {
        const sistema = await sistemaRepository.findOneBy({ id: sistemaPerfil.sistema_id });
        if (sistema) {
          const usuarioSistema = usuarioSistemaRepository.create({
            usuario: user,
            sistema,
            perfil: sistemaPerfil.perfil
          });
          await usuarioSistemaRepository.save(usuarioSistema);
        }
      }
    }
    
    res.status(201).json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

export const getUsers = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const users = await userRepository.find({
      relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
    });
    res.json(users);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuários' });
  }
};

export const getUserById = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
      relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
    });

    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};

export const updateUser = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
    
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    // Atualiza campos permitidos
    const { nome_completo, email, empresa, telefone, setor, cargo } = req.body;
    userRepository.merge(user, {
      nome_completo,
      email,
      empresa,
      telefone,
      setor,
      cargo
    });
    
    if (req.body.senha) {
      user.senha = await bcrypt.hash(req.body.senha, 10);
    }
    
    await userRepository.save(user);
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao atualizar usuário' });
  }
};

export const deleteUser = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
    
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    await userRepository.remove(user);
    res.json({ message: 'Usuário removido com sucesso' });
  } catch (error) {
    res.status(500).json({ message: 'Erro ao remover usuário' });
  }
};

export const getCurrentUser = async (req: Request, res: Response) => {
  try {
    if (!req.user) {
      return res.status(401).json({ message: 'Não autenticado' });
    }
    
    const userRepository = AppDataSource.getRepository(User);
    const user = await userRepository.findOne({
      where: { id: Number(req.user.id) },
      select: ['id', 'nome_completo', 'email', 'empresa', 'telefone']
    });
    
    if (!user) {
      return res.status(404).json({ message: 'Usuário não encontrado' });
    }
    
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Erro ao buscar usuário' });
  }
};
