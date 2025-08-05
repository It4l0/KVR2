#!/bin/bash

# Rotina de Commit Automatizada
# Autor: Italo Silva Santos
# Data: $(date +%Y-%m-%d)

set -e  # Sair em caso de erro

# Cores para output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Função para exibir mensagens coloridas
print_info() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Verificar se estamos em um repositório Git
if ! git rev-parse --git-dir > /dev/null 2>&1; then
    print_error "Este diretório não é um repositório Git!"
    exit 1
fi

# Verificar se há mudanças para commit
if git diff --quiet && git diff --cached --quiet; then
    print_warning "Não há mudanças para fazer commit."
    exit 0
fi

print_info "=== ROTINA DE COMMIT ==="

# Mostrar status atual
print_info "Status atual do repositório:"
git status --short

echo ""

# Verificar arquivos não rastreados
untracked_files=$(git ls-files --others --exclude-standard)
if [ ! -z "$untracked_files" ]; then
    print_warning "Arquivos não rastreados encontrados:"
    echo "$untracked_files"
    echo ""
    read -p "Deseja adicionar todos os arquivos não rastreados? (y/N): " add_untracked
    if [[ $add_untracked =~ ^[Yy]$ ]]; then
        git add .
        print_success "Todos os arquivos foram adicionados."
    else
        read -p "Deseja adicionar arquivos específicos? (y/N): " add_specific
        if [[ $add_specific =~ ^[Yy]$ ]]; then
            print_info "Arquivos disponíveis:"
            git status --porcelain | grep "^??" | cut -c4-
            read -p "Digite os nomes dos arquivos (separados por espaço): " files_to_add
            if [ ! -z "$files_to_add" ]; then
                git add $files_to_add
                print_success "Arquivos adicionados: $files_to_add"
            fi
        fi
    fi
fi

# Verificar se há arquivos modificados não staged
modified_files=$(git diff --name-only)
if [ ! -z "$modified_files" ]; then
    print_warning "Arquivos modificados não staged:"
    echo "$modified_files"
    echo ""
    read -p "Deseja adicionar todas as modificações? (Y/n): " add_modifications
    if [[ ! $add_modifications =~ ^[Nn]$ ]]; then
        git add -u
        print_success "Modificações adicionadas."
    fi
fi

# Verificar se há algo para commit após as adições
if git diff --cached --quiet; then
    print_warning "Nenhuma mudança foi staged para commit."
    exit 0
fi

echo ""
print_info "Arquivos que serão commitados:"
git diff --cached --name-status

echo ""

# Tipos de commit convencionais
print_info "Tipos de commit disponíveis:"
echo "1. feat: Nova funcionalidade"
echo "2. fix: Correção de bug"
echo "3. docs: Documentação"
echo "4. style: Formatação, espaços em branco, etc"
echo "5. refactor: Refatoração de código"
echo "6. test: Adição ou correção de testes"
echo "7. chore: Tarefas de manutenção"
echo "8. perf: Melhoria de performance"
echo "9. ci: Integração contínua"
echo "10. build: Sistema de build"
echo "11. custom: Tipo personalizado"

echo ""
read -p "Escolha o tipo de commit (1-11): " commit_type

case $commit_type in
    1) type_prefix="feat" ;;
    2) type_prefix="fix" ;;
    3) type_prefix="docs" ;;
    4) type_prefix="style" ;;
    5) type_prefix="refactor" ;;
    6) type_prefix="test" ;;
    7) type_prefix="chore" ;;
    8) type_prefix="perf" ;;
    9) type_prefix="ci" ;;
    10) type_prefix="build" ;;
    11) 
        read -p "Digite o tipo personalizado: " type_prefix
        ;;
    *)
        print_error "Opção inválida!"
        exit 1
        ;;
esac

# Solicitar escopo (opcional)
read -p "Escopo do commit (opcional, ex: auth, api, ui): " scope

# Solicitar descrição
read -p "Descrição do commit: " description

if [ -z "$description" ]; then
    print_error "Descrição é obrigatória!"
    exit 1
fi

# Solicitar descrição detalhada (opcional)
read -p "Descrição detalhada (opcional, pressione Enter para pular): " detailed_description

# Construir mensagem de commit
if [ ! -z "$scope" ]; then
    commit_message="$type_prefix($scope): $description"
else
    commit_message="$type_prefix: $description"
fi

if [ ! -z "$detailed_description" ]; then
    commit_message="$commit_message

$detailed_description"
fi

echo ""
print_info "Mensagem do commit:"
echo "---"
echo "$commit_message"
echo "---"

echo ""
read -p "Confirma o commit? (Y/n): " confirm_commit

if [[ $confirm_commit =~ ^[Nn]$ ]]; then
    print_warning "Commit cancelado."
    exit 0
fi

# Fazer o commit
git commit -m "$commit_message"
print_success "Commit realizado com sucesso!"

# Perguntar sobre push
echo ""
read -p "Deseja fazer push para o repositório remoto? (y/N): " do_push

if [[ $do_push =~ ^[Yy]$ ]]; then
    # Verificar se há remote configurado
    if git remote | grep -q "origin"; then
        current_branch=$(git branch --show-current)
        print_info "Fazendo push para origin/$current_branch..."
        git push origin $current_branch
        print_success "Push realizado com sucesso!"
    else
        print_warning "Nenhum remote 'origin' configurado."
    fi
fi

print_success "Rotina de commit concluída!"
