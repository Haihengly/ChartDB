import { Controller, Get, Post, Put, Patch, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { ProjectsService } from './projects.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserEntity } from '../../entities/user.entity';
import { ProjectRole } from '../../entities/project-member.entity';
import { IsString, IsNotEmpty, IsEmail, IsEnum, IsOptional } from 'class-validator';

class CreateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

class AddMemberDto {
  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsEnum(ProjectRole)
  @IsOptional()
  role?: ProjectRole;
}

class UpdateMemberDto {
  @IsEnum(ProjectRole)
  @IsNotEmpty()
  role: ProjectRole;
}

class UpdateProjectDto {
  @IsString()
  @IsNotEmpty()
  name: string;
}

@Controller('projects')
@UseGuards(JwtAuthGuard)
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  async create(@Body() createProjectDto: CreateProjectDto, @CurrentUser() user: UserEntity) {
    const project = await this.projectsService.create(createProjectDto.name, user.id);
    return {
      id: project.id,
      name: project.name,
      createdById: project.createdById,
      createdAt: project.createdAt,
    };
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity) {
    return this.projectsService.findAll(user.id);
  }

  @Get(':id/members')
  async findMembers(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.projectsService.findMembers(id, user.id);
  }

  @Patch(':id')
  async update(@Param('id') id: string, @Body() updateProjectDto: UpdateProjectDto, @CurrentUser() user: UserEntity) {
    const project = await this.projectsService.update(id, updateProjectDto.name, user.id);
    return {
      id: project.id,
      name: project.name,
      createdById: project.createdById,
      createdAt: project.createdAt,
    };
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.projectsService.remove(id, user.id);
  }

  @Post(':id/members')
  async addMember(@Param('id') id: string, @Body() addMemberDto: AddMemberDto, @CurrentUser() user: UserEntity) {
    const role = addMemberDto.role || ProjectRole.EDITOR;
    return this.projectsService.addMember(id, addMemberDto.email, role, user.id);
  }

  @Delete(':id/members/:userId')
  @HttpCode(HttpStatus.NO_CONTENT)
  async removeMember(@Param('id') id: string, @Param('userId') userId: string, @CurrentUser() user: UserEntity) {
    return this.projectsService.removeMember(id, userId, user.id);
  }

  @Patch(':id/members/:userId')
  async updateMemberRole(@Param('id') id: string, @Param('userId') userId: string, @Body() updateMemberDto: UpdateMemberDto, @CurrentUser() user: UserEntity) {
    return this.projectsService.updateMemberRole(id, userId, updateMemberDto.role, user.id);
  }
}
