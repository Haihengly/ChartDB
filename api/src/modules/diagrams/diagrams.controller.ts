import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus, UseGuards } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { CurrentUser } from '../auth/current-user.decorator';
import { UserEntity } from '../../entities/user.entity';

@Controller('diagrams')
@UseGuards(JwtAuthGuard)
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  async create(@Body() createDiagramDto: CreateDiagramDto, @CurrentUser() user: UserEntity) {
    return this.diagramsService.create(createDiagramDto, user.id);
  }

  @Get()
  async findAll(@CurrentUser() user: UserEntity) {
    return this.diagramsService.findAll(user.id);
  }

  @Get(':id')
  async findOne(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.diagramsService.findOne(id, user.id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDiagramDto: UpdateDiagramDto, @CurrentUser() user: UserEntity) {
    return this.diagramsService.update(id, updateDiagramDto, user.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string, @CurrentUser() user: UserEntity) {
    return this.diagramsService.remove(id, user.id);
  }
}
