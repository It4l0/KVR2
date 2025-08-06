"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deleteSistema = exports.updateSistema = exports.getSistemaById = exports.getSistemas = exports.createSistema = void 0;
const database_1 = require("../config/database");
const Sistema_1 = require("../models/Sistema");
const UsuarioSistema_1 = require("../models/UsuarioSistema");
const createSistema = async (req, res) => {
    try {
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const sistema = sistemaRepository.create(req.body);
        await sistemaRepository.save(sistema);
        res.status(201).json(sistema);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao criar sistema' });
    }
};
exports.createSistema = createSistema;
const getSistemas = async (req, res) => {
    try {
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const sistemas = await sistemaRepository.find();
        res.json(sistemas);
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar sistemas' });
    }
};
exports.getSistemas = getSistemas;
const getSistemaById = async (req, res) => {
    try {
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const sistema = await sistemaRepository.findOneBy({ id: parseInt(req.params.id) });
        sistema ? res.json(sistema) : res.status(404).json({ message: 'Sistema não encontrado' });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao buscar sistema' });
    }
};
exports.getSistemaById = getSistemaById;
const updateSistema = async (req, res) => {
    try {
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const sistema = await sistemaRepository.findOneBy({ id: parseInt(req.params.id) });
        if (!sistema)
            return res.status(404).json({ message: 'Sistema não encontrado' });
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
    }
    catch (error) {
        res.status(500).json({ message: 'Erro ao atualizar sistema' });
    }
};
exports.updateSistema = updateSistema;
const deleteSistema = async (req, res) => {
    try {
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const usuarioSistemaRepository = database_1.AppDataSource.getRepository(UsuarioSistema_1.UsuarioSistema);
        const sistema = await sistemaRepository.findOne({
            where: { id: parseInt(req.params.id) },
            relations: ['usuarioSistemas']
        });
        if (!sistema)
            return res.status(404).json({ message: 'Sistema não encontrado' });
        // Primeiro remove todas as associações com usuários
        await usuarioSistemaRepository.remove(sistema.usuarioSistemas || []);
        // Depois remove o sistema
        await sistemaRepository.remove(sistema);
        res.json({ message: 'Sistema removido com sucesso' });
    }
    catch (error) {
        console.error('Erro detalhado:', error);
        res.status(500).json({
            message: 'Erro ao remover sistema',
            error: error instanceof Error ? error.message : 'Erro desconhecido'
        });
    }
};
exports.deleteSistema = deleteSistema;
