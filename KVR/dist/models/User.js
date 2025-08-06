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
exports.User = void 0;
const typeorm_1 = require("typeorm");
const UsuarioSistema_1 = require("./UsuarioSistema");
let User = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _nome_completo_decorators;
    let _nome_completo_initializers = [];
    let _nome_completo_extraInitializers = [];
    let _email_decorators;
    let _email_initializers = [];
    let _email_extraInitializers = [];
    let _senha_decorators;
    let _senha_initializers = [];
    let _senha_extraInitializers = [];
    let _empresa_decorators;
    let _empresa_initializers = [];
    let _empresa_extraInitializers = [];
    let _telefone_decorators;
    let _telefone_initializers = [];
    let _telefone_extraInitializers = [];
    let _setor_decorators;
    let _setor_initializers = [];
    let _setor_extraInitializers = [];
    let _cargo_decorators;
    let _cargo_initializers = [];
    let _cargo_extraInitializers = [];
    let _data_nascimento_decorators;
    let _data_nascimento_initializers = [];
    let _data_nascimento_extraInitializers = [];
    let _data_cadastro_decorators;
    let _data_cadastro_initializers = [];
    let _data_cadastro_extraInitializers = [];
    let _status_decorators;
    let _status_initializers = [];
    let _status_extraInitializers = [];
    let _usuarioSistemas_decorators;
    let _usuarioSistemas_initializers = [];
    let _usuarioSistemas_extraInitializers = [];
    var User = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.nome_completo = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _nome_completo_initializers, void 0));
            this.email = (__runInitializers(this, _nome_completo_extraInitializers), __runInitializers(this, _email_initializers, void 0));
            this.senha = (__runInitializers(this, _email_extraInitializers), __runInitializers(this, _senha_initializers, void 0));
            this.empresa = (__runInitializers(this, _senha_extraInitializers), __runInitializers(this, _empresa_initializers, void 0));
            this.telefone = (__runInitializers(this, _empresa_extraInitializers), __runInitializers(this, _telefone_initializers, void 0));
            this.setor = (__runInitializers(this, _telefone_extraInitializers), __runInitializers(this, _setor_initializers, void 0));
            this.cargo = (__runInitializers(this, _setor_extraInitializers), __runInitializers(this, _cargo_initializers, void 0));
            this.data_nascimento = (__runInitializers(this, _cargo_extraInitializers), __runInitializers(this, _data_nascimento_initializers, void 0));
            this.data_cadastro = (__runInitializers(this, _data_nascimento_extraInitializers), __runInitializers(this, _data_cadastro_initializers, void 0));
            this.status = (__runInitializers(this, _data_cadastro_extraInitializers), __runInitializers(this, _status_initializers, void 0));
            this.usuarioSistemas = (__runInitializers(this, _status_extraInitializers), __runInitializers(this, _usuarioSistemas_initializers, void 0));
            __runInitializers(this, _usuarioSistemas_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "User");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _nome_completo_decorators = [(0, typeorm_1.Column)()];
        _email_decorators = [(0, typeorm_1.Column)({ unique: true })];
        _senha_decorators = [(0, typeorm_1.Column)()];
        _empresa_decorators = [(0, typeorm_1.Column)()];
        _telefone_decorators = [(0, typeorm_1.Column)()];
        _setor_decorators = [(0, typeorm_1.Column)()];
        _cargo_decorators = [(0, typeorm_1.Column)()];
        _data_nascimento_decorators = [(0, typeorm_1.Column)({ type: 'date' })];
        _data_cadastro_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })];
        _status_decorators = [(0, typeorm_1.Column)({ default: true })];
        _usuarioSistemas_decorators = [(0, typeorm_1.OneToMany)(() => UsuarioSistema_1.UsuarioSistema, (usuarioSistema) => usuarioSistema.usuario)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _nome_completo_decorators, { kind: "field", name: "nome_completo", static: false, private: false, access: { has: obj => "nome_completo" in obj, get: obj => obj.nome_completo, set: (obj, value) => { obj.nome_completo = value; } }, metadata: _metadata }, _nome_completo_initializers, _nome_completo_extraInitializers);
        __esDecorate(null, null, _email_decorators, { kind: "field", name: "email", static: false, private: false, access: { has: obj => "email" in obj, get: obj => obj.email, set: (obj, value) => { obj.email = value; } }, metadata: _metadata }, _email_initializers, _email_extraInitializers);
        __esDecorate(null, null, _senha_decorators, { kind: "field", name: "senha", static: false, private: false, access: { has: obj => "senha" in obj, get: obj => obj.senha, set: (obj, value) => { obj.senha = value; } }, metadata: _metadata }, _senha_initializers, _senha_extraInitializers);
        __esDecorate(null, null, _empresa_decorators, { kind: "field", name: "empresa", static: false, private: false, access: { has: obj => "empresa" in obj, get: obj => obj.empresa, set: (obj, value) => { obj.empresa = value; } }, metadata: _metadata }, _empresa_initializers, _empresa_extraInitializers);
        __esDecorate(null, null, _telefone_decorators, { kind: "field", name: "telefone", static: false, private: false, access: { has: obj => "telefone" in obj, get: obj => obj.telefone, set: (obj, value) => { obj.telefone = value; } }, metadata: _metadata }, _telefone_initializers, _telefone_extraInitializers);
        __esDecorate(null, null, _setor_decorators, { kind: "field", name: "setor", static: false, private: false, access: { has: obj => "setor" in obj, get: obj => obj.setor, set: (obj, value) => { obj.setor = value; } }, metadata: _metadata }, _setor_initializers, _setor_extraInitializers);
        __esDecorate(null, null, _cargo_decorators, { kind: "field", name: "cargo", static: false, private: false, access: { has: obj => "cargo" in obj, get: obj => obj.cargo, set: (obj, value) => { obj.cargo = value; } }, metadata: _metadata }, _cargo_initializers, _cargo_extraInitializers);
        __esDecorate(null, null, _data_nascimento_decorators, { kind: "field", name: "data_nascimento", static: false, private: false, access: { has: obj => "data_nascimento" in obj, get: obj => obj.data_nascimento, set: (obj, value) => { obj.data_nascimento = value; } }, metadata: _metadata }, _data_nascimento_initializers, _data_nascimento_extraInitializers);
        __esDecorate(null, null, _data_cadastro_decorators, { kind: "field", name: "data_cadastro", static: false, private: false, access: { has: obj => "data_cadastro" in obj, get: obj => obj.data_cadastro, set: (obj, value) => { obj.data_cadastro = value; } }, metadata: _metadata }, _data_cadastro_initializers, _data_cadastro_extraInitializers);
        __esDecorate(null, null, _status_decorators, { kind: "field", name: "status", static: false, private: false, access: { has: obj => "status" in obj, get: obj => obj.status, set: (obj, value) => { obj.status = value; } }, metadata: _metadata }, _status_initializers, _status_extraInitializers);
        __esDecorate(null, null, _usuarioSistemas_decorators, { kind: "field", name: "usuarioSistemas", static: false, private: false, access: { has: obj => "usuarioSistemas" in obj, get: obj => obj.usuarioSistemas, set: (obj, value) => { obj.usuarioSistemas = value; } }, metadata: _metadata }, _usuarioSistemas_initializers, _usuarioSistemas_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        User = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return User = _classThis;
})();
exports.User = User;
