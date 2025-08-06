"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../config/database");
const Sistema_1 = require("../models/Sistema");
const User_1 = require("../models/User");
async function createTestSistema() {
    try {
        await database_1.AppDataSource.initialize();
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        // Busca o usuário teste (assumindo que já existe)
        const usuario = await userRepository.findOneBy({ email: 'teste@exampdle.com' });
        if (!usuario) {
            throw new Error('Usuário teste não encontrado');
        }
        const testSistema = {
            nome: 'Sistema de Teste',
            empresa: 'Empresa Teste',
            perfis: 'admin,user',
            descricao: 'Sistema para testes automatizados',
            url: 'http://sistema-teste.com',
            ativo: true,
            usuario: usuario
        };
        const sistema = sistemaRepository.create(testSistema);
        await sistemaRepository.save(sistema);
        console.log('✅ Sistema teste criado com sucesso!');
        console.log(sistema);
    }
    catch (error) {
        console.error('❌ Erro ao criar sistema teste:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
}
createTestSistema();
