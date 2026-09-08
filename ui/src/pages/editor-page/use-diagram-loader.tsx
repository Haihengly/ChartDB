import { useChartDB } from '@/hooks/use-chartdb';
import { useConfig } from '@/hooks/use-config';
import { useDialog } from '@/hooks/use-dialog';
import { useFullScreenLoader } from '@/hooks/use-full-screen-spinner';
import { useRedoUndoStack } from '@/hooks/use-redo-undo-stack';
import { useStorage } from '@/hooks/use-storage';
import type { Diagram } from '@/lib/domain/diagram';
import { useEffect, useRef, useState } from 'react';
import { useLocation, useNavigate, useParams } from 'react-router-dom';

export const useDiagramLoader = () => {
    const [initialDiagram, setInitialDiagram] = useState<Diagram | undefined>();
    const { diagramId } = useParams<{ diagramId: string }>();
    const { config } = useConfig();
    const { loadDiagram, currentDiagram } = useChartDB();
    const { resetRedoStack, resetUndoStack } = useRedoUndoStack();
    const { showLoader, hideLoader } = useFullScreenLoader();
    const { openCreateDiagramDialog, openOpenDiagramDialog } = useDialog();
    const navigate = useNavigate();
    const location = useLocation();
    const { listDiagrams } = useStorage();

    const currentDiagramLoadingRef = useRef<string | undefined>(undefined);

    useEffect(() => {
        if (!config) {
            return;
        }

        if (currentDiagram?.id === diagramId) {
            return;
        }

        const state = location.state as { preventAutoModal?: boolean } | null;

        const loadDefaultDiagram = async () => {
            if (state?.preventAutoModal) {
                setInitialDiagram(undefined);
                return;
            }

            if (diagramId) {
                setInitialDiagram(undefined);
                showLoader();
                resetRedoStack();
                resetUndoStack();
                const diagram = await loadDiagram(diagramId);
                if (!diagram) {
                    openOpenDiagramDialog({ canClose: true });
                    hideLoader();
                    return;
                }

                setInitialDiagram(diagram);
                hideLoader();

                return;
            }

            const diagrams = await listDiagrams({ fetchAll: true });

            if (diagrams.length > 0) {
                openOpenDiagramDialog({ canClose: true });
            } else {
                openCreateDiagramDialog();
            }
        };

        if (
            currentDiagramLoadingRef.current === (diagramId ?? '') &&
            currentDiagramLoadingRef.current !== undefined
        ) {
            return;
        }
        currentDiagramLoadingRef.current = diagramId ?? '';

        loadDefaultDiagram();
    }, [
        diagramId,
        openCreateDiagramDialog,
        config,
        navigate,
        listDiagrams,
        loadDiagram,
        resetRedoStack,
        resetUndoStack,
        hideLoader,
        showLoader,
        currentDiagram?.id,
        openOpenDiagramDialog,
        location.state,
    ]);

    return { initialDiagram };
};
