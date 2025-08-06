# Documentação das Rotas de Autenticação

## POST /api/auth/login
Autentica um usuário e retorna um token JWT

**Request:**
```json
{
  "email": "string",
  "senha": "string"
}
```

**Resposta de sucesso (200):**
```json
{
  "token": "string"
}
```

**Resposta de erro (401):**
```json
{
  "message": "Credenciais inválidas"
}
```

---

## POST /api/auth/logout
Encerra a sessão do usuário

**Resposta de sucesso (200):**
```json
{
  "message": "Logout realizado com sucesso"
}
```

---

## GET /api/auth/validate
Valida um token JWT

**Headers:**
```
Authorization: Bearer <token>
```

**Resposta de sucesso (200):**
```json
{
  "valid": true
}
```

**Resposta de erro (401/403):**
```
Token inválido ou não fornecido
```

---

## Rotas Protegidas
Todas as rotas em `/api/users` e `/api/sistemas` requerem o header:
```
Authorization: Bearer <token>
```
