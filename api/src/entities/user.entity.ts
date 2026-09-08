import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany } from 'typeorm';
import { ProjectMemberEntity } from './project-member.entity';
import { ProjectEntity } from './project.entity';

@Entity('users')
export class UserEntity {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column({ select: false })
  password: string;

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @OneToMany(() => ProjectMemberEntity, (member) => member.user)
  memberships: ProjectMemberEntity[];

  @OneToMany(() => ProjectEntity, (project) => project.createdBy)
  createdProjects: ProjectEntity[];
}
