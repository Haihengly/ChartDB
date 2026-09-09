import React, { useMemo } from 'react';
import { useChartDB } from '@/hooks/use-chartdb';
import { DiagramIcon } from '@/components/diagram-icon/diagram-icon';
import { useTranslation } from 'react-i18next';
import { cn } from '@/lib/utils';
import { labelVariants } from '@/components/label/label-variants';
import { useDialog } from '@/hooks/use-dialog';
import { useProject } from '@/hooks/use-project';

export interface DiagramNameProps {}

export const DiagramName: React.FC<DiagramNameProps> = () => {
    const { diagramName, currentDiagram } = useChartDB();
    const { projects } = useProject();
    const { t } = useTranslation();
    const { openOpenDiagramDialog } = useDialog();

    const projectName = useMemo(() => {
        const project = projects.find((p) => p.id === currentDiagram.projectId);
        return project?.name ?? t('open_diagram_dialog.personal_project');
    }, [projects, currentDiagram.projectId, t]);

    return (
        <div className="flex flex-1 flex-row items-center justify-center whitespace-nowrap px-2 py-1">
            <DiagramIcon
                databaseType={currentDiagram.databaseType}
                databaseEdition={currentDiagram.databaseEdition}
                onClick={(e) => {
                    e.stopPropagation();
                    openOpenDiagramDialog({ canClose: true });
                }}
            />
            <div className="flex flex-row items-center gap-1.5 overflow-hidden">
                <span
                    className="max-w-[180px] truncate text-sm font-medium text-muted-foreground"
                    title={projectName}
                >
                    {projectName}
                </span>
                <span className="select-none text-sm text-muted-foreground/60">
                    /
                </span>
                <span
                    className={cn(
                        labelVariants(),
                        'max-w-[220px] truncate font-semibold select-none'
                    )}
                    title={diagramName}
                >
                    {diagramName}
                </span>
            </div>
        </div>
    );
};
