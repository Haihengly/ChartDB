import React from 'react';
import { Database, Code, Zap, Server } from 'lucide-react';
import ChartDBDarkLogo from '@/assets/logo-dark.png';

export interface AuthLayoutProps {
    title: string;
    description: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
    title,
    description,
    children,
}) => {
    const features = [
        {
            icon: Code,
            title: 'Schema Visualization',
            description:
                'Interactive database design and relationship mapping.',
        },
        {
            icon: Database,
            title: 'Database Connectivity',
            description:
                'Support for PostgreSQL, MySQL, SQLite, SQL Server, and more.',
        },
        {
            icon: Server,
            title: 'Persistent Cloud Storage',
            description:
                'Server-backed database diagram storage that persists across sessions.',
        },
        {
            icon: Zap,
            title: 'Fast & Intuitive',
            description:
                'Instant DDL import, export, and quick visual query/schema generation.',
        },
    ];

    return (
        <div className="flex min-h-screen">
            {/* Left Panel */}
            <div className="hidden flex-col justify-between bg-blue-600 p-12 text-white lg:flex lg:w-1/2">
                <div>
                    <img
                        src={ChartDBDarkLogo}
                        alt="chartDB"
                        className="h-10 w-auto"
                    />
                    <h1 className="mt-10 text-4xl font-bold leading-tight">
                        ChartDB Data Visualization
                    </h1>
                </div>

                <div className="space-y-8">
                    {features.map((feature, index) => (
                        <div key={index} className="flex gap-4">
                            <div className="flex size-10 items-center justify-center rounded-lg bg-white/10">
                                <feature.icon className="size-6 text-white" />
                            </div>
                            <div>
                                <h3 className="font-semibold text-white">
                                    {feature.title}
                                </h3>
                                <p className="text-sm text-blue-100">
                                    {feature.description}
                                </p>
                            </div>
                        </div>
                    ))}
                </div>

                <div className="text-sm text-blue-200">
                    &copy; {new Date().getFullYear()} ChartDB
                </div>
            </div>

            {/* Right Panel */}
            <div className="relative flex w-full items-center justify-center bg-gradient-to-br from-blue-50 via-white to-indigo-50 p-8 dark:from-zinc-900 dark:via-zinc-900 dark:to-zinc-800 lg:w-1/2">
                {/* Subtle decorative background elements */}
                <div className="pointer-events-none absolute inset-0 overflow-hidden opacity-30 mix-blend-multiply dark:opacity-10 dark:mix-blend-lighten">
                    <svg
                        className="absolute left-[10%] top-[20%] size-96 -translate-x-1/2 -translate-y-1/2 text-blue-200"
                        fill="none"
                        viewBox="0 0 200 200"
                    >
                        <circle
                            cx="100"
                            cy="100"
                            r="100"
                            stroke="currentColor"
                            strokeWidth="2"
                            strokeDasharray="4 8"
                        />
                        <circle
                            cx="100"
                            cy="100"
                            r="60"
                            stroke="currentColor"
                            strokeWidth="1"
                        />
                    </svg>
                    <svg
                        className="absolute bottom-[10%] right-[10%] size-64 translate-x-1/3 translate-y-1/3 text-indigo-200"
                        fill="none"
                        viewBox="0 0 200 200"
                    >
                        <path
                            d="M0 200 L200 0"
                            stroke="currentColor"
                            strokeWidth="2"
                        />
                        <path
                            d="M50 200 L200 50"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                        <path
                            d="M100 200 L200 100"
                            stroke="currentColor"
                            strokeWidth="1"
                            strokeDasharray="4 4"
                        />
                    </svg>
                </div>

                <div className="relative z-10 w-full max-w-md -translate-x-0 rounded-2xl border border-gray-100/80 bg-white/90 p-8 shadow-2xl backdrop-blur-xl dark:border-zinc-700/80 dark:bg-zinc-800/95 lg:-translate-x-12">
                    <div className="mb-8">
                        <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                            {title}
                        </h2>
                        <p className="mt-2 text-sm text-gray-600 dark:text-gray-400">
                            {description}
                        </p>
                    </div>
                    {children}
                </div>
            </div>
        </div>
    );
};
