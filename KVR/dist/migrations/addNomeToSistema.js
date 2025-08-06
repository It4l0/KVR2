"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addNomeToSistema = addNomeToSistema;
require("reflect-metadata");
const database_1 = require("../config/database");
const Sistema_1 = require("../models/Sistema");
async function addNomeToSistema() {
    try {
        await database_1.AppDataSource.initialize();
        // Primeiro adiciona a coluna permitindo nulos
        await database_1.AppDataSource.query(`ALTER TABLE "sistema" ADD COLUMN "nome" character varying`);
        // Depois atualiza os registros existentes
        const sistemaRepository = database_1.AppDataSource.getRepository(Sistema_1.Sistema);
        const sistemas = await sistemaRepository.find();
        for (const sistema of sistemas) {
            sistema.nome = sistema.descricao;
            await sistemaRepository.save(sistema);
        }
        // Finalmente altera a coluna para NOT NULL
        await database_1.AppDataSource.query(`ALTER TABLE "sistema" ALTER COLUMN "nome" SET NOT NULL`);
        console.log('✅ Campo nome adicionado aos sistemas existentes');
    }
    catch (error) {
        console.error('❌ Erro ao atualizar sistemas:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
}
addNomeToSistema();
