"use strict";
var __esDecorate = (this && this.__esDecorate) || function (ctor, descriptorIn, decorators, contextIn, initializers, extraInitializers) {
    function accept(f) { if (f !== void 0 && typeof f !== "function") throw new TypeError("Function expected"); return f; }
    var kind = contextIn.kind, key = kind === "getter" ? "get" : kind === "setter" ? "set" : "value";
    var target = !descriptorIn && ctor ? contextIn["static"] ? ctor : ctor.prototype : null;
    var descriptor = descriptorIn || (target ? Object.getOwnPropertyDescriptor(target, contextIn.name) : {});
    var _, done = false;
    for (var i = decorators.length - 1; i >= 0; i--) {
        var context = {};
        for (var p in contextIn) context[p] = p === "access" ? {} : contextIn[p];
        for (var p in contextIn.access) context.access[p] = contextIn.access[p];
        context.addInitializer = function (f) { if (done) throw new TypeError("Cannot add initializers after decoration has completed"); extraInitializers.push(accept(f || null)); };
        var result = (0, decorators[i])(kind === "accessor" ? { get: descriptor.get, set: descriptor.set } : descriptor[key], context);
        if (kind === "accessor") {
            if (result === void 0) continue;
            if (result === null || typeof result !== "object") throw new TypeError("Object expected");
            if (_ = accept(result.get)) descriptor.get = _;
            if (_ = accept(result.set)) descriptor.set = _;
            if (_ = accept(result.init)) initializers.unshift(_);
        }
        else if (_ = accept(result)) {
            if (kind === "field") initializers.unshift(_);
            else descriptor[key] = _;
        }
    }
    if (target) Object.defineProperty(target, contextIn.name, descriptor);
    done = true;
};
var __runInitializers = (this && this.__runInitializers) || function (thisArg, initializers, value) {
    var useValue = arguments.length > 2;
    for (var i = 0; i < initializers.length; i++) {
        value = useValue ? initializers[i].call(thisArg, value) : initializers[i].call(thisArg);
    }
    return useValue ? value : void 0;
};
var __setFunctionName = (this && this.__setFunctionName) || function (f, name, prefix) {
    if (typeof name === "symbol") name = name.description ? "[".concat(name.description, "]") : "";
    return Object.defineProperty(f, "name", { configurable: true, value: prefix ? "".concat(prefix, " ", name) : name });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.UsuarioSistema = void 0;
const typeorm_1 = require("typeorm");
const User_1 = require("./User");
const Sistema_1 = require("./Sistema");
let UsuarioSistema = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _usuario_decorators;
    let _usuario_initializers = [];
    let _usuario_extraInitializers = [];
    let _sistema_decorators;
    let _sistema_initializers = [];
    let _sistema_extraInitializers = [];
    let _perfil_decorators;
    let _perfil_initializers = [];
    let _perfil_extraInitializers = [];
    let _data_cadastro_decorators;
    let _data_cadastro_initializers = [];
    let _data_cadastro_extraInitializers = [];
    var UsuarioSistema = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.usuario = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _usuario_initializers, void 0));
            this.sistema = (__runInitializers(this, _usuario_extraInitializers), __runInitializers(this, _sistema_initializers, void 0));
            this.perfil = (__runInitializers(this, _sistema_extraInitializers), __runInitializers(this, _perfil_initializers, void 0));
            this.data_cadastro = (__runInitializers(this, _perfil_extraInitializers), __runInitializers(this, _data_cadastro_initializers, void 0));
            __runInitializers(this, _data_cadastro_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "UsuarioSistema");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _usuario_decorators = [(0, typeorm_1.ManyToOne)(() => User_1.User, (user) => user.usuarioSistemas), (0, typeorm_1.JoinColumn)({ name: 'user_id' })];
        _sistema_decorators = [(0, typeorm_1.ManyToOne)(() => Sistema_1.Sistema, (sistema) => sistema.usuarioSistemas), (0, typeorm_1.JoinColumn)({ name: 'sistema_id' })];
        _perfil_decorators = [(0, typeorm_1.Column)()];
        _data_cadastro_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _usuario_decorators, { kind: "field", name: "usuario", static: false, private: false, access: { has: obj => "usuario" in obj, get: obj => obj.usuario, set: (obj, value) => { obj.usuario = value; } }, metadata: _metadata }, _usuario_initializers, _usuario_extraInitializers);
        __esDecorate(null, null, _sistema_decorators, { kind: "field", name: "sistema", static: false, private: false, access: { has: obj => "sistema" in obj, get: obj => obj.sistema, set: (obj, value) => { obj.sistema = value; } }, metadata: _metadata }, _sistema_initializers, _sistema_extraInitializers);
        __esDecorate(null, null, _perfil_decorators, { kind: "field", name: "perfil", static: false, private: false, access: { has: obj => "perfil" in obj, get: obj => obj.perfil, set: (obj, value) => { obj.perfil = value; } }, metadata: _metadata }, _perfil_initializers, _perfil_extraInitializers);
        __esDecorate(null, null, _data_cadastro_decorators, { kind: "field", name: "data_cadastro", static: false, private: false, access: { has: obj => "data_cadastro" in obj, get: obj => obj.data_cadastro, set: (obj, value) => { obj.data_cadastro = value; } }, metadata: _metadata }, _data_cadastro_initializers, _data_cadastro_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        UsuarioSistema = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return UsuarioSistema = _classThis;
})();
exports.UsuarioSistema = UsuarioSistema;
