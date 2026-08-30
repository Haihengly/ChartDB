import React, { useCallback, useMemo, useRef } from 'react';
import type { StorageContext } from './storage-context';
import { storageContext } from './storage-context';
import type { Diagram } from '@/lib/domain/diagram';
import type { DBTable } from '@/lib/domain/db-table';
import type { DBRelationship } from '@/lib/domain/db-relationship';
import type { ChartDBConfig } from '@/lib/domain/config';
import type { DBCustomType } from '@/lib/domain/db-custom-type';
import type { DiagramFilter } from '@/lib/domain/diagram-filter/diagram-filter';
import { DatabaseType } from '@/lib/domain/database-type';
import { debounce } from '@/lib/utils';
import { apiFetch } from '../../lib/api-fetch';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

interface DiagramResponse {
    id: string;
    name: string;
    content: Partial<Diagram>;
    createdAt: string | Date;
    updatedAt: string | Date;
}

export const StorageProvider: React.FC<React.PropsWithChildren> = ({
    children,
}) => {
    // In-memory cache for diagrams to ensure rapid updates and state reconstruction
    const diagramsCache = useRef<Map<string, Diagram>>(new Map());
    const configCache = useRef<ChartDBConfig>({ defaultDiagramId: '' });
    const filtersCache = useRef<Map<string, DiagramFilter>>(new Map());

    const getDiagramFromCache = useCallback((id: string): Diagram => {
        let diagram = diagramsCache.current.get(id);
        if (!diagram) {
            diagram = {
                id,
                name: 'Untitled Diagram',
                databaseType: DatabaseType.GENERIC,
                tables: [],
                relationships: [],
                dependencies: [],
                areas: [],
                customTypes: [],
                notes: [],
                createdAt: new Date(),
                updatedAt: new Date(),
            };
            diagramsCache.current.set(id, diagram);
        }
        return diagram;
    }, []);

    const saveDiagramToBackend = useMemo(
        () =>
            debounce(async (diagram: Diagram) => {
                try {
                    const payload = {
                        name: diagram.name,
                        content: {
                            databaseType: diagram.databaseType,
                            databaseEdition: diagram.databaseEdition,
                            tables: diagram.tables || [],
                            relationships: diagram.relationships || [],
                            dependencies: diagram.dependencies || [],
                            areas: diagram.areas || [],
                            customTypes: diagram.customTypes || [],
                            notes: diagram.notes || [],
                        },
                    };
                    console.log(
                        'DEBUG: Sending PUT request to',
                        `${API_URL}/diagrams/${diagram.id}`,
                        payload
                    );
                    await apiFetch(`${API_URL}/diagrams/${diagram.id}`, {
                        method: 'PUT',
                        headers: {
                            'Content-Type': 'application/json',
                        },
                        body: JSON.stringify(payload),
                    });
                } catch (error) {
                    console.error('Failed to save diagram to backend:', error);
                }
            }, 1000),
        []
    );

    const triggerSave = useCallback(
        (diagramId: string) => {
            const diagram = diagramsCache.current.get(diagramId);
            console.log(
                'DEBUG: triggerSave diagramId:',
                diagramId,
                'found?',
                !!diagram
            );
            if (diagram) {
                diagram.updatedAt = new Date();
                saveDiagramToBackend(diagram);
            } else {
                console.warn(
                    'DEBUG: triggerSave - diagram NOT found in cache!'
                );
            }
        },
        [saveDiagramToBackend]
    );

    const getConfig: StorageContext['getConfig'] = useCallback(async () => {
        const stored = localStorage.getItem('chartdb_config');
        if (stored) {
            try {
                configCache.current = JSON.parse(stored);
            } catch {
                // ignore
            }
        }
        return configCache.current;
    }, []);

    const updateConfig: StorageContext['updateConfig'] = useCallback(
        async (config) => {
            configCache.current = { ...configCache.current, ...config };
            localStorage.setItem(
                'chartdb_config',
                JSON.stringify(configCache.current)
            );
        },
        []
    );

    const getDiagramFilter: StorageContext['getDiagramFilter'] = useCallback(
        async (diagramId: string): Promise<DiagramFilter | undefined> => {
            return filtersCache.current.get(diagramId);
        },
        []
    );

    const updateDiagramFilter: StorageContext['updateDiagramFilter'] =
        useCallback(async (diagramId, filter): Promise<void> => {
            filtersCache.current.set(diagramId, filter);
        }, []);

    const deleteDiagramFilter: StorageContext['deleteDiagramFilter'] =
        useCallback(async (diagramId: string): Promise<void> => {
            filtersCache.current.delete(diagramId);
        }, []);

    const addTable: StorageContext['addTable'] = useCallback(
        async ({ diagramId, table }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.tables = diagram.tables || [];
            diagram.tables.push(table);
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const getTable: StorageContext['getTable'] = useCallback(
        async ({ id, diagramId }): Promise<DBTable | undefined> => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.tables?.find((t) => t.id === id);
        },
        [getDiagramFromCache]
    );

    const deleteDiagramTables: StorageContext['deleteDiagramTables'] =
        useCallback(
            async (diagramId) => {
                const diagram = getDiagramFromCache(diagramId);
                diagram.tables = [];
                triggerSave(diagramId);
            },
            [getDiagramFromCache, triggerSave]
        );

    const updateTable: StorageContext['updateTable'] = useCallback(
        async ({ id, attributes }) => {
            // Find which diagram contains this table
            for (const [
                diagramId,
                diagram,
            ] of diagramsCache.current.entries()) {
                if (diagram.tables) {
                    const tableIndex = diagram.tables.findIndex(
                        (t) => t.id === id
                    );
                    if (tableIndex !== -1) {
                        diagram.tables[tableIndex] = {
                            ...diagram.tables[tableIndex],
                            ...attributes,
                        };
                        triggerSave(diagramId);
                        break;
                    }
                }
            }
        },
        [triggerSave]
    );

    const putTable: StorageContext['putTable'] = useCallback(
        async ({ diagramId, table }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.tables = diagram.tables || [];
            const index = diagram.tables.findIndex((t) => t.id === table.id);
            if (index !== -1) {
                diagram.tables[index] = table;
            } else {
                diagram.tables.push(table);
            }
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const deleteTable: StorageContext['deleteTable'] = useCallback(
        async ({ id, diagramId }) => {
            const diagram = getDiagramFromCache(diagramId);
            if (diagram.tables) {
                diagram.tables = diagram.tables.filter((t) => t.id !== id);
                triggerSave(diagramId);
            }
        },
        [getDiagramFromCache, triggerSave]
    );

    const listTables: StorageContext['listTables'] = useCallback(
        async (diagramId): Promise<DBTable[]> => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.tables || [];
        },
        [getDiagramFromCache]
    );

    const addRelationship: StorageContext['addRelationship'] = useCallback(
        async ({ diagramId, relationship }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.relationships = diagram.relationships || [];
            diagram.relationships.push(relationship);
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const deleteDiagramRelationships: StorageContext['deleteDiagramRelationships'] =
        useCallback(
            async (diagramId) => {
                const diagram = getDiagramFromCache(diagramId);
                diagram.relationships = [];
                triggerSave(diagramId);
            },
            [getDiagramFromCache, triggerSave]
        );

    const getRelationship: StorageContext['getRelationship'] = useCallback(
        async ({ id, diagramId }): Promise<DBRelationship | undefined> => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.relationships?.find((r) => r.id === id);
        },
        [getDiagramFromCache]
    );

    const updateRelationship: StorageContext['updateRelationship'] =
        useCallback(
            async ({ id, attributes }) => {
                for (const [
                    diagramId,
                    diagram,
                ] of diagramsCache.current.entries()) {
                    if (diagram.relationships) {
                        const index = diagram.relationships.findIndex(
                            (r) => r.id === id
                        );
                        if (index !== -1) {
                            diagram.relationships[index] = {
                                ...diagram.relationships[index],
                                ...attributes,
                            };
                            triggerSave(diagramId);
                            break;
                        }
                    }
                }
            },
            [triggerSave]
        );

    const deleteRelationship: StorageContext['deleteRelationship'] =
        useCallback(
            async ({ id, diagramId }) => {
                const diagram = getDiagramFromCache(diagramId);
                if (diagram.relationships) {
                    diagram.relationships = diagram.relationships.filter(
                        (r) => r.id !== id
                    );
                    triggerSave(diagramId);
                }
            },
            [getDiagramFromCache, triggerSave]
        );

    const listRelationships: StorageContext['listRelationships'] = useCallback(
        async (diagramId): Promise<DBRelationship[]> => {
            const diagram = getDiagramFromCache(diagramId);
            return [...(diagram.relationships || [])].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        },
        [getDiagramFromCache]
    );

    const addDependency: StorageContext['addDependency'] = useCallback(
        async ({ diagramId, dependency }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.dependencies = diagram.dependencies || [];
            diagram.dependencies.push(dependency);
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const getDependency: StorageContext['getDependency'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.dependencies?.find((d) => d.id === id);
        },
        [getDiagramFromCache]
    );

    const updateDependency: StorageContext['updateDependency'] = useCallback(
        async ({ id, attributes }) => {
            for (const [
                diagramId,
                diagram,
            ] of diagramsCache.current.entries()) {
                if (diagram.dependencies) {
                    const index = diagram.dependencies.findIndex(
                        (d) => d.id === id
                    );
                    if (index !== -1) {
                        diagram.dependencies[index] = {
                            ...diagram.dependencies[index],
                            ...attributes,
                        };
                        triggerSave(diagramId);
                        break;
                    }
                }
            }
        },
        [triggerSave]
    );

    const deleteDependency: StorageContext['deleteDependency'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            if (diagram.dependencies) {
                diagram.dependencies = diagram.dependencies.filter(
                    (d) => d.id !== id
                );
                triggerSave(diagramId);
            }
        },
        [getDiagramFromCache, triggerSave]
    );

    const listDependencies: StorageContext['listDependencies'] = useCallback(
        async (diagramId) => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.dependencies || [];
        },
        [getDiagramFromCache]
    );

    const deleteDiagramDependencies: StorageContext['deleteDiagramDependencies'] =
        useCallback(
            async (diagramId) => {
                const diagram = getDiagramFromCache(diagramId);
                diagram.dependencies = [];
                triggerSave(diagramId);
            },
            [getDiagramFromCache, triggerSave]
        );

    const addArea: StorageContext['addArea'] = useCallback(
        async ({ area, diagramId }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.areas = diagram.areas || [];
            diagram.areas.push(area);
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const getArea: StorageContext['getArea'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.areas?.find((a) => a.id === id);
        },
        [getDiagramFromCache]
    );

    const updateArea: StorageContext['updateArea'] = useCallback(
        async ({ id, attributes }) => {
            for (const [
                diagramId,
                diagram,
            ] of diagramsCache.current.entries()) {
                if (diagram.areas) {
                    const index = diagram.areas.findIndex((a) => a.id === id);
                    if (index !== -1) {
                        diagram.areas[index] = {
                            ...diagram.areas[index],
                            ...attributes,
                        };
                        triggerSave(diagramId);
                        break;
                    }
                }
            }
        },
        [triggerSave]
    );

    const deleteArea: StorageContext['deleteArea'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            if (diagram.areas) {
                diagram.areas = diagram.areas.filter((a) => a.id !== id);
                triggerSave(diagramId);
            }
        },
        [getDiagramFromCache, triggerSave]
    );

    const listAreas: StorageContext['listAreas'] = useCallback(
        async (diagramId) => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.areas || [];
        },
        [getDiagramFromCache]
    );

    const deleteDiagramAreas: StorageContext['deleteDiagramAreas'] =
        useCallback(
            async (diagramId) => {
                const diagram = getDiagramFromCache(diagramId);
                diagram.areas = [];
                triggerSave(diagramId);
            },
            [getDiagramFromCache, triggerSave]
        );

    const addCustomType: StorageContext['addCustomType'] = useCallback(
        async ({ diagramId, customType }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.customTypes = diagram.customTypes || [];
            diagram.customTypes.push(customType);
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const getCustomType: StorageContext['getCustomType'] = useCallback(
        async ({ diagramId, id }): Promise<DBCustomType | undefined> => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.customTypes?.find((c) => c.id === id);
        },
        [getDiagramFromCache]
    );

    const updateCustomType: StorageContext['updateCustomType'] = useCallback(
        async ({ id, attributes }) => {
            for (const [
                diagramId,
                diagram,
            ] of diagramsCache.current.entries()) {
                if (diagram.customTypes) {
                    const index = diagram.customTypes.findIndex(
                        (c) => c.id === id
                    );
                    if (index !== -1) {
                        diagram.customTypes[index] = {
                            ...diagram.customTypes[index],
                            ...attributes,
                        };
                        triggerSave(diagramId);
                        break;
                    }
                }
            }
        },
        [triggerSave]
    );

    const deleteCustomType: StorageContext['deleteCustomType'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            if (diagram.customTypes) {
                diagram.customTypes = diagram.customTypes.filter(
                    (c) => c.id !== id
                );
                triggerSave(diagramId);
            }
        },
        [getDiagramFromCache, triggerSave]
    );

    const listCustomTypes: StorageContext['listCustomTypes'] = useCallback(
        async (diagramId): Promise<DBCustomType[]> => {
            const diagram = getDiagramFromCache(diagramId);
            return [...(diagram.customTypes || [])].sort((a, b) =>
                a.name.localeCompare(b.name)
            );
        },
        [getDiagramFromCache]
    );

    const deleteDiagramCustomTypes: StorageContext['deleteDiagramCustomTypes'] =
        useCallback(
            async (diagramId) => {
                const diagram = getDiagramFromCache(diagramId);
                diagram.customTypes = [];
                triggerSave(diagramId);
            },
            [getDiagramFromCache, triggerSave]
        );

    const addNote: StorageContext['addNote'] = useCallback(
        async ({ note, diagramId }) => {
            const diagram = getDiagramFromCache(diagramId);
            diagram.notes = diagram.notes || [];
            diagram.notes.push(note);
            triggerSave(diagramId);
        },
        [getDiagramFromCache, triggerSave]
    );

    const getNote: StorageContext['getNote'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.notes?.find((n) => n.id === id);
        },
        [getDiagramFromCache]
    );

    const updateNote: StorageContext['updateNote'] = useCallback(
        async ({ id, attributes }) => {
            for (const [
                diagramId,
                diagram,
            ] of diagramsCache.current.entries()) {
                if (diagram.notes) {
                    const index = diagram.notes.findIndex((n) => n.id === id);
                    if (index !== -1) {
                        diagram.notes[index] = {
                            ...diagram.notes[index],
                            ...attributes,
                        };
                        triggerSave(diagramId);
                        break;
                    }
                }
            }
        },
        [triggerSave]
    );

    const deleteNote: StorageContext['deleteNote'] = useCallback(
        async ({ diagramId, id }) => {
            const diagram = getDiagramFromCache(diagramId);
            if (diagram.notes) {
                diagram.notes = diagram.notes.filter((n) => n.id !== id);
                triggerSave(diagramId);
            }
        },
        [getDiagramFromCache, triggerSave]
    );

    const listNotes: StorageContext['listNotes'] = useCallback(
        async (diagramId) => {
            const diagram = getDiagramFromCache(diagramId);
            return diagram.notes || [];
        },
        [getDiagramFromCache]
    );

    const deleteDiagramNotes: StorageContext['deleteDiagramNotes'] =
        useCallback(
            async (diagramId) => {
                const diagram = getDiagramFromCache(diagramId);
                diagram.notes = [];
                triggerSave(diagramId);
            },
            [getDiagramFromCache, triggerSave]
        );

    const addDiagram: StorageContext['addDiagram'] = useCallback(
        async ({ diagram }) => {
            diagramsCache.current.set(diagram.id, diagram);
            try {
                const payload = {
                    id: diagram.id,
                    name: diagram.name,
                    content: {
                        databaseType: diagram.databaseType,
                        databaseEdition: diagram.databaseEdition,
                        tables: diagram.tables || [],
                        relationships: diagram.relationships || [],
                        dependencies: diagram.dependencies || [],
                        areas: diagram.areas || [],
                        customTypes: diagram.customTypes || [],
                        notes: diagram.notes || [],
                    },
                };
                await apiFetch(`${API_URL}/diagrams`, {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(payload),
                });
            } catch (error) {
                console.error('Failed to create diagram on backend:', error);
            }
        },
        []
    );

    const listDiagrams: StorageContext['listDiagrams'] =
        useCallback(async (): Promise<Diagram[]> => {
            try {
                const response = await apiFetch(`${API_URL}/diagrams`);
                if (!response.ok) {
                    throw new Error('Failed to fetch diagrams');
                }
                const data = (await response.json()) as DiagramResponse[];
                return data.map((d) => {
                    const content = d.content || {};
                    const diagram: Diagram = {
                        id: d.id,
                        name: d.name,
                        databaseType:
                            content.databaseType || DatabaseType.GENERIC,
                        databaseEdition: content.databaseEdition,
                        tables: content.tables || [],
                        relationships: content.relationships || [],
                        dependencies: content.dependencies || [],
                        areas: content.areas || [],
                        customTypes: content.customTypes || [],
                        notes: content.notes || [],
                        createdAt: new Date(d.createdAt),
                        updatedAt: new Date(d.updatedAt),
                    };
                    diagramsCache.current.set(diagram.id, diagram);
                    return diagram;
                });
            } catch (error) {
                console.error('Failed to list diagrams from backend:', error);
                return Array.from(diagramsCache.current.values());
            }
        }, []);

    const getDiagram: StorageContext['getDiagram'] = useCallback(
        async (id: string): Promise<Diagram | undefined> => {
            try {
                const response = await apiFetch(`${API_URL}/diagrams/${id}`);
                if (!response.ok) {
                    return diagramsCache.current.get(id);
                }
                const d = (await response.json()) as DiagramResponse;
                const content = d.content || {};
                const diagram: Diagram = {
                    id: d.id,
                    name: d.name,
                    databaseType: content.databaseType || DatabaseType.GENERIC,
                    databaseEdition: content.databaseEdition,
                    tables: content.tables || [],
                    relationships: content.relationships || [],
                    dependencies: content.dependencies || [],
                    areas: content.areas || [],
                    customTypes: content.customTypes || [],
                    notes: content.notes || [],
                    createdAt: new Date(d.createdAt),
                    updatedAt: new Date(d.updatedAt),
                };
                diagramsCache.current.set(diagram.id, diagram);
                return diagram;
            } catch (error) {
                console.error('Failed to get diagram from backend:', error);
                return diagramsCache.current.get(id);
            }
        },
        []
    );

    const updateDiagram: StorageContext['updateDiagram'] = useCallback(
        async ({ id, attributes }) => {
            const diagram = getDiagramFromCache(id);
            Object.assign(diagram, attributes);
            triggerSave(id);
        },
        [getDiagramFromCache, triggerSave]
    );

    const deleteDiagram: StorageContext['deleteDiagram'] = useCallback(
        async (id) => {
            diagramsCache.current.delete(id);
            try {
                await apiFetch(`${API_URL}/diagrams/${id}`, {
                    method: 'DELETE',
                });
            } catch (error) {
                console.error('Failed to delete diagram from backend:', error);
            }
        },
        []
    );

    return (
        <storageContext.Provider
            value={{
                getConfig,
                updateConfig,
                addDiagram,
                listDiagrams,
                getDiagram,
                updateDiagram,
                deleteDiagram,
                addTable,
                getTable,
                updateTable,
                putTable,
                deleteTable,
                listTables,
                addRelationship,
                getRelationship,
                updateRelationship,
                deleteRelationship,
                listRelationships,
                deleteDiagramTables,
                deleteDiagramRelationships,
                addDependency,
                getDependency,
                updateDependency,
                deleteDependency,
                listDependencies,
                deleteDiagramDependencies,
                addArea,
                getArea,
                updateArea,
                deleteArea,
                listAreas,
                deleteDiagramAreas,
                addCustomType,
                getCustomType,
                updateCustomType,
                deleteCustomType,
                listCustomTypes,
                deleteDiagramCustomTypes,
                addNote,
                getNote,
                updateNote,
                deleteNote,
                listNotes,
                deleteDiagramNotes,
                getDiagramFilter,
                updateDiagramFilter,
                deleteDiagramFilter,
            }}
        >
            {children}
        </storageContext.Provider>
    );
};
