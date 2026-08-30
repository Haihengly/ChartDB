import { Injectable, NotFoundException, UnauthorizedException } from '@nestjs/common';
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

  async create(createDiagramDto: CreateDiagramDto, userId: string): Promise<DiagramEntity> {
    const diagram = this.diagramsRepository.create({
      id: createDiagramDto.id || uuidv4(),
      name: createDiagramDto.name,
      content: createDiagramDto.content,
      userId: userId,
    });
    return this.diagramsRepository.save(diagram);
  }

  async findAll(userId: string): Promise<DiagramEntity[]> {
    return this.diagramsRepository
      .createQueryBuilder('diagram')
      .where('diagram.userId = :userId', { userId })
      .orWhere('diagram.userId IS NULL')
      .orderBy('diagram.updatedAt', 'DESC')
      .getMany();
  }

  async findOne(id: string, userId: string): Promise<DiagramEntity> {
    const diagram = await this.diagramsRepository.findOne({ where: { id } });
    if (!diagram) {
      throw new NotFoundException(`Diagram with ID "${id}" not found`);
    }
    if (diagram.userId !== userId && diagram.userId !== null) {
      throw new UnauthorizedException('You do not have access to this diagram');
    }
    return diagram;
  }

  async update(id: string, updateDiagramDto: UpdateDiagramDto, userId: string): Promise<DiagramEntity> {
    const diagram = await this.findOne(id, userId);

    if (updateDiagramDto.name !== undefined) {
      diagram.name = updateDiagramDto.name;
    }
    if (updateDiagramDto.content !== undefined) {
      diagram.content = updateDiagramDto.content;
    }

    return this.diagramsRepository.save(diagram);
  }

  async remove(id: string, userId: string): Promise<void> {
    const diagram = await this.findOne(id, userId);
    await this.diagramsRepository.remove(diagram);
  }
}
