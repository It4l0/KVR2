"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../config/database");
const Sistema_1 = require("../models/Sistema");
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
async function cadastrarSistema() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('=== CADASTRO DE SISTEMA ===');
        const nome = await questionAsync('Nome do sistema: ');
        const empresa = await questionAsync('Empresa: ');
        const perfis = await questionAsync('Perfis disponíveis (separados por vírgula): ');
        const descricao = await questionAsync('Descrição: ');
        const url = await questionAsync('URL: ');
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const sistema = sistemaRepository.create({
            nome,
            empresa,
            perfis,
            descricao,
            url,
            ativo: true
        });
        await sistemaRepository.save(sistema);
        console.log('\n✅ Sistema cadastrado com sucesso!');
        console.log(`ID: ${sistema.id}`);
        console.log(`Nome: ${sistema.nome}`);
        console.log(`Empresa: ${sistema.empresa}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Erro ao cadastrar sistema:', error.message);
        }
        else {
            console.error('❌ Erro desconhecido ao cadastrar sistema');
        }
    }
    finally {
        rl.close();
        await database_1.AppDataSource.destroy();
    }
}
cadastrarSistema();
