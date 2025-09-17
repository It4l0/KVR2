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
      nome_completo,
      email,
      senha,
      empresa,
      telefone,
      setor,
      cargo,
      // garante que é Date para coluna do tipo 'date'
      data_nascimento: data_nascimento ? new Date(data_nascimento) : undefined as any,
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
  } catch (error: any) {
    console.error('Erro ao criar usuário:', error);
    // violação de unicidade (email)
    if (error?.code === '23505') {
      return res.status(400).json({ message: 'Email já cadastrado' });
    }
    res.status(500).json({ message: 'Erro ao criar usuário' });
  }
};

export const resetPassword = async (req: Request, res: Response) => {
  try {
    const userRepository = AppDataSource.getRepository(User);
    const id = Number(req.params.id);
    const user = await userRepository.findOneBy({ id });
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });

    const defaultPassword = process.env.DEFAULT_RESET_PASSWORD || '123456';
    const hashed = await bcrypt.hash(defaultPassword, 10);
    user.senha = hashed;
    await userRepository.save(user);

    return res.json({ message: 'Senha redefinida com sucesso' });
  } catch (error) {
    console.error('Erro ao redefinir senha:', error);
    return res.status(500).json({ message: 'Erro ao redefinir senha' });
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
    const usuarioSistemaRepository = AppDataSource.getRepository(UsuarioSistema);
    const sistemaRepository = AppDataSource.getRepository(Sistema);
    const user = await userRepository.findOne({
      where: { id: parseInt(req.params.id) },
    });
    
    if (!user) return res.status(404).json({ message: 'Usuário não encontrado' });
    
    // Atualiza campos permitidos
    const { nome_completo, email, empresa, telefone, setor, cargo, status } = req.body;
    userRepository.merge(user, {
      nome_completo,
      email,
      empresa,
      telefone,
      setor,
      cargo,
      ...(typeof status === 'boolean' ? { status } : {})
    });
    
    if (req.body.senha) {
      user.senha = await bcrypt.hash(req.body.senha, 10);
    }
    
    await userRepository.save(user);

    // Sincroniza vínculos de sistemas, se enviado no payload
    if (Array.isArray(req.body.sistemas)) {
      // normaliza para array de objetos { sistema_id, perfil }
      const desired: { sistema_id: number; perfil: string }[] = req.body.sistemas.map((s: any) => (
        typeof s === 'number' ? { sistema_id: s, perfil: 'usuario' } : { sistema_id: Number(s.sistema_id), perfil: s.perfil || 'usuario' }
      ));

      // vínculos atuais
      const atuais = await usuarioSistemaRepository.find({
        where: { usuario: { id: user.id } },
        relations: ['sistema', 'usuario'],
      });
      const atuaisIds = new Set(atuais.map(v => v.sistema.id));
      const desejadosIds = new Set(desired.map(d => d.sistema_id));

      // Remover vínculos que não estão mais desejados
      const toRemove = atuais.filter(v => !desejadosIds.has(v.sistema.id));
      if (toRemove.length) {
        await usuarioSistemaRepository.remove(toRemove);
      }

      // Adicionar novos vínculos
      const toAddIds = Array.from(desejadosIds).filter(id => !atuaisIds.has(id));
      if (toAddIds.length) {
        for (const sistema_id of toAddIds) {
          const sistema = await sistemaRepository.findOneBy({ id: sistema_id });
          if (sistema) {
            const perfil = desired.find(d => d.sistema_id === sistema_id)?.perfil || 'usuario';
            const vinculo = usuarioSistemaRepository.create({ usuario: user, sistema, perfil });
            await usuarioSistemaRepository.save(vinculo);
          }
        }
      }

      // Atualizar perfil de vínculos existentes, se mudou
      for (const v of atuais) {
        const desejado = desired.find(d => d.sistema_id === v.sistema.id);
        if (desejado && desejado.perfil && desejado.perfil !== v.perfil) {
          v.perfil = desejado.perfil;
          await usuarioSistemaRepository.save(v);
        }
      }
    }

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
