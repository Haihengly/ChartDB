import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import {
    ChevronDown,
    ChevronRight,
    Folder,
    Plus,
    Users,
    LayoutTemplate,
    FileText,
} from 'lucide-react';
import { useProject } from '@/hooks/use-project';
import { useStorage } from '@/hooks/use-storage';
import { useDialog } from '@/hooks/use-dialog';
import { Button } from '@/components/button/button';
import { Badge } from '@/components/badge/badge';
import { useNavigate, useParams } from 'react-router-dom';
import type { Diagram } from '@/lib/domain/diagram';
import { ProjectRowActionsMenu } from './project-row-actions-menu';
import { DiagramRowActionsMenu } from '@/dialogs/open-diagram-dialog/diagram-row-actions-menu/diagram-row-actions-menu';

export const ProjectsSection: React.FC = () => {
    const { t } = useTranslation();
    const { projects, listMembers, setActiveProject } = useProject();
    const { listDiagrams } = useStorage();
    const { openCreateProjectDialog, openProjectMembersDialog } = useDialog();
    const navigate = useNavigate();
    const { diagramId } = useParams<{ diagramId: string }>();

    const [memberCounts, setMemberCounts] = useState<Record<string, number>>(
        {}
    );
    const [projectDiagrams, setProjectDiagrams] = useState<
        Record<string, Diagram[]>
    >({});
    const [expandedProjects, setExpandedProjects] = useState<
        Record<string, boolean>
    >({});

    const fetchProjectData = useCallback(async () => {
        await Promise.all(
            projects.map(async (project) => {
                // Fetch members
                try {
                    const members = await listMembers(project.id);
                    setMemberCounts((prev) => ({
                        ...prev,
                        [project.id]: members.length,
                    }));
                } catch (error) {
                    console.error(
                        'Failed to load members for project:',
                        project.id,
                        error
                    );
                }

                // Fetch diagrams
                try {
                    const diagrams = await listDiagrams({
                        projectId: project.id,
                        includeTables: true,
                    });
                    setProjectDiagrams((prev) => ({
                        ...prev,
                        [project.id]: diagrams,
                    }));

                    // Auto expand if project contains active diagram
                    if (diagramId && diagrams.some((d) => d.id === diagramId)) {
                        setExpandedProjects((prev) => ({
                            ...prev,
                            [project.id]: true,
                        }));
                    }
                } catch (error) {
                    console.error(
                        'Failed to load diagrams for project:',
                        project.id,
                        error
                    );
                }
            })
        );
    }, [projects, listDiagrams, listMembers, diagramId]);

    useEffect(() => {
        fetchProjectData();
    }, [fetchProjectData]);

    const refetch = async () => {
        await fetchProjectData();
    };

    const toggleProject = (projectId: string) => {
        setExpandedProjects((prev) => ({
            ...prev,
            [projectId]: !prev[projectId],
        }));
    };

    return (
        <div className="flex h-full flex-col overflow-hidden">
            <div className="flex items-center justify-between border-b p-2">
                <span className="text-sm font-semibold">
                    {t('projects.title', 'Projects')}
                </span>
                <Button
                    size="icon"
                    variant="ghost"
                    className="size-6"
                    onClick={openCreateProjectDialog}
                >
                    <Plus className="size-4" />
                </Button>
            </div>

            <div className="flex-1 overflow-y-auto p-2">
                {projects.length === 0 ? (
                    <div className="p-4 text-center text-sm text-muted-foreground">
                        {t(
                            'projects.no_projects',
                            'You have no projects yet — create one to get started'
                        )}
                    </div>
                ) : (
                    projects.map((project) => (
                        <div key={project.id} className="mb-1">
                            <div
                                className={`flex cursor-pointer items-center justify-between rounded-md p-1.5 hover:bg-secondary ${
                                    projectDiagrams[project.id]?.some(
                                        (d) => d.id === diagramId
                                    )
                                        ? 'bg-secondary/50 font-medium'
                                        : ''
                                }`}
                                onClick={() => toggleProject(project.id)}
                            >
                                <div className="flex flex-1 items-center overflow-hidden text-sm">
                                    {expandedProjects[project.id] ? (
                                        <ChevronDown className="mr-1 size-4 shrink-0 text-muted-foreground" />
                                    ) : (
                                        <ChevronRight className="mr-1 size-4 shrink-0 text-muted-foreground" />
                                    )}
                                    <Folder className="mr-2 size-4 shrink-0 text-muted-foreground" />
                                    <span className="truncate">
                                        {project.name}
                                    </span>
                                </div>
                                <div className="flex items-center gap-1">
                                    <Badge
                                        variant="secondary"
                                        className="flex shrink-0 items-center gap-1 rounded-full px-2 py-0.5 text-xs font-normal"
                                    >
                                        <FileText className="size-3" />
                                        {projectDiagrams[project.id]?.length ??
                                            0}
                                    </Badge>
                                    <Badge
                                        variant="secondary"
                                        className="flex shrink-0 cursor-pointer items-center gap-1 rounded-full px-2 py-0.5 text-xs font-normal hover:bg-primary/20"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            setActiveProject(project);
                                            openProjectMembersDialog();
                                        }}
                                    >
                                        <Users className="size-3" />
                                        {memberCounts[project.id] ?? '-'}
                                    </Badge>
                                    <ProjectRowActionsMenu project={project} />
                                </div>
                            </div>

                            {expandedProjects[project.id] && (
                                <div className="ml-[1.125rem] mt-1 border-l pl-2">
                                    {projectDiagrams[project.id]?.length ===
                                    0 ? (
                                        <div className="p-1.5 text-xs text-muted-foreground">
                                            {t(
                                                'projects.no_operations',
                                                'No diagrams'
                                            )}
                                        </div>
                                    ) : (
                                        projectDiagrams[project.id]?.map(
                                            (diagram) => (
                                                <div
                                                    key={diagram.id}
                                                    className={`group mb-0.5 flex cursor-pointer items-center rounded-md p-1.5 text-sm ${
                                                        diagram.id === diagramId
                                                            ? 'bg-primary/10 font-medium text-primary'
                                                            : 'text-muted-foreground hover:bg-secondary hover:text-foreground'
                                                    }`}
                                                    onClick={() =>
                                                        navigate(
                                                            `/diagrams/${diagram.id}`
                                                        )
                                                    }
                                                >
                                                    <LayoutTemplate
                                                        className={`mr-2 size-3.5 shrink-0 ${
                                                            diagram.id ===
                                                            diagramId
                                                                ? 'text-primary'
                                                                : 'text-muted-foreground group-hover:text-foreground'
                                                        }`}
                                                    />
                                                    <span className="flex-1 truncate">
                                                        {diagram.name}
                                                    </span>
                                                    <DiagramRowActionsMenu
                                                        diagram={diagram}
                                                        onOpen={() =>
                                                            navigate(
                                                                `/diagrams/${diagram.id}`
                                                            )
                                                        }
                                                        refetch={refetch}
                                                        numberOfDiagrams={
                                                            projectDiagrams[
                                                                project.id
                                                            ]?.length || 0
                                                        }
                                                        triggerClassName="opacity-0 group-hover:opacity-100"
                                                    />
                                                </div>
                                            )
                                        )
                                    )}
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};
