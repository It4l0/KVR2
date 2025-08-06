"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validateToken = exports.logout = exports.login = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const database_1 = require("../config/database");
const User_1 = require("../models/User");
const login = async (req, res) => {
    try {
        const { email, senha } = req.body;
        const userRepository = database_1.AppDataSource.getRepository(User_1.User);
        const user = await userRepository.findOneBy({ email });
        if (!user || !bcryptjs_1.default.compareSync(senha, user.senha)) {
            return res.status(401).json({ message: 'Credenciais inválidas' });
        }
        const token = jsonwebtoken_1.default.sign({ userId: user.id, email: user.email }, process.env.JWT_SECRET || 'secret_default', { expiresIn: '1h' });
        res.json({ token });
    }
    catch (error) {
        res.status(500).json({ message: 'Erro no login' });
    }
};
exports.login = login;
const logout = (req, res) => {
    // Implementar lógica de logout/invalidação de token se necessário
    res.json({ message: 'Logout realizado com sucesso' });
};
exports.logout = logout;
const validateToken = (req, res) => {
    // Middleware já validou o token
    res.json({ valid: true });
};
exports.validateToken = validateToken;
