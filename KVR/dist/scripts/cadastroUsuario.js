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
const readline_1 = __importDefault(require("readline"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const rl = readline_1.default.createInterface({
    input: process.stdin,
    output: process.stdout
});
async function questionAsync(prompt) {
    return new Promise(resolve => {
        rl.question(prompt, resolve);
    });
}
async function listarSistemas() {
    const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
    const sistemas = await sistemaRepository.find();
    console.log('\n=== SISTEMAS DISPONÍVEIS ===');
    sistemas.forEach(sistema => {
        console.log(`ID: ${sistema.id} | Nome: ${sistema.nome || sistema.descricao} | Empresa: ${sistema.empresa}`);
    });
    return sistemas;
}
async function cadastrarUsuario() {
    try {
        await database_1.AppDataSource.initialize();
        console.log('=== CADASTRO DE USUÁRIO ===');
        // Coletar dados básicos
        const nome_completo = await questionAsync('Nome completo: ');
        const email = await questionAsync('Email: ');
        const senha = await questionAsync('Senha: ');
        const empresa = await questionAsync('Empresa: ');
        const telefone = await questionAsync('Telefone: ');
        const setor = await questionAsync('Setor: ');
        const cargo = await questionAsync('Cargo: ');
        const data_nascimento = await questionAsync('Data de nascimento (YYYY-MM-DD): ');
        // Criptografar senha
        const hashedPassword = await bcryptjs_1.default.hash(senha, 10);
        // Criar usuário
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = userRepository.create({
            nome_completo,
            email,
            senha: hashedPassword,
            empresa,
            telefone,
            setor,
            cargo,
            data_nascimento: new Date(data_nascimento)
        });
        await userRepository.save(user);
        // Vincular sistemas (obrigatório)
        const sistemas = await listarSistemas();
        const usuarioSistemaRepository = database_1.AppDataSource.getRepository(UsuarioSistema_1.UsuarioSistema);
        if (sistemas.length === 0) {
            throw new Error('Nenhum sistema cadastrado. Cadastre um sistema primeiro.');
        }
        let sistemasVinculados = 0;
        while (sistemasVinculados === 0) {
            const sistemaId = await questionAsync('\nDigite o ID do sistema para vincular (obrigatório): ');
            if (!sistemaId) {
                console.log('❌ É obrigatório selecionar pelo menos um sistema');
                continue;
            }
            const perfil = await questionAsync('Perfil do usuário neste sistema (ex: admin, user): ');
            const sistema = sistemas.find(s => s.id === parseInt(sistemaId));
            if (sistema) {
                const usuarioSistema = usuarioSistemaRepository.create({
                    usuario: user,
                    sistema,
                    perfil
                });
                await usuarioSistemaRepository.save(usuarioSistema);
                console.log(`✅ Sistema ${sistema.nome || sistema.descricao} vinculado com perfil ${perfil}`);
                sistemasVinculados++;
            }
            else {
                console.log('❌ Sistema não encontrado');
            }
        }
        // Opção para adicionar mais sistemas
        while (true) {
            const continuar = await questionAsync('\nDeseja vincular outro sistema? (s/n): ');
            if (continuar.toLowerCase() !== 's')
                break;
            const sistemaId = await questionAsync('Digite o ID do sistema adicional: ');
            if (!sistemaId)
                break;
            const perfil = await questionAsync('Perfil do usuário neste sistema: ');
            const sistema = sistemas.find(s => s.id === parseInt(sistemaId));
            if (sistema) {
                const usuarioSistema = usuarioSistemaRepository.create({
                    usuario: user,
                    sistema,
                    perfil
                });
                await usuarioSistemaRepository.save(usuarioSistema);
                console.log(`✅ Sistema adicional vinculado: ${sistema.nome || sistema.descricao}`);
            }
            else {
                console.log('❌ Sistema não encontrado');
            }
        }
        console.log('\n✅ Usuário cadastrado com sucesso!');
        console.log(`ID: ${user.id}`);
        console.log(`Nome: ${user.nome_completo}`);
        console.log(`Email: ${user.email}`);
    }
    catch (error) {
        if (error instanceof Error) {
            console.error('❌ Erro ao cadastrar usuário:', error.message);
        }
        else {
            console.error('❌ Erro desconhecido ao cadastrar usuário');
        }
    }
    finally {
        rl.close();
        await database_1.AppDataSource.destroy();
    }
}
cadastrarUsuario();
