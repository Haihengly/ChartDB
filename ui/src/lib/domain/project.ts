export interface Project {
    id: string;
    name: string;
    createdAt: Date | string;
    createdById: string;
    role: 'owner' | 'editor';
    joinedAt: Date | string;
}
