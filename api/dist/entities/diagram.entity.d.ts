import { UserEntity } from './user.entity';
export declare class DiagramEntity {
    id: string;
    name: string;
    content: Record<string, unknown>;
    userId: string | null;
    user: UserEntity | null;
    createdAt: Date;
    updatedAt: Date;
}
