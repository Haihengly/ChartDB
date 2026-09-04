import { DiagramsService } from './diagrams.service';
import { CreateDiagramDto, UpdateDiagramDto } from '../../dto/diagram.dto';
import { UserEntity } from '../../entities/user.entity';
export declare class DiagramsController {
    private readonly diagramsService;
    constructor(diagramsService: DiagramsService);
    create(createDiagramDto: CreateDiagramDto, user: UserEntity): Promise<import("../../entities/diagram.entity").DiagramEntity>;
    findAll(user: UserEntity): Promise<any[]>;
    findOne(id: string, user: UserEntity): Promise<import("../../entities/diagram.entity").DiagramEntity>;
    update(id: string, updateDiagramDto: UpdateDiagramDto, user: UserEntity): Promise<import("../../entities/diagram.entity").DiagramEntity>;
    remove(id: string, user: UserEntity): Promise<void>;
}
