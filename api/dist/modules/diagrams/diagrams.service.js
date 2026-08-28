"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DiagramsService = void 0;
const common_1 = require("@nestjs/common");
const typeorm_1 = require("@nestjs/typeorm");
const typeorm_2 = require("typeorm");
const diagram_entity_1 = require("../../entities/diagram.entity");
const uuid_1 = require("uuid");
let DiagramsService = class DiagramsService {
    constructor(diagramsRepository) {
        this.diagramsRepository = diagramsRepository;
    }
    async create(createDiagramDto) {
        const diagram = this.diagramsRepository.create({
            id: createDiagramDto.id || (0, uuid_1.v4)(),
            name: createDiagramDto.name,
            content: createDiagramDto.content,
        });
        return this.diagramsRepository.save(diagram);
    }
    async findAll() {
        return this.diagramsRepository.find({
            order: { updatedAt: 'DESC' },
        });
    }
    async findOne(id) {
        const diagram = await this.diagramsRepository.findOne({ where: { id } });
        if (!diagram) {
            throw new common_1.NotFoundException(`Diagram with ID "${id}" not found`);
        }
        return diagram;
    }
    async update(id, updateDiagramDto) {
        const diagram = await this.findOne(id);
        if (updateDiagramDto.name !== undefined) {
            diagram.name = updateDiagramDto.name;
        }
        if (updateDiagramDto.content !== undefined) {
            diagram.content = updateDiagramDto.content;
        }
        return this.diagramsRepository.save(diagram);
    }
    async remove(id) {
        const diagram = await this.findOne(id);
        await this.diagramsRepository.remove(diagram);
    }
};
exports.DiagramsService = DiagramsService;
exports.DiagramsService = DiagramsService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, typeorm_1.InjectRepository)(diagram_entity_1.DiagramEntity)),
    __metadata("design:paramtypes", [typeorm_2.Repository])
], DiagramsService);
//# sourceMappingURL=diagrams.service.js.map