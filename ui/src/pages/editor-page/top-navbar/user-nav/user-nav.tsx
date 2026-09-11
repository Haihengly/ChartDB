import React, { useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, LogOut } from 'lucide-react';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
} from '@/components/dropdown-menu/dropdown-menu';
import {
    Tooltip,
    TooltipContent,
    TooltipTrigger,
} from '@/components/tooltip/tooltip';
import { buttonVariants } from '@/components/button/button-variants';
import { cn } from '@/lib/utils';

export const UserNav: React.FC = () => {
    const navigate = useNavigate();

    const user = useMemo(() => {
        try {
            const raw = localStorage.getItem('auth_user');
            if (raw) {
                return JSON.parse(raw);
            }
        } catch {
            // ignore JSON parse error
        }
        return null;
    }, []);

    const handleLogout = () => {
        localStorage.removeItem('auth_token');
        localStorage.removeItem('auth_user');
        navigate('/login');
    };

    return (
        <DropdownMenu>
            <Tooltip>
                <TooltipTrigger asChild>
                    <DropdownMenuTrigger asChild>
                        <button
                            type="button"
                            className={cn(
                                buttonVariants({
                                    variant: 'outline',
                                    size: 'icon',
                                }),
                                'size-6 rounded-full md:size-8 cursor-pointer'
                            )}
                        >
                            <User className="size-3.5 md:size-4" />
                            <span className="sr-only">User account</span>
                        </button>
                    </DropdownMenuTrigger>
                </TooltipTrigger>
                <TooltipContent>
                    {user?.username || user?.email || 'Account'}
                </TooltipContent>
            </Tooltip>
            <DropdownMenuContent className="w-56" align="end">
                <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                        <p className="text-sm font-medium leading-none">
                            Signed in as
                        </p>
                        <p className="truncate text-sm font-medium leading-none">
                            {user?.username || user?.email || 'User'}
                        </p>
                        {user?.username && user?.email && (
                            <p className="truncate text-xs leading-none text-muted-foreground">
                                {user.email}
                            </p>
                        )}
                    </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                    onClick={handleLogout}
                    className="cursor-pointer text-red-600 focus:text-red-600 dark:text-red-400 dark:focus:text-red-400"
                >
                    <LogOut className="mr-2 size-4" />
                    <span>Log out</span>
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    );
};
