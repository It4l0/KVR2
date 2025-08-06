# API REST com TypeScript

Projeto backend para sistema de autenticação e gerenciamento de usuários

## Tecnologias
- Node.js
- TypeScript
- Express
- TypeORM
- PostgreSQL
- JWT

## Configuração
1. Criar arquivo `.env` com as variáveis de ambiente
2. Executar `npm install`
3. Rodar migrations
4. Iniciar servidor com `npm run dev`

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

### Cadastro Interativo
- `cadastroUsuario.ts` - Cadastra usuários via terminal
- `cadastroSistema.ts` - Cadastra sistemas via terminal
- `buscarUsuario.ts` - Busca usuários por ID ou email

## Variáveis de Ambiente
Crie um arquivo `.env` com:
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=seu_usuario
DB_PASS=sua_senha
DB_NAME=seu_banco
JWT_SECRET=seu_secreto
```

## Instalação
1. `npm install`
2. Configure o PostgreSQL
3. `npm run dev` para iniciar

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
