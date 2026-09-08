import { Injectable, NotFoundException, ForbiddenException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { ProjectEntity } from '../../entities/project.entity';
import { ProjectMemberEntity, ProjectRole } from '../../entities/project-member.entity';
import { UserEntity } from '../../entities/user.entity';

@Injectable()
export class ProjectsService {
  constructor(
    @InjectRepository(ProjectEntity)
    private projectsRepository: Repository<ProjectEntity>,
    @InjectRepository(ProjectMemberEntity)
    private projectMembersRepository: Repository<ProjectMemberEntity>,
    @InjectRepository(UserEntity)
    private usersRepository: Repository<UserEntity>,
  ) {}

  async create(name: string, userId: string): Promise<ProjectEntity> {
    const project = this.projectsRepository.create({ name, createdById: userId });
    const savedProject = await this.projectsRepository.save(project);
    const member = this.projectMembersRepository.create({
      projectId: savedProject.id,
      userId: userId,
      role: ProjectRole.OWNER,
    });
    await this.projectMembersRepository.save(member);
    return savedProject;
  }

  async findAll(userId: string): Promise<any[]> {
    return this.projectMembersRepository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.project', 'project')
      .where('member.userId = :userId', { userId })
      .select([
        'project.id AS id',
        'project.name AS name',
        'project.created_at AS "createdAt"',
        'project.created_by AS "createdById"',
        'member.role AS role',
        'member.joined_at AS "joinedAt"',
      ])
      .getRawMany();
  }

  async findMembers(projectId: string, currentUserId: string): Promise<any[]> {
    await this.ensureMember(projectId, currentUserId);
    return this.projectMembersRepository
      .createQueryBuilder('member')
      .innerJoinAndSelect('member.user', 'user')
      .where('member.projectId = :projectId', { projectId })
      .select([
        'user.id AS "userId"',
        'user.email AS email',
        'member.role AS role',
        'member.joined_at AS "joinedAt"',
      ])
      .getRawMany();
  }

  async addMember(projectId: string, email: string, role: ProjectRole, currentUserId: string): Promise<any> {
    await this.ensureOwner(projectId, currentUserId);
    const user = await this.usersRepository.findOne({ where: { email } });
    if (!user) {
      throw new NotFoundException('No user found with that email.');
    }
    const existing = await this.projectMembersRepository.findOne({ where: { projectId, userId: user.id } });
    if (existing) {
      throw new ConflictException('User is already a member of this project.');
    }
    const member = this.projectMembersRepository.create({ projectId, userId: user.id, role });
    await this.projectMembersRepository.save(member);
    return { userId: user.id, email: user.email, role: member.role, joinedAt: member.joinedAt };
  }

  async removeMember(projectId: string, userId: string, currentUserId: string): Promise<void> {
    await this.ensureOwner(projectId, currentUserId);

    // Check if removing the last owner
    const owners = await this.projectMembersRepository.find({ where: { projectId, role: ProjectRole.OWNER } });
    if (owners.length === 1 && owners[0].userId === userId) {
        throw new BadRequestException('Cannot remove the sole owner of the project.');
    }

    const member = await this.projectMembersRepository.findOne({ where: { projectId, userId } });
    if (!member) throw new NotFoundException('Member not found.');
    await this.projectMembersRepository.remove(member);
  }

  async updateMemberRole(projectId: string, userId: string, role: ProjectRole, currentUserId: string): Promise<any> {
    await this.ensureOwner(projectId, currentUserId);

    // Check if demoting the last owner
    if (role === ProjectRole.EDITOR) {
        const owners = await this.projectMembersRepository.find({ where: { projectId, role: ProjectRole.OWNER } });
        if (owners.length === 1 && owners[0].userId === userId) {
            throw new BadRequestException('Cannot demote the sole owner of the project.');
        }
    }

    const member = await this.projectMembersRepository.findOne({ where: { projectId, userId } });
    if (!member) throw new NotFoundException('Member not found.');
    member.role = role;
    await this.projectMembersRepository.save(member);
    return { userId: member.userId, role: member.role, joinedAt: member.joinedAt };
  }

  async ensureMember(projectId: string, userId: string): Promise<ProjectMemberEntity> {
    const member = await this.projectMembersRepository.findOne({ where: { projectId, userId } });
    if (!member) throw new ForbiddenException('Access denied.');
    return member;
  }

  async ensureOwner(projectId: string, userId: string): Promise<void> {
    const member = await this.ensureMember(projectId, userId);
    if (member.role !== ProjectRole.OWNER) throw new ForbiddenException('Only owner can perform this action.');
  }

  async ensureEditorOrOwner(projectId: string, userId: string): Promise<void> {
    // Both editor and owner can edit diagrams
    await this.ensureMember(projectId, userId);
  }
}
