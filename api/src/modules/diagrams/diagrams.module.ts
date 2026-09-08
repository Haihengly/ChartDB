import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagramsController } from './diagrams.controller';
import { DiagramsService } from './diagrams.service';
import { DiagramEntity } from '../../entities/diagram.entity';
import { ProjectEntity } from '../../entities/project.entity';
import { ProjectMemberEntity } from '../../entities/project-member.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiagramEntity, ProjectEntity, ProjectMemberEntity])],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}
