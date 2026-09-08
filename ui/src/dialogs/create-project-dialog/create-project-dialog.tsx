import React, { useState } from 'react';
import { useDialog } from '@/hooks/use-dialog';
import { useProject } from '@/hooks/use-project';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogFooter,
    DialogClose,
} from '@/components/dialog/dialog';
import { Button } from '@/components/button/button';
import { Input } from '@/components/input/input';
import { Label } from '@/components/label/label';
import type { BaseDialogProps } from '../common/base-dialog-props';
import { useToast } from '@/components/toast/use-toast';

export const CreateProjectDialog: React.FC<BaseDialogProps> = ({ dialog }) => {
    const { closeCreateProjectDialog } = useDialog();
    const { createProject, setActiveProject } = useProject();
    const [name, setName] = useState('');
    const [isSubmitting, setIsSubmitting] = useState(false);
    const { toast } = useToast();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!name.trim()) return;

        setIsSubmitting(true);
        try {
            const project = await createProject(name.trim());
            setActiveProject(project);
            closeCreateProjectDialog();
            toast({
                title: 'Project created',
                description: 'You are now working in the new project.',
            });
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to create project',
                variant: 'destructive',
            });
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <Dialog
            {...dialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeCreateProjectDialog();
                } else {
                    setName('');
                }
            }}
        >
            <DialogContent showClose className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Create Project</DialogTitle>
                    <DialogDescription>
                        Create a new collaborative workspace.
                    </DialogDescription>
                </DialogHeader>
                <form
                    onSubmit={handleSubmit}
                    className="flex flex-col gap-4 py-4"
                >
                    <div className="flex flex-col gap-2">
                        <Label htmlFor="name">Project name</Label>
                        <Input
                            id="name"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            placeholder="My Awesome Project"
                            autoFocus
                        />
                    </div>
                    <DialogFooter>
                        <DialogClose asChild>
                            <Button type="button" variant="secondary">
                                Cancel
                            </Button>
                        </DialogClose>
                        <Button
                            type="submit"
                            disabled={!name.trim() || isSubmitting}
                        >
                            {isSubmitting ? 'Creating...' : 'Create'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
