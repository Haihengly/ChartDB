import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { DiagramsController } from './diagrams.controller';
import { DiagramsService } from './diagrams.service';
import { DiagramEntity } from '../../entities/diagram.entity';

@Module({
  imports: [TypeOrmModule.forFeature([DiagramEntity])],
  controllers: [DiagramsController],
  providers: [DiagramsService],
  exports: [DiagramsService],
})
export class DiagramsModule {}