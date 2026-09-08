import React, { useCallback, useState } from 'react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu/dropdown-menu';
import { Button } from '@/components/button/button';
import {
    Ellipsis,
    Layers2,
    SquareArrowOutUpRight,
    Trash2,
    Pencil,
} from 'lucide-react';
import { useChartDB } from '@/hooks/use-chartdb';
import type { Diagram } from '@/lib/domain';
import { useStorage } from '@/hooks/use-storage';
import { cloneDiagram } from '@/lib/clone';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
    DialogClose,
    DialogDescription,
} from '@/components/dialog/dialog';
import { Input } from '@/components/input/input';
import { Label } from '@/components/label/label';

interface DiagramRowActionsMenuProps {
    diagram: Diagram;
    onOpen: () => void;
    refetch: () => void;
    numberOfDiagrams: number;
    triggerClassName?: string;
}

export const DiagramRowActionsMenu: React.FC<DiagramRowActionsMenuProps> = ({
    diagram,
    onOpen,
    refetch,
    numberOfDiagrams,
    triggerClassName,
}) => {
    const { diagramId, updateDiagramName } = useChartDB();
    const { deleteDiagram, addDiagram, updateDiagram } = useStorage();
    const { t } = useTranslation();
    const [isRenameOpen, setIsRenameOpen] = useState(false);
    const [nameInput, setNameInput] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);

    const onDelete = useCallback(async () => {
        deleteDiagram(diagram.id);
        refetch();

        if (diagram.id === diagramId || numberOfDiagrams <= 1) {
            window.location.href = '/';
        }
    }, [deleteDiagram, diagram.id, diagramId, refetch, numberOfDiagrams]);

    const onDuplicate = useCallback(async () => {
        const duplicatedDiagram = cloneDiagram(diagram);

        const diagramToAdd = duplicatedDiagram.diagram;

        if (!diagramToAdd) {
            return;
        }

        diagramToAdd.name = `${diagram.name} (Copy)`;

        addDiagram({ diagram: diagramToAdd });
        refetch();
    }, [addDiagram, refetch, diagram]);

    const onRenameClick = useCallback(
        (e: React.MouseEvent) => {
            e.preventDefault();
            e.stopPropagation();
            setNameInput(diagram.name);
            setIsRenameOpen(true);
        },
        [diagram.name]
    );

    const handleRenameSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        const trimmed = nameInput.trim();
        if (!trimmed || trimmed === diagram.name) {
            setIsRenameOpen(false);
            return;
        }
        setIsSubmitting(true);
        try {
            await updateDiagram({
                id: diagram.id,
                attributes: { name: trimmed },
            });
            if (diagram.id === diagramId) {
                updateDiagramName(trimmed);
            }
            refetch();
            setIsRenameOpen(false);
        } catch (error) {
            console.error('Failed to rename diagram:', error);
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
                        className={cn('size-8 p-0', triggerClassName)}
                        onClick={(e) => e.stopPropagation()}
                    >
                        <Ellipsis className="size-4" />
                    </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                    <DropdownMenuItem
                        onClick={onOpen}
                        className="flex justify-between gap-4"
                    >
                        {t('open_diagram_dialog.diagram_actions.open')}
                        <SquareArrowOutUpRight className="size-3.5" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={onDuplicate}
                        className="flex justify-between gap-4"
                    >
                        {t('open_diagram_dialog.diagram_actions.duplicate')}
                        <Layers2 className="size-3.5" />
                    </DropdownMenuItem>

                    <DropdownMenuItem
                        onClick={onRenameClick}
                        className="flex justify-between gap-4"
                    >
                        {t('open_diagram_dialog.diagram_actions.rename')}
                        <Pencil className="size-3.5" />
                    </DropdownMenuItem>

                    <DropdownMenuSeparator />
                    <DropdownMenuItem
                        onClick={onDelete}
                        className="flex justify-between gap-4 text-red-700"
                    >
                        {t('open_diagram_dialog.diagram_actions.delete')}
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
                            {t('open_diagram_dialog.diagram_actions.rename')}
                        </DialogTitle>
                        <DialogDescription className="sr-only">
                            Enter a new name for the diagram
                        </DialogDescription>
                    </DialogHeader>
                    <form
                        onSubmit={handleRenameSubmit}
                        className="flex flex-col gap-4 py-4"
                    >
                        <div className="flex flex-col gap-2">
                            <Label htmlFor="diagram-name" className="sr-only">
                                Diagram name
                            </Label>
                            <Input
                                id="diagram-name"
                                value={nameInput}
                                onChange={(e) => setNameInput(e.target.value)}
                                autoFocus
                            />
                        </div>
                        <DialogFooter>
                            <DialogClose asChild>
                                <Button type="button" variant="outline">
                                    {t('new_diagram_dialog.cancel')}
                                </Button>
                            </DialogClose>
                            <Button
                                type="submit"
                                disabled={!nameInput.trim() || isSubmitting}
                            >
                                {isSubmitting
                                    ? '...'
                                    : t(
                                          'open_diagram_dialog.diagram_actions.rename'
                                      )}
                            </Button>
                        </DialogFooter>
                    </form>
                </DialogContent>
            </Dialog>
        </>
    );
};
