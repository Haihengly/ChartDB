import { Entity, PrimaryColumn, Column, CreateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { ProjectEntity } from './project.entity';
import { UserEntity } from './user.entity';

export enum ProjectRole {
  OWNER = 'owner',
  EDITOR = 'editor',
}

@Entity('project_members')
export class ProjectMemberEntity {
  @PrimaryColumn({ name: 'project_id', type: 'uuid' })
  projectId: string;

  @PrimaryColumn({ name: 'user_id', type: 'uuid' })
  userId: string;

  @Column({
    type: 'enum',
    enum: ProjectRole,
    default: ProjectRole.EDITOR,
  })
  role: ProjectRole;

  @CreateDateColumn({ name: 'joined_at' })
  joinedAt: Date;

  @ManyToOne(() => ProjectEntity, (project) => project.members, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'project_id' })
  project: ProjectEntity;

  @ManyToOne(() => UserEntity, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserEntity;
}
