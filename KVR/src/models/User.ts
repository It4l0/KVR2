import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import { Sistema } from './Sistema';  
import { UsuarioSistema } from './UsuarioSistema';

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  id!: number;

  @Column()
  nome_completo!: string;

  @Column({ unique: true })
  email!: string;

  @Column()
  senha!: string;

  @Column()
  empresa!: string;

  @Column()
  telefone!: string;

  @Column()
  setor!: string;

  @Column()
  cargo!: string;

  @Column({ type: 'date' })
  data_nascimento!: Date;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro!: Date;

  @Column({ default: true })
  status!: boolean;

  @OneToMany(() => UsuarioSistema, (usuarioSistema) => usuarioSistema.usuario)
  usuarioSistemas!: UsuarioSistema[];
}
