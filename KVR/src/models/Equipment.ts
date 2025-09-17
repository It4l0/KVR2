import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';

// Representa um equipamento (computador ou periférico) usado por um usuário
// Campos essenciais + relacionamento opcional com usuário responsável
@Entity()
export class Equipment {
  @PrimaryGeneratedColumn()
  id!: number;

  // Tipo do equipamento: ex: 'computador', 'monitor', 'teclado', 'mouse', 'impressora'
  @Column()
  tipo!: string;

  // Identificação interna: patrimônio, serial, etc.
  @Column()
  identificacao!: string;

  // Marca/Modelo
  @Column({ type: 'varchar', nullable: true })
  marca?: string | null;

  @Column({ type: 'varchar', nullable: true })
  modelo?: string | null;

  // Observações livres
  @Column({ type: 'text', nullable: true })
  observacoes?: string | null;

  // Senha padrão técnica para gerenciamento de acesso (não selecionada por padrão)
  @Column({ type: 'varchar', nullable: true, select: false })
  senha_padrao?: string | null;

  // Status de uso/ativo
  @Column({ default: true })
  ativo!: boolean;

  // Relacionamento opcional com usuário atual responsável
  @ManyToOne(() => User, { nullable: true })
  @JoinColumn({ name: 'usuarioId' })
  usuario?: User | null;

  // Datas
  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro!: Date;
}
