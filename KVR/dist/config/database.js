"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.connectDB = exports.AppDataSource = void 0;
require("reflect-metadata");
const typeorm_1 = require("typeorm");
const dotenv_1 = __importDefault(require("dotenv"));
const User_1 = require("../models/User");
const Sistema_1 = require("../models/Sistema");
const UsuarioSistema_1 = require("../models/UsuarioSistema");
dotenv_1.default.config();
exports.AppDataSource = new typeorm_1.DataSource({
    type: 'postgres',
    host: process.env.DB_HOST,
    port: parseInt(process.env.DB_PORT || '5432'),
    username: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.DB_NAME,
    entities: [User_1.User, Sistema_1.Sistema, UsuarioSistema_1.UsuarioSistema],
    synchronize: false,
    logging: false
});
const connectDB = async () => {
    try {
        if (!exports.AppDataSource.isInitialized) {
            await exports.AppDataSource.initialize();
            console.log('Conectado ao PostgreSQL');
        }
    }
    catch (error) {
        console.error('Erro ao conectar no PostgreSQL:', error);
        throw error;
    }
};
exports.connectDB = connectDB;
