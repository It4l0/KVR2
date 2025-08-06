"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const Sistema_1 = require("../models/Sistema");
const UsuarioSistema_1 = require("../models/UsuarioSistema");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
async function createTestUser() {
    try {
        await database_1.AppDataSource.initialize();
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const usuarioSistemaRepository = database_1.AppDataSource.getRepository(UsuarioSistema_1.UsuarioSistema);
        const hashedPassword = await bcryptjs_1.default.hash('senha123', 10);
        // Cria o usuário
        const testUser = {
            nome_completo: 'Usuário Tester',
            email: 'teste@exampdle.com',
            senha: hashedPassword,
            empresa: 'Empresa Teste',
            telefone: '(11) 99989-9999',
            setor: 'TI',
            cargo: 'Desenvolvedor',
            data_nascimento: new Date('1990-01-01'),
            sistemas: [
                { sistema_id: 1, perfil: 'admin' } // Assumindo que existe um sistema com ID 1
            ]
        };
        const user = userRepository.create(testUser);
        await userRepository.save(user);
        // Associa os sistemas
        for (const sistemaPerfil of testUser.sistemas) {
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
        console.log('✅ Usuário teste criado com sucesso!');
        console.log(user);
    }
    catch (error) {
        console.error('❌ Erro ao criar usuário teste:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
}
createTestUser();
