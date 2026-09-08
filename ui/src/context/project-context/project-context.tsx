import { createContext } from 'react';
import type { Project } from '@/lib/domain/project';
import { emptyFn } from '@/lib/utils';

export interface ProjectMember {
    userId: string;
    email: string;
    role: 'owner' | 'editor';
    joinedAt: string | Date;
}

export interface ProjectContext {
    projects: Project[];
    activeProject: Project | undefined;
    setActiveProject: (project: Project | undefined) => void;
    refreshProjects: () => Promise<void>;
    createProject: (name: string) => Promise<Project>;
    listMembers: (projectId: string) => Promise<ProjectMember[]>;
    addMember: (
        projectId: string,
        email: string,
        role: string
    ) => Promise<ProjectMember>;
    updateMemberRole: (
        projectId: string,
        userId: string,
        role: string
    ) => Promise<ProjectMember>;
    removeMember: (projectId: string, userId: string) => Promise<void>;
}

export const projectInitialValue: ProjectContext = {
    projects: [],
    activeProject: undefined,
    setActiveProject: emptyFn,
    refreshProjects: async () => {},
    createProject: async () => ({}) as Project,
    listMembers: async () => [],
    addMember: async () => ({}) as ProjectMember,
    updateMemberRole: async () => ({}) as ProjectMember,
    removeMember: async () => {},
};

export const projectContext =
    createContext<ProjectContext>(projectInitialValue);
