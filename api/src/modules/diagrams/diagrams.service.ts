import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { DiagramEntity } from '../../entities/diagram.entity';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DiagramsService {
  constructor(
    @InjectRepository(DiagramEntity)
    private diagramsRepository: Repository<DiagramEntity>,
  ) {}

  async create(createDiagramDto: CreateDiagramDto): Promise<DiagramEntity> {
    const diagram = this.diagramsRepository.create({
      id: createDiagramDto.id || uuidv4(),
      name: createDiagramDto.name,
      content: createDiagramDto.content,
    });
    return this.diagramsRepository.save(diagram);
  }

  async findAll(): Promise<DiagramEntity[]> {
    return this.diagramsRepository.find({
      order: { updatedAt: 'DESC' },
    });
  }

  async findOne(id: string): Promise<DiagramEntity> {
    const diagram = await this.diagramsRepository.findOne({ where: { id } });
    if (!diagram) {
      throw new NotFoundException(`Diagram with ID "${id}" not found`);
    }
    return diagram;
  }

  async update(id: string, updateDiagramDto: UpdateDiagramDto): Promise<DiagramEntity> {
    const diagram = await this.findOne(id);

    if (updateDiagramDto.name !== undefined) {
      diagram.name = updateDiagramDto.name;
    }
    if (updateDiagramDto.content !== undefined) {
      diagram.content = updateDiagramDto.content;
    }

    return this.diagramsRepository.save(diagram);
  }

  async remove(id: string): Promise<void> {
    const diagram = await this.findOne(id);
    await this.diagramsRepository.remove(diagram);
  }
}
