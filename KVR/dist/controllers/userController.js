"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getCurrentUser = exports.deleteUser = exports.updateUser = exports.getUserById = exports.getUsers = exports.createUser = void 0;
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Sistema_1 = require("../models/Sistema");
const UsuarioSistema_1 = require("../models/UsuarioSistema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createUser = async (req, res) => {
    try {
        const { nome_completo, email, senha, empresa, telefone, setor, cargo, data_nascimento, sistemas } = req.body;
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const usuarioSistemaRepository = database_1.AppDataSource.getRepository(UsuarioSistema_1.UsuarioSistema);
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
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar usuário' });
    }
};
exports.createUser = createUser;
const getUsers = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const users = await userRepository.find({
            relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
        });
        res.json(users);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuários' });
    }
};
exports.getUsers = getUsers;
const getUserById = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
        });
        if (!user)
            return res.status(404).json({ message: 'Usuário não encontrado' });
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
};
exports.getUserById = getUserById;
const updateUser = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user)
            return res.status(404).json({ message: 'Usuário não encontrado' });
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
            user.senha = await bcryptjs_1.default.hash(req.body.senha, 10);
        }
        await userRepository.save(user);
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar usuário' });
    }
};
exports.updateUser = updateUser;
const deleteUser = async (req, res) => {
    try {
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!user)
            return res.status(404).json({ message: 'Usuário não encontrado' });
        await userRepository.remove(user);
        res.json({ message: 'Usuário removido com sucesso' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao remover usuário' });
    }
};
exports.deleteUser = deleteUser;
const getCurrentUser = async (req, res) => {
    try {
        if (!req.user) {
            return res.status(401).json({ message: 'Não autenticado' });
        }
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOne({
            where: { id: req.user.userId },
            select: ['id', 'nome_completo', 'email', 'empresa', 'telefone']
        });
        if (!user) {
            return res.status(404).json({ message: 'Usuário não encontrado' });
        }
        res.json(user);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar usuário' });
    }
};
exports.getCurrentUser = getCurrentUser;
