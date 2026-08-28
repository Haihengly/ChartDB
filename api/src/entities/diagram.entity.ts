import { Entity, PrimaryColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('diagrams')
export class DiagramEntity {
  @PrimaryColumn('varchar')
  id: string;

  @Column()
  name: string;

  @Column('jsonb')
  content: Record<string, unknown>;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
