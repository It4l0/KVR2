import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { User } from './User';
import { Sistema } from './Sistema';

@Entity()
export class UsuarioSistema {
  @PrimaryGeneratedColumn()
  id!: number;

  @ManyToOne(() => User, (user) => user.usuarioSistemas)
  @JoinColumn({ name: 'user_id' })
  usuario!: User;

  @ManyToOne(() => Sistema, (sistema) => sistema.usuarioSistemas)
  @JoinColumn({ name: 'sistema_id' })
  sistema!: Sistema;

  @Column()
  perfil!: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  data_cadastro!: Date;
}
