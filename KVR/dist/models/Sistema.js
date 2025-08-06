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
exports.Sistema = void 0;
const typeorm_1 = require("typeorm");
const UsuarioSistema_1 = require("./UsuarioSistema");
let Sistema = (() => {
    let _classDecorators = [(0, typeorm_1.Entity)()];
    let _classDescriptor;
    let _classExtraInitializers = [];
    let _classThis;
    let _id_decorators;
    let _id_initializers = [];
    let _id_extraInitializers = [];
    let _nome_decorators;
    let _nome_initializers = [];
    let _nome_extraInitializers = [];
    let _empresa_decorators;
    let _empresa_initializers = [];
    let _empresa_extraInitializers = [];
    let _perfis_decorators;
    let _perfis_initializers = [];
    let _perfis_extraInitializers = [];
    let _descricao_decorators;
    let _descricao_initializers = [];
    let _descricao_extraInitializers = [];
    let _url_decorators;
    let _url_initializers = [];
    let _url_extraInitializers = [];
    let _ativo_decorators;
    let _ativo_initializers = [];
    let _ativo_extraInitializers = [];
    let _data_cadastro_decorators;
    let _data_cadastro_initializers = [];
    let _data_cadastro_extraInitializers = [];
    let _usuarioSistemas_decorators;
    let _usuarioSistemas_initializers = [];
    let _usuarioSistemas_extraInitializers = [];
    var Sistema = _classThis = class {
        constructor() {
            this.id = __runInitializers(this, _id_initializers, void 0);
            this.nome = (__runInitializers(this, _id_extraInitializers), __runInitializers(this, _nome_initializers, void 0));
            this.empresa = (__runInitializers(this, _nome_extraInitializers), __runInitializers(this, _empresa_initializers, void 0));
            this.perfis = (__runInitializers(this, _empresa_extraInitializers), __runInitializers(this, _perfis_initializers, void 0));
            this.descricao = (__runInitializers(this, _perfis_extraInitializers), __runInitializers(this, _descricao_initializers, void 0));
            this.url = (__runInitializers(this, _descricao_extraInitializers), __runInitializers(this, _url_initializers, void 0));
            this.ativo = (__runInitializers(this, _url_extraInitializers), __runInitializers(this, _ativo_initializers, void 0));
            this.data_cadastro = (__runInitializers(this, _ativo_extraInitializers), __runInitializers(this, _data_cadastro_initializers, void 0));
            this.usuarioSistemas = (__runInitializers(this, _data_cadastro_extraInitializers), __runInitializers(this, _usuarioSistemas_initializers, void 0));
            __runInitializers(this, _usuarioSistemas_extraInitializers);
        }
    };
    __setFunctionName(_classThis, "Sistema");
    (() => {
        const _metadata = typeof Symbol === "function" && Symbol.metadata ? Object.create(null) : void 0;
        _id_decorators = [(0, typeorm_1.PrimaryGeneratedColumn)()];
        _nome_decorators = [(0, typeorm_1.Column)()];
        _empresa_decorators = [(0, typeorm_1.Column)()];
        _perfis_decorators = [(0, typeorm_1.Column)()];
        _descricao_decorators = [(0, typeorm_1.Column)()];
        _url_decorators = [(0, typeorm_1.Column)()];
        _ativo_decorators = [(0, typeorm_1.Column)({ default: true })];
        _data_cadastro_decorators = [(0, typeorm_1.Column)({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })];
        _usuarioSistemas_decorators = [(0, typeorm_1.OneToMany)(() => UsuarioSistema_1.UsuarioSistema, (usuarioSistema) => usuarioSistema.sistema)];
        __esDecorate(null, null, _id_decorators, { kind: "field", name: "id", static: false, private: false, access: { has: obj => "id" in obj, get: obj => obj.id, set: (obj, value) => { obj.id = value; } }, metadata: _metadata }, _id_initializers, _id_extraInitializers);
        __esDecorate(null, null, _nome_decorators, { kind: "field", name: "nome", static: false, private: false, access: { has: obj => "nome" in obj, get: obj => obj.nome, set: (obj, value) => { obj.nome = value; } }, metadata: _metadata }, _nome_initializers, _nome_extraInitializers);
        __esDecorate(null, null, _empresa_decorators, { kind: "field", name: "empresa", static: false, private: false, access: { has: obj => "empresa" in obj, get: obj => obj.empresa, set: (obj, value) => { obj.empresa = value; } }, metadata: _metadata }, _empresa_initializers, _empresa_extraInitializers);
        __esDecorate(null, null, _perfis_decorators, { kind: "field", name: "perfis", static: false, private: false, access: { has: obj => "perfis" in obj, get: obj => obj.perfis, set: (obj, value) => { obj.perfis = value; } }, metadata: _metadata }, _perfis_initializers, _perfis_extraInitializers);
        __esDecorate(null, null, _descricao_decorators, { kind: "field", name: "descricao", static: false, private: false, access: { has: obj => "descricao" in obj, get: obj => obj.descricao, set: (obj, value) => { obj.descricao = value; } }, metadata: _metadata }, _descricao_initializers, _descricao_extraInitializers);
        __esDecorate(null, null, _url_decorators, { kind: "field", name: "url", static: false, private: false, access: { has: obj => "url" in obj, get: obj => obj.url, set: (obj, value) => { obj.url = value; } }, metadata: _metadata }, _url_initializers, _url_extraInitializers);
        __esDecorate(null, null, _ativo_decorators, { kind: "field", name: "ativo", static: false, private: false, access: { has: obj => "ativo" in obj, get: obj => obj.ativo, set: (obj, value) => { obj.ativo = value; } }, metadata: _metadata }, _ativo_initializers, _ativo_extraInitializers);
        __esDecorate(null, null, _data_cadastro_decorators, { kind: "field", name: "data_cadastro", static: false, private: false, access: { has: obj => "data_cadastro" in obj, get: obj => obj.data_cadastro, set: (obj, value) => { obj.data_cadastro = value; } }, metadata: _metadata }, _data_cadastro_initializers, _data_cadastro_extraInitializers);
        __esDecorate(null, null, _usuarioSistemas_decorators, { kind: "field", name: "usuarioSistemas", static: false, private: false, access: { has: obj => "usuarioSistemas" in obj, get: obj => obj.usuarioSistemas, set: (obj, value) => { obj.usuarioSistemas = value; } }, metadata: _metadata }, _usuarioSistemas_initializers, _usuarioSistemas_extraInitializers);
        __esDecorate(null, _classDescriptor = { value: _classThis }, _classDecorators, { kind: "class", name: _classThis.name, metadata: _metadata }, null, _classExtraInitializers);
        Sistema = _classThis = _classDescriptor.value;
        if (_metadata) Object.defineProperty(_classThis, Symbol.metadata, { enumerable: true, configurable: true, writable: true, value: _metadata });
        __runInitializers(_classThis, _classExtraInitializers);
    })();
    return Sistema = _classThis;
})();
exports.Sistema = Sistema;
