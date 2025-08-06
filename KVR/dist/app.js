"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.createApp = void 0;
const express_1 = __importDefault(require("express"));
const cors_1 = __importDefault(require("cors"));
const database_1 = require("./config/database");
const userRoutes_1 = __importDefault(require("./routes/userRoutes"));
const sistemaRoutes_1 = __importDefault(require("./routes/sistemaRoutes"));
const authRoutes_1 = __importDefault(require("./routes/authRoutes"));
const authMiddleware_1 = require("./middlewares/authMiddleware");
const createApp = async () => {
    await (0, database_1.connectDB)();
    const app = (0, express_1.default)();
    app.use((0, cors_1.default)());
    app.use(express_1.default.json());
    // Rotas públicas
    app.use('/api/auth', authRoutes_1.default);
    // Rotas protegidas
    app.use('/api/users', authMiddleware_1.authenticateJWT, userRoutes_1.default);
    app.use('/api/sistemas', authMiddleware_1.authenticateJWT, sistemaRoutes_1.default);
    app.get('/', (req, res) => {
        res.json({ message: 'API funcionando!' });
    });
    return app;
};
exports.createApp = createApp;
exports.default = exports.createApp;
