import { Controller, Get, Post, Put, Delete, Param, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { DiagramsService } from './diagrams.service';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';

@Controller('diagrams')
export class DiagramsController {
  constructor(private readonly diagramsService: DiagramsService) {}

  @Post()
  async create(@Body() createDiagramDto: CreateDiagramDto) {
    return this.diagramsService.create(createDiagramDto);
  }

  @Get()
  async findAll() {
    return this.diagramsService.findAll();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return this.diagramsService.findOne(id);
  }

  @Put(':id')
  async update(@Param('id') id: string, @Body() updateDiagramDto: UpdateDiagramDto) {
    return this.diagramsService.update(id, updateDiagramDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async remove(@Param('id') id: string) {
    return this.diagramsService.remove(id);
  }
}