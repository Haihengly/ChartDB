import { Repository } from 'typeorm';
import { DiagramEntity } from '../../entities/diagram.entity';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
export declare class DiagramsService {
    private diagramsRepository;
    constructor(diagramsRepository: Repository<DiagramEntity>);
    create(createDiagramDto: CreateDiagramDto, userId: string): Promise<DiagramEntity>;
    findAll(userId: string): Promise<any[]>;
    findOne(id: string, userId: string): Promise<DiagramEntity>;
    update(id: string, updateDiagramDto: UpdateDiagramDto, userId: string): Promise<DiagramEntity>;
    remove(id: string, userId: string): Promise<void>;
}
