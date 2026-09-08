import React, { useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu/dropdown-menu';
import { Button } from '@/components/button/button';
import { Ellipsis, Pencil, Trash2 } from 'lucide-react';
import { useProject } from '@/hooks/use-project';
import type { Project } from '@/lib/domain/project';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components/dialog/dialog';
import {
    AlertDialog,
    AlertDialogAction,
    AlertDialogCancel,
    AlertDialogContent,
    AlertDialogDescription,
    AlertDialogFooter,
    AlertDialogHeader,
    AlertDialogTitle,
} from '@/components/alert-dialog/alert-dialog';
import { Input } from '@/components/input/input';
import { Label } from '@/components/label/label';
import { useTranslation } from 'react-i18next';

interface ProjectRowActionsMenuProps {
    project: Project;
}

export const ProjectRowActionsMenu: React.FC<ProjectRowActionsMenuProps> = ({
    project,
}) => {
    const { renameProject, deleteProject } = useProject();
    const { t } = useTranslation();

    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [isDeleteOpen, setIsDeleteOpen] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    // If user is not an owner, hide/disable the menu or don't render actions
    const isOwner = project.role === 'owner';
    if (!isOwner) {
        return null;
    }

    const onRenameClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setNameInput(project.name);
        setIsRenameOpen(true);
    };

    const onDeleteClick = (e: React.MouseEvent) => {
        e.preventDefault();
        e.stopPropagation();
        setIsDeleteOpen(true);
    };

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = nameInput.trim();
        if (!trimmed || trimmed === project.name) {
            setIsRenameOpen(false);
            return;
        }
        setIsSubmitting(true);
        try {
            await renameProject(project.id, trimmed);
            setIsRenameOpen(false);
        } catch (error) {
            console.error('Failed to rename project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    const handleDeleteConfirm = async (e: React.MouseEvent) => {
        e.preventDefault();
        setIsSubmitting(true);
        try {
            await deleteProject(project.id);
            setIsDeleteOpen(false);
        } catch (error) {
            console.error('Failed to delete project:', error);
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <>
            <DropdownMenu>
                <DropdownMenuTrigger asChild>
                    <Button
                        variant="ghost"
                        size="icon"
                        className="size-6 p-0 hover:bg-muted"
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Ellipsis className="size-3.5" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent
                    align="end"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DropdownMenuItem
                        onClick={onRenameClick}
                        className="flex justify-between gap-4"
                    >
                        {t(
                            'open_diagram_dialog.diagram_actions.rename',
                            'Rename'
                        )}
                        <Pencil className="size-3.5" />
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={onDeleteClick}
                        className="flex justify-between gap-4 text-red-700 hover:text-red-700 focus:text-red-700"
                    >
                        {t(
                            'open_diagram_dialog.diagram_actions.delete',
                            'Delete'
                        )}
                        <Trash2 className="size-3.5 text-red-700" />
                    </DropdownMenuItem>
                </DropdownMenuContent>
            </DropdownMenu>

            <Dialog open={isRenameOpen} onOpenChange={setIsRenameOpen}>
                <DialogContent
                    showClose
                    className="sm:max-w-md"
                    onClick={(e) => e.stopPropagation()}
                >
                    <DialogHeader>
                        <DialogTitle>
                            {t('projects.rename_project', 'Rename Project')}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Enter a new name for the project
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleRenameSubmit}
                        className="flex flex-col gap-4 py-4"
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="project-name" className="sr-only">
                                Project name
                            </Label>
                            <Input
                                id="project-name"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    {t('new_diagram_dialog.cancel', 'Cancel')}
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={!nameInput.trim() || isSubmitting}
                            >
                                {isSubmitting
                                    ? '...'
                                    : t(
                                          'open_diagram_dialog.diagram_actions.rename',
                                          'Rename'
                                      )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>

            <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
                <AlertDialogContent onClick={(e) => e.stopPropagation()}>
                    <AlertDialogHeader>
                        <AlertDialogTitle>
                            {t(
                                'projects.delete_project_title',
                                'Delete Project'
                            )}
                        </AlertDialogTitle>
                        <AlertDialogDescription>
                            {t(
                                'projects.delete_project_description',
                                'Are you sure you want to delete this project? All diagrams inside this project will also be permanently deleted. This action cannot be undone.'
                            )}
                        </AlertDialogDescription>
                    </AlertDialogHeader>
                    <AlertDialogFooter>
                        <AlertDialogCancel>
                            {t('new_diagram_dialog.cancel', 'Cancel')}
                        </AlertDialogCancel>
                        <AlertDialogAction
                            onClick={handleDeleteConfirm}
                            disabled={isSubmitting}
                            className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                        >
                            {isSubmitting
                                ? '...'
                                : t(
                                      'open_diagram_dialog.diagram_actions.delete',
                                      'Delete'
                                  )}
                        </AlertDialogAction>
                    </AlertDialogFooter>
                </AlertDialogContent>
            </AlertDialog>
        </>
    );
};
