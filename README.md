# KVR Project

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
