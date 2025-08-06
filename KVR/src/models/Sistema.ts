import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn, OneToMany } from 'typeorm';
import { User } from './User';
import { UsuarioSistema } from './UsuarioSistema';

@Entity()
export class Sistema {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome!: string;

  @Column()
  empresa!: string;

  @Column()
  perfis!: string;

  @Column()
  descricao!: string;

  @Column()
  url!: string;

  @Column({ default: true })
  ativo!: boolean;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro!: Date;

  @OneToMany(() => UsuarioSistema, (usuarioSistema) => usuarioSistema.sistema)
  usuarioSistemas!: UsuarioSistema[];
}
