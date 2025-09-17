# API REST com TypeScript

Projeto backend para sistema de autenticação e gerenciamento de usuários

## Tecnologias
- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT

## Configuração (Desenvolvimento)
1. Criar arquivo `.env` com as variáveis de ambiente (ver seção abaixo)
2. Executar `npm install`
3. Iniciar em modo desenvolvimento: `npm run dev`

Observações importantes:
- O projeto usa migrations oficiais do TypeORM (sem `synchronize`).
- Ao inicializar, o `DataSource` está configurado com `migrationsRun: true`, então as migrations pendentes serão aplicadas automaticamente.
- Há um seeder idempotente para criar/atualizar um usuário admin inicial.

## Endpoints

### Usuários
- `POST /api/users` - Cria novo usuário
- `GET /api/users` - Lista todos usuários
- `GET /api/users/:id` - Busca usuário por ID
- `PUT/PATCH /api/users/:id` - Atualiza usuário
- `DELETE /api/users/:id` - Remove usuário

### Sistemas
- `POST /api/sistemas` - Cria novo sistema
- `GET /api/sistemas` - Lista todos sistemas
- `GET /api/sistemas/:id` - Busca sistema por ID
- `PUT/PATCH /api/sistemas/:id` - Atualiza sistema
- `DELETE /api/sistemas/:id` - Remove sistema

## Scripts

### Seeds
- `npm run seed` — Executa o seeder de admin (`src/seeds/seedAdmin.ts`) usando `ts-node-dev`.
  - Usa `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD` se definidos; caso contrário, `admin@example.com` / `admin123`.

### Ferramentas interativas
- `src/scripts/cadastroUsuario.ts` — Cadastra usuários via terminal (opcional)
- `src/scripts/cadastroSistema.ts` — Cadastra sistemas via terminal (opcional)
- `src/scripts/buscarUsuario.ts` — Busca usuários por ID ou email (opcional)

## Variáveis de Ambiente
Crie um arquivo `.env` com:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=seu_banco
JWT_SECRET=seu_secreto
# Opcional (apenas para seed em dev):
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=admin123
```

## Instalação
1. `npm install`
2. Configure o PostgreSQL
3. `npm run dev` para iniciar

## Execução com Docker Compose (Produção/Dev)

O repositório raiz possui um `docker-compose.yml` que sobe:
- `gestuser-db` (Postgres) — Porta host 5434 → container 5432
- `gestuser-backend` (API) — Porta host 3003 → container 3000
- `gestuser-frontend` (Nginx) — Porta host 8081 → container 80

Comandos:
- Subir tudo (com rebuild):
  ```bash
  docker compose up -d --build
  ```
- Ver logs principais:
  ```bash
  docker logs -f gestuser-backend
  docker logs -f gestuser-frontend
  docker logs -f gestuser-db
  ```

Pipeline de inicialização do backend no Docker:
- O TypeORM aplica migrations automaticamente (`migrationsRun: true`).
- Em seguida, roda o seeder de admin (via `node dist/seeds/seedAdmin.js`).

Importante:
- Em produção, defina um `JWT_SECRET` forte via variáveis de ambiente.
- Personalize `SEED_ADMIN_EMAIL` / `SEED_ADMIN_PASSWORD` conforme necessário (somente para ambiente de desenvolvimento; evite manter credenciais padrão em produção).

## Modelos

### Usuário
- nome_completo
- email
- senha (criptografada)
- empresa
- telefone
- setor
- cargo
- data_nascimento
- data_cadastro
- status

### Sistema
- nome
- empresa
- perfis (string CSV)
- descricao
- url
- ativo
- data_cadastro

## Relacionamentos
- Usuário N:N Sistema (com tabela de relacionamento usuario_sistema)

## Testando no Postman

### Como obter um token JWT
1. Envie uma requisição POST para:
   ```
   POST http://localhost:3000/api/auth/login
   ```
   Com body JSON:
   ```json
   {
       "email": "usuário@exemplo.com",
       "senha": "senha123"
   }
   ```

### Requisições autenticadas
2. Use o token recebido no header:
   ```
   Authorization: Bearer <seu_token_jwt>
   ```

### Exemplos de rotas protegidas:
- Listar sistemas:
  ```
  GET http://localhost:3000/api/sistemas
  ```

- Detalhes de um sistema:
  ```
  GET http://localhost:3000/api/sistemas/1
  ```

- Criar novo sistema:
  ```
  POST http://localhost:3000/api/sistemas
  ```
  Com body JSON:
  ```json
  {
      "nome": "Novo Sistema",
      "descricao": "Descrição do sistema"
  }
  ```
