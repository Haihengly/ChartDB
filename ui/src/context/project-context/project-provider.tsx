import React, { useCallback, useEffect, useState, useMemo } from 'react';
import { projectContext as ProjectContextBase } from './project-context';
import type { Project } from '@/lib/domain/project';
import { apiFetch } from '@/lib/api-fetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const ProjectProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    const [projects, setProjects] = useState<Project[]>([]);
    const [activeProject, setActiveProjectState] = useState<
        Project | undefined
    >();

    const refreshProjects = useCallback(async () => {
        try {
            const res = await apiFetch(`${API_URL}/projects`, {
                method: 'GET',
            });
            if (res.ok) {
                const data = await res.json();
                setProjects(data);

                // Initialize active project or update it if it exists
                const storedActiveId = localStorage.getItem(
                    'chartdb_active_project'
                );
                if (
                    storedActiveId &&
                    data.some((p: Project) => p.id === storedActiveId)
                ) {
                    setActiveProjectState(
                        data.find((p: Project) => p.id === storedActiveId)
                    );
                } else {
                    // Default to 'Personal' or the first available
                    const personal = data.find(
                        (p: Project) => p.name === 'Personal'
                    );
                    const defaultProj = personal || data[0];
                    if (defaultProj) {
                        setActiveProjectState(defaultProj);
                        localStorage.setItem(
                            'chartdb_active_project',
                            defaultProj.id
                        );
                    }
                }
            }
        } catch (err) {
            console.error('Failed to load projects', err);
        }
    }, []);

    useEffect(() => {
        const token = localStorage.getItem('auth_token');
        if (token) {
            refreshProjects();
        }
    }, [refreshProjects]);

    const setActiveProject = useCallback((project: Project | undefined) => {
        setActiveProjectState(project);
        if (project) {
            localStorage.setItem('chartdb_active_project', project.id);
        } else {
            localStorage.removeItem('chartdb_active_project');
        }
    }, []);

    const createProject = useCallback(
        async (name: string) => {
            const res = await apiFetch(`${API_URL}/projects`, {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) {
                throw new Error('Failed to create project');
            }
            const newProject = await res.json();
            await refreshProjects(); // get the updated list
            return newProject;
        },
        [refreshProjects]
    );

    const renameProject = useCallback(
        async (id: string, name: string) => {
            const res = await apiFetch(`${API_URL}/projects/${id}`, {
                method: 'PATCH',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ name }),
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'Failed to rename project');
            }
            const updatedProject = await res.json();
            await refreshProjects();
            return updatedProject;
        },
        [refreshProjects]
    );

    const deleteProject = useCallback(
        async (id: string) => {
            const res = await apiFetch(`${API_URL}/projects/${id}`, {
                method: 'DELETE',
            });
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'Failed to delete project');
            }

            setProjects((prev) => {
                const newProjects = prev.filter((p) => p.id !== id);
                if (activeProject?.id === id) {
                    // Update active project if we deleted it
                    const defaultProj =
                        newProjects.find((p) => p.name === 'Personal') ||
                        newProjects[0];
                    setActiveProjectState(defaultProj);
                    if (defaultProj) {
                        localStorage.setItem(
                            'chartdb_active_project',
                            defaultProj.id
                        );
                    } else {
                        localStorage.removeItem('chartdb_active_project');
                    }
                }
                return newProjects;
            });
        },
        [activeProject]
    );

    const listMembers = useCallback(async (projectId: string) => {
        const res = await apiFetch(`${API_URL}/projects/${projectId}/members`);
        if (!res.ok) {
            throw new Error('Failed to fetch members');
        }
        return await res.json();
    }, []);

    const addMember = useCallback(
        async (projectId: string, email: string, role: string) => {
            const res = await apiFetch(
                `${API_URL}/projects/${projectId}/members`,
                {
                    method: 'POST',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ email, role }),
                }
            );
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'Failed to add member');
            }
            return await res.json();
        },
        []
    );

    const updateMemberRole = useCallback(
        async (projectId: string, userId: string, role: string) => {
            const res = await apiFetch(
                `${API_URL}/projects/${projectId}/members/${userId}`,
                {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: JSON.stringify({ role }),
                }
            );
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'Failed to update role');
            }
            return await res.json();
        },
        []
    );

    const removeMember = useCallback(
        async (projectId: string, userId: string) => {
            const res = await apiFetch(
                `${API_URL}/projects/${projectId}/members/${userId}`,
                {
                    method: 'DELETE',
                }
            );
            if (!res.ok) {
                const data = await res.json().catch(() => null);
                throw new Error(data?.message || 'Failed to remove member');
            }
        },
        []
    );

    const value = useMemo(
        () => ({
            projects,
            activeProject,
            setActiveProject,
            refreshProjects,
            createProject,
            renameProject,
            deleteProject,
            listMembers,
            addMember,
            updateMemberRole,
            removeMember,
        }),
        [
            projects,
            activeProject,
            setActiveProject,
            refreshProjects,
            createProject,
            renameProject,
            deleteProject,
            listMembers,
            addMember,
            updateMemberRole,
            removeMember,
        ]
    );

    return (
        <ProjectContextBase.Provider value={value}>
            {children}
        </ProjectContextBase.Provider>
    );
};
