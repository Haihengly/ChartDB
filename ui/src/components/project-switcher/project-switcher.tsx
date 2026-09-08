import React from 'react';
import { useProject } from '@/hooks/use-project';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu/dropdown-menu';
import { Button } from '@/components/button/button';
import { ChevronDown, Folder, Plus, Users } from 'lucide-react';
import { Badge } from '@/components/badge/badge';
import { useDialog } from '@/hooks/use-dialog';

export const ProjectSwitcher: React.FC = () => {
    const { projects, activeProject, setActiveProject } = useProject();
    const { openCreateProjectDialog, openProjectMembersDialog } = useDialog();

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="ghost" className="flex items-center gap-2">
                    <Folder className="size-4" />
                    <span className="max-w-[150px] truncate">
                        {activeProject?.name || 'Select Project'}
                    </span>
                    <ChevronDown className="size-4" />
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent className="w-64" align="start">
                <DropdownMenuLabel>Projects</DropdownMenuLabel>
                {projects.map((p) => (
                    <DropdownMenuItem
                        key={p.id}
                        className="flex cursor-pointer items-center justify-between"
                        onClick={() => setActiveProject(p)}
                    >
                        <span>{p.name}</span>
                        {p.id === activeProject?.id && (
                            <Badge variant="secondary">Active</Badge>
                        )}
                    </DropdownMenuItem>
                ))}
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    className="cursor-pointer"
                    onClick={openCreateProjectDialog}
                >
                    <Plus className="mr-2 size-4" />
                    Create Project
                </DropdownMenuItem>
                {activeProject && (
                    <DropdownMenuItem
                        className="cursor-pointer"
                        onClick={openProjectMembersDialog}
                    >
                        <Users className="mr-2 size-4" />
                        Manage Members
                    </DropdownMenuItem>
                )}
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
