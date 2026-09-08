import React, { useCallback, useEffect, useState } from 'react';
import { useDialog } from '@/hooks/use-dialog';
import { useProject } from '@/hooks/use-project';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogDescription,
    DialogInternalContent,
} from '@/components/dialog/dialog';
import { Button } from '@/components/button/button';
import { Input } from '@/components/input/input';
import { Label } from '@/components/label/label';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/table/table';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/select/select';
import type { BaseDialogProps } from '../common/base-dialog-props';
import { useToast } from '@/components/toast/use-toast';
import type { ProjectMember } from '@/context/project-context/project-context';
import { Trash, Plus } from 'lucide-react';
import { Badge } from '@/components/badge/badge';

export const ProjectMembersDialog: React.FC<BaseDialogProps> = ({ dialog }) => {
    const { closeProjectMembersDialog } = useDialog();
    const {
        activeProject,
        listMembers,
        addMember,
        updateMemberRole,
        removeMember,
    } = useProject();
    const [members, setMembers] = useState<ProjectMember[]>([]);
    const [email, setEmail] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [isInviting, setIsInviting] = useState(false);
    const { toast } = useToast();

    const fetchMembers = useCallback(async () => {
        if (!activeProject?.id) return;
        setIsLoading(true);
        try {
            const data = await listMembers(activeProject.id);
            setMembers(data);
        } catch {
            toast({
                title: 'Error',
                description: 'Failed to load project members.',
                variant: 'destructive',
            });
        } finally {
            setIsLoading(false);
        }
    }, [activeProject?.id, listMembers, toast]);

    useEffect(() => {
        if (dialog.open) {
            fetchMembers();
            setEmail('');
        }
    }, [dialog.open, fetchMembers]);

    const handleInvite = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!email.trim() || !activeProject?.id) return;

        setIsInviting(true);
        try {
            await addMember(activeProject.id, email.trim(), 'editor');
            setEmail('');
            await fetchMembers();
            toast({
                title: 'Member added',
                description: 'The user has been added to the project.',
            });
        } catch (error: unknown) {
            toast({
                title: 'Failed to add member',
                description:
                    error instanceof Error
                        ? error.message
                        : 'Make sure they are registered.',
                variant: 'destructive',
            });
        } finally {
            setIsInviting(false);
        }
    };

    const handleUpdateRole = async (userId: string, targetRole: string) => {
        if (!activeProject?.id) return;
        try {
            await updateMemberRole(activeProject.id, userId, targetRole);
            await fetchMembers();
            toast({ title: 'Role updated' });
        } catch (error: unknown) {
            toast({
                title: 'Failed to update role',
                description:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred.',
                variant: 'destructive',
            });
        }
    };

    const handleRemove = async (userId: string) => {
        if (!activeProject?.id) return;
        try {
            await removeMember(activeProject.id, userId);
            await fetchMembers();
            toast({ title: 'Member removed' });
        } catch (error: unknown) {
            toast({
                title: 'Failed to remove member',
                description:
                    error instanceof Error
                        ? error.message
                        : 'An error occurred.',
                variant: 'destructive',
            });
        }
    };

    // Calculate how many owners there are to prevent removing the last one
    const ownerCount = members.filter((m) => m.role === 'owner').length;

    // Safety check whether current user is owner (relies on activeProject.role)
    const isOwner = activeProject?.role === 'owner';

    return (
        <Dialog
            {...dialog}
            onOpenChange={(open) => {
                if (!open) {
                    closeProjectMembersDialog();
                }
            }}
        >
            <DialogContent showClose className="sm:max-w-[700px]">
                <DialogHeader>
                    <DialogTitle>Project Members</DialogTitle>
                    <DialogDescription>
                        {isOwner
                            ? 'Manage who has access to this project.'
                            : 'View members of this project (Owner access required to manage).'}
                    </DialogDescription>
                </DialogHeader>

                {isOwner && (
                    <form
                        onSubmit={handleInvite}
                        className="my-2 flex items-end gap-2"
                    >
                        <div className="flex flex-1 flex-col gap-1.5">
                            <Label htmlFor="email">Add by Email</Label>
                            <Input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                placeholder="Enter user's exact email address"
                            />
                        </div>
                        <Button
                            type="submit"
                            disabled={!email.trim() || isInviting}
                        >
                            <Plus className="mr-2 size-4" />
                            {isInviting ? 'Adding...' : 'Add Member'}
                        </Button>
                    </form>
                )}

                <DialogInternalContent className="mt-4">
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Email</TableHead>
                                <TableHead className="w-[120px]">
                                    Role
                                </TableHead>
                                <TableHead className="w-[80px] text-right">
                                    Actions
                                </TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map((member) => {
                                const isOnlyOwner =
                                    member.role === 'owner' && ownerCount === 1;

                                return (
                                    <TableRow key={member.userId}>
                                        <TableCell className="font-medium">
                                            {member.email}
                                        </TableCell>
                                        <TableCell>
                                            {isOwner ? (
                                                <Select
                                                    value={member.role}
                                                    onValueChange={(val) =>
                                                        handleUpdateRole(
                                                            member.userId,
                                                            val
                                                        )
                                                    }
                                                    disabled={isOnlyOwner}
                                                >
                                                    <SelectTrigger className="h-8">
                                                        <SelectValue />
                                                    </SelectTrigger>
                                                    <SelectContent>
                                                        <SelectItem value="owner">
                                                            Owner
                                                        </SelectItem>
                                                        <SelectItem value="editor">
                                                            Editor
                                                        </SelectItem>
                                                    </SelectContent>
                                                </Select>
                                            ) : (
                                                <Badge
                                                    variant="outline"
                                                    className="capitalize"
                                                >
                                                    {member.role}
                                                </Badge>
                                            )}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            {isOwner && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() =>
                                                        handleRemove(
                                                            member.userId
                                                        )
                                                    }
                                                    disabled={isOnlyOwner}
                                                    title={
                                                        isOnlyOwner
                                                            ? 'Cannot remove the only owner'
                                                            : 'Remove member'
                                                    }
                                                >
                                                    <Trash className="size-4 text-red-500" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    </TableRow>
                                );
                            })}
                        </TableBody>
                    </Table>
                    {isLoading && (
                        <div className="flex justify-center p-4">
                            Loading...
                        </div>
                    )}
                </DialogInternalContent>
            </DialogContent>
        </Dialog>
    );
};
