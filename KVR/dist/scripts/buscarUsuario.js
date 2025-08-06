"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const readline_1 = __importDefault(require("readline"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function questionAsync(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}
async function buscarUsuario() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('=== BUSCA DE USUÁRIO ===');
        const opcao = await questionAsync('Buscar por:\n1. ID\n2. Email\nEscolha: ');
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        let user;
        if (opcao === '1') {
            const id = await questionAsync('ID do usuário: ');
            user = await userRepository.findOne({
                where: { id: parseInt(id) },
                relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
            });
        }
        else if (opcao === '2') {
            const email = await questionAsync('Email do usuário: ');
            user = await userRepository.findOne({
                where: { email },
                relations: ['usuarioSistemas', 'usuarioSistemas.sistema']
            });
        }
        else {
            console.log('❌ Opção inválida');
            return;
        }
        if (user) {
            console.log('\n✅ Usuário encontrado:');
            console.log(`ID: ${user.id}`);
            console.log(`Nome: ${user.nome_completo}`);
            console.log(`Email: ${user.email}`);
            console.log(`Empresa: ${user.empresa}`);
            if (user.usuarioSistemas?.length) {
                console.log('\nSistemas vinculados:');
                user.usuarioSistemas.forEach(us => {
                    console.log(`- ${us.sistema.nome}: ${us.perfil}`);
                });
            }
            else {
                console.log('\n⚠️ Nenhum sistema vinculado');
            }
        }
        else {
            console.log('❌ Usuário não encontrado');
        }
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Erro ao buscar usuário:', error.message);
        }
        else {
            console.error('❌ Erro desconhecido ao buscar usuário');
        }
    }
    finally {
        rl.close();
        await database_1.AppDataSource.destroy();
    }
}
buscarUsuario();
