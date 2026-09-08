import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { DiagramEntity } from '../../entities/diagram.entity';
import { ProjectEntity } from '../../entities/project.entity';
import { ProjectMemberEntity, ProjectRole } from '../../entities/project-member.entity';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
import { v4 as uuidv4 } from 'uuid';

@Injectable()
export class DiagramsService {
  constructor(
    @InjectRepository(DiagramEntity)
    private diagramsRepository: Repository<DiagramEntity>,
    @InjectRepository(ProjectEntity)
    private projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectMemberEntity)
    private projectMembersRepository: Repository<ProjectMemberEntity>,
  ) {}

  private async getPersonalProjectId(userId: string): Promise<string> {
    const personalProject = await this.projectsRepository
      .createQueryBuilder('p')
      .innerJoin('p.members', 'm')
      .where('m.userId = :userId', { userId })
      .andWhere('p.name = :name', { name: 'Personal' })
      .getOne();

    if (personalProject) {
      return personalProject.id;
    }

    const anyMembership = await this.projectMembersRepository.findOne({
      where: { userId },
    });

    if (anyMembership) {
      return anyMembership.projectId;
    }

    // Auto-create a default project if the user has no projects
    const newProj = this.projectsRepository.create({ name: 'Personal', createdById: userId });
    const savedProj = await this.projectsRepository.save(newProj);
    const member = this.projectMembersRepository.create({
      projectId: savedProj.id,
      userId: userId,
      role: ProjectRole.OWNER,
    });
    await this.projectMembersRepository.save(member);
    return savedProj.id;
  }

  private async checkProjectAccess(projectId: string, userId: string): Promise<ProjectMemberEntity> {
    const member = await this.projectMembersRepository.findOne({
      where: { projectId, userId },
    });
    if (!member) {
      throw new ForbiddenException('You do not have access to this project');
    }
    return member;
  }

  async create(createDiagramDto: CreateDiagramDto, userId: string): Promise<DiagramEntity> {
    let projectId = createDiagramDto.projectId;
    if (!projectId) {
      projectId = await this.getPersonalProjectId(userId);
    } else {
      await this.checkProjectAccess(projectId, userId);
    }

    const diagram = this.diagramsRepository.create({
      id: createDiagramDto.id || uuidv4(),
      name: createDiagramDto.name,
      content: createDiagramDto.content,
      projectId: projectId,
      createdById: userId,
    });
    return this.diagramsRepository.save(diagram);
  }

  async findAll(userId: string, projectId?: string): Promise<any[]> {
    let projectIds: string[] = [];

    if (projectId) {
      await this.checkProjectAccess(projectId, userId);
      projectIds = [projectId];
    } else {
      const memberships = await this.projectMembersRepository.find({
        where: { userId },
      });
      projectIds = memberships.map((m) => m.projectId);
      if (projectIds.length === 0) {
        return [];
      }
    }

    const rawData = await this.diagramsRepository
      .createQueryBuilder('diagram')
      .select([
        'diagram.id AS id',
        'diagram.name AS name',
        'diagram.createdAt AS "createdAt"',
        'diagram.updatedAt AS "updatedAt"',
        'diagram.projectId AS "projectId"',
        'diagram.createdById AS "createdById"',
      ])
      .addSelect("diagram.content->>'databaseType'", 'databaseType')
      .addSelect("diagram.content->>'databaseEdition'", 'databaseEdition')
      .addSelect(
        "jsonb_array_length(CASE WHEN jsonb_typeof(diagram.content->'tables') = 'array' THEN diagram.content->'tables' ELSE '[]'::jsonb END)",
        'tablesCount',
      )
      .where('diagram.projectId IN (:...projectIds)', { projectIds })
      .orderBy('diagram.updatedAt', 'DESC')
      .getRawMany();

    return rawData.map((row) => ({
      id: row.id,
      name: row.name,
      createdAt: row.createdAt,
      updatedAt: row.updatedAt,
      projectId: row.projectId,
      createdById: row.createdById,
      content: {
        databaseType: row.databaseType,
        databaseEdition: row.databaseEdition,
        tablesCount: parseInt(row.tablesCount || '0', 10),
      },
    }));
  }

  async findOne(id: string, userId: string): Promise<DiagramEntity> {
    const diagram = await this.diagramsRepository.findOne({ where: { id } });
    if (!diagram) {
      throw new NotFoundException(`Diagram with ID "${id}" not found`);
    }

    if (diagram.projectId) {
      await this.checkProjectAccess(diagram.projectId, userId);
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
