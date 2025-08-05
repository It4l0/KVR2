#!/usr/bin/env python3
"""
Rotina de Commit Automatizada - Versão Python
Autor: Italo Silva Santos
Data: 2025-08-04

Script alternativo em Python para automatizar commits com convenções padronizadas.
"""

import subprocess
import sys
import os
from datetime import datetime
from typing import List, Optional

class Colors:
    RED = '\033[0;31m'
    GREEN = '\033[0;32m'
    YELLOW = '\033[1;33m'
    BLUE = '\033[0;34m'
    NC = '\033[0m'  # No Color

class CommitRoutine:
    def __init__(self):
        self.commit_types = {
            '1': ('feat', 'Nova funcionalidade'),
            '2': ('fix', 'Correção de bug'),
            '3': ('docs', 'Documentação'),
            '4': ('style', 'Formatação, espaços em branco, etc'),
            '5': ('refactor', 'Refatoração de código'),
            '6': ('test', 'Adição ou correção de testes'),
            '7': ('chore', 'Tarefas de manutenção'),
            '8': ('perf', 'Melhoria de performance'),
            '9': ('ci', 'Integração contínua'),
            '10': ('build', 'Sistema de build'),
            '11': ('custom', 'Tipo personalizado')
        }

    def print_colored(self, message: str, color: str, prefix: str = ""):
        """Imprime mensagem colorida"""
        print(f"{color}[{prefix}]{Colors.NC} {message}")

    def print_info(self, message: str):
        self.print_colored(message, Colors.BLUE, "INFO")

    def print_success(self, message: str):
        self.print_colored(message, Colors.GREEN, "SUCCESS")

    def print_warning(self, message: str):
        self.print_colored(message, Colors.YELLOW, "WARNING")

    def print_error(self, message: str):
        self.print_colored(message, Colors.RED, "ERROR")

    def run_git_command(self, command: List[str]) -> tuple:
        """Executa comando git e retorna (success, output)"""
        try:
            result = subprocess.run(
                ['git'] + command, 
                capture_output=True, 
                text=True, 
                check=True
            )
            return True, result.stdout.strip()
        except subprocess.CalledProcessError as e:
            return False, e.stderr.strip()

    def check_git_repo(self) -> bool:
        """Verifica se estamos em um repositório Git"""
        success, _ = self.run_git_command(['rev-parse', '--git-dir'])
        return success

    def get_git_status(self) -> tuple:
        """Retorna status do git"""
        success, output = self.run_git_command(['status', '--porcelain'])
        return success, output

    def get_untracked_files(self) -> List[str]:
        """Retorna lista de arquivos não rastreados"""
        success, output = self.run_git_command(['ls-files', '--others', '--exclude-standard'])
        if success and output:
            return output.split('\n')
        return []

    def get_modified_files(self) -> List[str]:
        """Retorna lista de arquivos modificados"""
        success, output = self.run_git_command(['diff', '--name-only'])
        if success and output:
            return output.split('\n')
        return []

    def has_staged_changes(self) -> bool:
        """Verifica se há mudanças staged"""
        success, output = self.run_git_command(['diff', '--cached', '--quiet'])
        return not success  # Se falhou, há mudanças staged

    def has_unstaged_changes(self) -> bool:
        """Verifica se há mudanças não staged"""
        success, output = self.run_git_command(['diff', '--quiet'])
        return not success  # Se falhou, há mudanças não staged

    def show_commit_types(self):
        """Mostra os tipos de commit disponíveis"""
        self.print_info("Tipos de commit disponíveis:")
        for key, (type_name, description) in self.commit_types.items():
            print(f"{key}. {type_name}: {description}")

    def get_user_input(self, prompt: str, required: bool = False) -> str:
        """Obtém input do usuário"""
        while True:
            response = input(prompt).strip()
            if not required or response:
                return response
            self.print_error("Este campo é obrigatório!")

    def get_yes_no_input(self, prompt: str, default: bool = False) -> bool:
        """Obtém input sim/não do usuário"""
        suffix = " (Y/n): " if default else " (y/N): "
        response = input(prompt + suffix).strip().lower()
        
        if not response:
            return default
        return response in ['y', 'yes', 's', 'sim']

    def build_commit_message(self, commit_type: str, scope: str, description: str, detailed: str) -> str:
        """Constrói a mensagem de commit"""
        if scope:
            message = f"{commit_type}({scope}): {description}"
        else:
            message = f"{commit_type}: {description}"
        
        if detailed:
            message += f"\n\n{detailed}"
        
        return message

    def run(self):
        """Executa a rotina principal"""
        self.print_info("=== ROTINA DE COMMIT ===")
        
        # Verificar se é um repositório Git
        if not self.check_git_repo():
            self.print_error("Este diretório não é um repositório Git!")
            sys.exit(1)

        # Verificar se há mudanças
        if not self.has_unstaged_changes() and not self.has_staged_changes():
            self.print_warning("Não há mudanças para fazer commit.")
            sys.exit(0)

        # Mostrar status
        self.print_info("Status atual do repositório:")
        success, status = self.get_git_status()
        if success:
            print(status)

        print()

        # Lidar com arquivos não rastreados
        untracked = self.get_untracked_files()
        if untracked:
            self.print_warning("Arquivos não rastreados encontrados:")
            for file in untracked:
                print(f"  {file}")
            
            if self.get_yes_no_input("Deseja adicionar todos os arquivos não rastreados?"):
                self.run_git_command(['add', '.'])
                self.print_success("Todos os arquivos foram adicionados.")

        # Lidar com arquivos modificados
        modified = self.get_modified_files()
        if modified:
            self.print_warning("Arquivos modificados não staged:")
            for file in modified:
                print(f"  {file}")
            
            if self.get_yes_no_input("Deseja adicionar todas as modificações?", default=True):
                self.run_git_command(['add', '-u'])
                self.print_success("Modificações adicionadas.")

        # Verificar se há algo para commit
        if not self.has_staged_changes():
            self.print_warning("Nenhuma mudança foi staged para commit.")
            sys.exit(0)

        # Mostrar arquivos que serão commitados
        print()
        self.print_info("Arquivos que serão commitados:")
        success, staged = self.run_git_command(['diff', '--cached', '--name-status'])
        if success:
            print(staged)

        print()

        # Escolher tipo de commit
        self.show_commit_types()
        print()
        
        commit_choice = self.get_user_input("Escolha o tipo de commit (1-11): ", required=True)
        
        if commit_choice not in self.commit_types:
            self.print_error("Opção inválida!")
            sys.exit(1)

        if commit_choice == '11':
            commit_type = self.get_user_input("Digite o tipo personalizado: ", required=True)
        else:
            commit_type = self.commit_types[commit_choice][0]

        # Obter escopo
        scope = self.get_user_input("Escopo do commit (opcional, ex: auth, api, ui): ")

        # Obter descrição
        description = self.get_user_input("Descrição do commit: ", required=True)

        # Obter descrição detalhada
        detailed = self.get_user_input("Descrição detalhada (opcional): ")

        # Construir mensagem
        commit_message = self.build_commit_message(commit_type, scope, description, detailed)

        # Mostrar mensagem
        print()
        self.print_info("Mensagem do commit:")
        print("---")
        print(commit_message)
        print("---")

        # Confirmar commit
        print()
        if not self.get_yes_no_input("Confirma o commit?", default=True):
            self.print_warning("Commit cancelado.")
            sys.exit(0)

        # Fazer commit
        success, output = self.run_git_command(['commit', '-m', commit_message])
        if success:
            self.print_success("Commit realizado com sucesso!")
        else:
            self.print_error(f"Erro ao fazer commit: {output}")
            sys.exit(1)

        # Perguntar sobre push
        print()
        if self.get_yes_no_input("Deseja fazer push para o repositório remoto?"):
            # Verificar se há remote
            success, remotes = self.run_git_command(['remote'])
            if success and 'origin' in remotes:
                success, branch = self.run_git_command(['branch', '--show-current'])
                if success:
                    self.print_info(f"Fazendo push para origin/{branch}...")
                    push_success, push_output = self.run_git_command(['push', 'origin', branch])
                    if push_success:
                        self.print_success("Push realizado com sucesso!")
                    else:
                        self.print_error(f"Erro no push: {push_output}")
            else:
                self.print_warning("Nenhum remote 'origin' configurado.")

        self.print_success("Rotina de commit concluída!")

if __name__ == "__main__":
    routine = CommitRoutine()
    routine.run()
