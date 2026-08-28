import { Repository } from 'typeorm';
import { DiagramEntity } from '../../entities/diagram.entity';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
export declare class DiagramsService {
    private diagramsRepository;
    constructor(diagramsRepository: Repository<DiagramEntity>);
    create(createDiagramDto: CreateDiagramDto): Promise<DiagramEntity>;
    findAll(): Promise<DiagramEntity[]>;
    findOne(id: string): Promise<DiagramEntity>;
    update(id: string, updateDiagramDto: UpdateDiagramDto): Promise<DiagramEntity>;
    remove(id: string): Promise<void>;
}
