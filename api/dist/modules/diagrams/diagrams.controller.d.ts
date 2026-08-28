import { DiagramsService } from './diagrams.service';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
export declare class DiagramsController {
    private readonly diagramsService;
    constructor(diagramsService: DiagramsService);
    create(createDiagramDto: CreateDiagramDto): Promise<import("../../entities/diagram.entity").DiagramEntity>;
    findAll(): Promise<import("../../entities/diagram.entity").DiagramEntity[]>;
    findOne(id: string): Promise<import("../../entities/diagram.entity").DiagramEntity>;
    update(id: string, updateDiagramDto: UpdateDiagramDto): Promise<import("../../entities/diagram.entity").DiagramEntity>;
    remove(id: string): Promise<void>;
}
