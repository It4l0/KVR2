"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require("reflect-metadata");
const database_1 = require("../config/database");
async function createTables() {
    try {
        await database_1.AppDataSource.initialize();
        // Sincroniza todas as entidades com o banco de dados
        await database_1.AppDataSource.synchronize();
        console.log('✅ Tabelas criadas com sucesso!');
        // Lista as tabelas criadas
        const tables = await database_1.AppDataSource.query(`
      SELECT table_name 
      FROM information_schema.tables 
      WHERE table_schema = 'public'
    `);
        console.log('Tabelas disponíveis:', tables.map((t) => t.table_name));
    }
    catch (error) {
        console.error('❌ Erro ao criar tabelas:', error);
    }
    finally {
        await database_1.AppDataSource.destroy();
    }
}
createTables();
