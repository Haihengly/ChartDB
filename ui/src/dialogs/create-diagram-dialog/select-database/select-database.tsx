import React from 'react';
import { Button } from '@/components/button/button';
import {
    DialogClose,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogInternalContent,
    DialogTitle,
} from '@/components/dialog/dialog';
import { DatabaseType } from '@/lib/domain/database-type';
import { useTranslation } from 'react-i18next';
import { SelectDatabaseContent } from './select-database-content';
import { useDialog } from '@/hooks/use-dialog';
import { useProject } from '@/hooks/use-project';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/select/select';
import { Label } from '@/components/label/label';
import { Folder } from 'lucide-react';

export interface SelectDatabaseProps {
    onContinue: () => void;
    databaseType: DatabaseType;
    setDatabaseType: React.Dispatch<React.SetStateAction<DatabaseType>>;
    hasExistingDiagram: boolean;
    createNewDiagram: () => void;
    selectedProjectId?: string;
    setSelectedProjectId: React.Dispatch<
        React.SetStateAction<string | undefined>
    >;
}

export const SelectDatabase: React.FC<SelectDatabaseProps> = ({
    onContinue,
    databaseType,
    setDatabaseType,
    hasExistingDiagram,
    createNewDiagram,
    selectedProjectId,
    setSelectedProjectId,
}) => {
    const { t } = useTranslation();
    const { openImportDiagramDialog } = useDialog();
    const { projects } = useProject();

    return (
        <>
            <DialogHeader>
                <DialogTitle>
                    {t('new_diagram_dialog.database_selection.title')}
                </DialogTitle>
                <DialogDescription>
                    {t('new_diagram_dialog.database_selection.description')}
                </DialogDescription>
            </DialogHeader>
            <DialogInternalContent>
                {projects.length > 0 && (
                    <div className="mb-4 flex flex-col gap-1.5 px-1">
                        <Label className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                            Project
                        </Label>
                        <Select
                            value={selectedProjectId || projects[0]?.id}
                            onValueChange={(val) => setSelectedProjectId(val)}
                        >
                            <SelectTrigger className="w-full">
                                <div className="flex items-center gap-2">
                                    <Folder className="size-4 text-muted-foreground" />
                                    <SelectValue placeholder="Select a project" />
                                </div>
                            </SelectTrigger>
                            <SelectContent>
                                {projects.map((project) => (
                                    <SelectItem
                                        key={project.id}
                                        value={project.id}
                                    >
                                        {project.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                    </div>
                )}
                <SelectDatabaseContent
                    databaseType={databaseType}
                    onContinue={onContinue}
                    setDatabaseType={setDatabaseType}
                />
            </DialogInternalContent>
            <DialogFooter className="mt-4 flex !justify-between gap-2">
                <div className="flex gap-2">
                    <DialogClose asChild>
                        <Button type="button" variant="secondary">
                            {t('new_diagram_dialog.cancel')}
                        </Button>
                    </DialogClose>
                    {!hasExistingDiagram && (
                        <Button
                            type="button"
                            variant="ghost"
                            onClick={openImportDiagramDialog}
                        >
                            {t('new_diagram_dialog.import_from_file')}
                        </Button>
                    )}
                </div>
                <div className="flex flex-col-reverse gap-2 sm:flex-row sm:justify-end sm:space-x-2">
                    <Button
                        type="button"
                        variant="outline"
                        onClick={createNewDiagram}
                        disabled={databaseType === DatabaseType.GENERIC}
                    >
                        {t('new_diagram_dialog.empty_diagram')}
                    </Button>
                    <Button
                        type="button"
                        variant="default"
                        disabled={databaseType === DatabaseType.GENERIC}
                        onClick={onContinue}
                    >
                        {t('new_diagram_dialog.continue')}
                    </Button>
                </div>
            </DialogFooter>
        </>
    );
};
