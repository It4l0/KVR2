# KVR Project

## Visão Geral

Monorepo com:
- `Frontend/` (Vite + React, servido via Nginx em produção com proxy para `/api`).
- `KVR/` (Backend Node + TypeScript + Express + TypeORM + PostgreSQL), com migrations oficiais e seed idempotente do admin.
- `docker-compose.yml` na raiz para subir os três serviços: banco, backend e frontend.

## Rotina de Commit Automatizada

Este projeto inclui scripts automatizados para padronizar e agilizar o processo de commit seguindo convenções padronizadas.

### Scripts Disponíveis

#### 1. Script Bash (`commit.sh`)
```bash
./commit.sh
```

#### 2. Script Python (`commit.py`)
```bash
./commit.py
# ou
python3 commit.py
```

### Funcionalidades

- ✅ Verificação automática do status do repositório
- ✅ Adição interativa de arquivos não rastreados
- ✅ Staging automático de modificações
- ✅ Tipos de commit padronizados (Conventional Commits)
- ✅ Suporte a escopo e descrições detalhadas
- ✅ Push automático opcional
- ✅ Interface colorida e intuitiva

### Tipos de Commit Suportados

- `feat`: Nova funcionalidade
- `fix`: Correção de bug
- `docs`: Documentação
- `style`: Formatação, espaços em branco, etc
- `refactor`: Refatoração de código
- `test`: Adição ou correção de testes
- `chore`: Tarefas de manutenção
- `perf`: Melhoria de performance
- `ci`: Integração contínua
- `build`: Sistema de build
- `custom`: Tipo personalizado

### Como Usar

1. Faça suas modificações no código
2. Execute um dos scripts de commit:
   ```bash
   ./commit.sh
   # ou
   ./commit.py
   ```
3. Siga as instruções interativas:
   - Escolha adicionar arquivos não rastreados (se houver)
   - Confirme o staging de modificações
   - Selecione o tipo de commit
   - Adicione escopo (opcional)
   - Escreva a descrição
   - Adicione descrição detalhada (opcional)
   - Confirme o commit
   - Escolha fazer push (opcional)

### Exemplo de Mensagem de Commit

```
feat(auth): adicionar autenticação JWT

Implementa sistema de autenticação usando JSON Web Tokens
com middleware de validação e refresh token automático.
```

### Requisitos

- Git instalado e configurado
- Para o script Python: Python 3.6+
- Para o script Bash: Bash shell (padrão no macOS/Linux)

---

## Executando com Docker Compose

Serviços e portas:
- `gestuser-db` (Postgres): host `5434` → container `5432`
- `gestuser-backend` (API): host `3003` → container `3000`
- `gestuser-frontend` (Nginx): host `8081` → container `80`

Subir tudo (recomendado):
```bash
docker compose up -d --build
```

Logs úteis:
```bash
docker logs -f gestuser-backend
docker logs -f gestuser-frontend
docker logs -f gestuser-db
```

Acesso rápido:
- Frontend: http://localhost:8081/
- Backend: http://localhost:3003/

Observações importantes:
- O backend (`KVR/`) está configurado com `migrationsRun: true` no `src/config/database.ts`. As migrations em `src/migrations/*-*.ts` são aplicadas automaticamente na inicialização.
- Um seeder idempotente (`src/seeds/seedAdmin.ts`) cria/atualiza o admin inicial.
- Defina um `JWT_SECRET` forte em produção (configurado no `docker-compose.yml`).
- Você pode parametrizar o seed com `SEED_ADMIN_EMAIL` e `SEED_ADMIN_PASSWORD`.

## Variáveis de Ambiente (Backend)

Adicionar em `KVR/.env` (para rodar fora do Docker) ou configurar via Compose:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=gestuser
DB_PASS=gestuser
DB_NAME=gestuser
JWT_SECRET=um_segredo_forte
# Opcional (apenas para seed em dev)
SEED_ADMIN_EMAIL=admin@example.com
SEED_ADMIN_PASSWORD=admin123
```

## Frontend (dev local)

Para rodar o Frontend fora do Docker apontando para o backend local, crie `Frontend/.env` com:
```
VITE_API_URL=http://localhost:3000/api
```
E rode:
```bash
cd Frontend
npm install
npm run dev
```

## Backend (dev local)

```bash
cd KVR
npm install
npm run dev
# (Opcional) rodar seed manualmente
npm run seed
```

## Troubleshooting

- Se a porta 5434 (host) estiver ocupada, altere o mapeamento do Postgres no `docker-compose.yml`.
- "zsh: command not found: build": garanta que o comando esteja numa única linha: `docker compose up -d --build`.
- Para resetar o banco em Docker: `docker compose down && docker volume rm lovable_db_data && docker compose up -d --build`.
