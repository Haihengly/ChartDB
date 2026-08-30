import React from 'react';
import { Database, Activity, Zap, TrendingUp } from 'lucide-react';
import ChartDBLogo from '@/assets/mpwt-logo.png';
import ChartDBDarkLogo from '@/assets/mpwt-logo.png';

export interface AuthLayoutProps {
    title: string;
    children: React.ReactNode;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({ title, children }) => {
    const features = [
        {
            icon: Activity,
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
            icon: TrendingUp,
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
        <div className="relative flex min-h-screen items-center justify-center overflow-hidden bg-[#edf3fa] p-4 dark:bg-zinc-950 sm:p-8">
            {/* Background Grid Pattern */}
            <div
                className="pointer-events-none absolute inset-0 opacity-40 dark:opacity-10"
                style={{
                    backgroundImage: `linear-gradient(#bfdbfe 1px, transparent 1px), linear-gradient(to right, #bfdbfe 1px, transparent 1px)`,
                    backgroundSize: '36px 36px',
                }}
            />

            {/* Decorative Background Chart Illustrations */}
            <div className="pointer-events-none absolute inset-0 overflow-hidden">
                {/* Top-Right Bar Chart & Connected Line Chart with Red Nodes */}
                <svg
                    className="absolute -right-8 top-6 h-72 w-96 text-blue-400/40 dark:text-blue-800/20"
                    viewBox="0 0 320 220"
                    fill="none"
                >
                    {/* Bars */}
                    <rect
                        x="30"
                        y="90"
                        width="22"
                        height="110"
                        rx="4"
                        fill="currentColor"
                        opacity="0.4"
                    />
                    <rect
                        x="70"
                        y="50"
                        width="22"
                        height="150"
                        rx="4"
                        fill="currentColor"
                        opacity="0.6"
                    />
                    <rect
                        x="110"
                        y="110"
                        width="22"
                        height="90"
                        rx="4"
                        fill="currentColor"
                        opacity="0.35"
                    />
                    <rect
                        x="150"
                        y="30"
                        width="22"
                        height="170"
                        rx="4"
                        fill="currentColor"
                        opacity="0.8"
                    />
                    <rect
                        x="190"
                        y="75"
                        width="22"
                        height="125"
                        rx="4"
                        fill="currentColor"
                        opacity="0.5"
                    />
                    <rect
                        x="230"
                        y="120"
                        width="22"
                        height="80"
                        rx="4"
                        fill="currentColor"
                        opacity="0.4"
                    />
                    <line
                        x1="15"
                        y1="200"
                        x2="280"
                        y2="200"
                        stroke="currentColor"
                        strokeWidth="2"
                    />

                    {/* Overlay Line with Red Nodes */}
                    <path
                        d="M30 130 L70 80 L110 120 L150 45 L190 95 L230 140 L275 70"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                        fill="none"
                    />
                    <circle cx="30" cy="130" r="4" fill="#ef4444" />
                    <circle cx="70" cy="80" r="4" fill="#ef4444" />
                    <circle cx="110" cy="120" r="4" fill="#ef4444" />
                    <circle cx="150" cy="45" r="4.5" fill="#ef4444" />
                    <circle cx="190" cy="95" r="4" fill="#ef4444" />
                    <circle cx="230" cy="140" r="4" fill="#ef4444" />
                    <circle cx="275" cy="70" r="4.5" fill="#ef4444" />
                </svg>

                {/* Bottom Bar Chart & Line Graph */}
                <svg
                    className="absolute -bottom-10 left-8 h-64 w-[480px] text-blue-400/35 dark:text-blue-900/20"
                    viewBox="0 0 440 200"
                    fill="none"
                >
                    {/* Multi-tier bars */}
                    <rect
                        x="20"
                        y="80"
                        width="18"
                        height="100"
                        rx="3"
                        fill="currentColor"
                        opacity="0.5"
                    />
                    <rect
                        x="50"
                        y="110"
                        width="18"
                        height="70"
                        rx="3"
                        fill="currentColor"
                        opacity="0.35"
                    />
                    <rect
                        x="80"
                        y="50"
                        width="18"
                        height="130"
                        rx="3"
                        fill="currentColor"
                        opacity="0.75"
                    />
                    <rect
                        x="110"
                        y="95"
                        width="18"
                        height="85"
                        rx="3"
                        fill="currentColor"
                        opacity="0.45"
                    />
                    <rect
                        x="140"
                        y="40"
                        width="18"
                        height="140"
                        rx="3"
                        fill="currentColor"
                        opacity="0.85"
                    />
                    <rect
                        x="170"
                        y="70"
                        width="18"
                        height="110"
                        rx="3"
                        fill="currentColor"
                        opacity="0.6"
                    />
                    <rect
                        x="200"
                        y="125"
                        width="18"
                        height="55"
                        rx="3"
                        fill="currentColor"
                        opacity="0.3"
                    />
                    <rect
                        x="230"
                        y="60"
                        width="18"
                        height="120"
                        rx="3"
                        fill="currentColor"
                        opacity="0.7"
                    />
                    <rect
                        x="260"
                        y="90"
                        width="18"
                        height="90"
                        rx="3"
                        fill="currentColor"
                        opacity="0.5"
                    />
                    <line
                        x1="10"
                        y1="180"
                        x2="320"
                        y2="180"
                        stroke="currentColor"
                        strokeWidth="2"
                    />

                    {/* Red node graph line */}
                    <path
                        d="M20 120 L80 65 L140 50 L200 135 L260 100 L320 40"
                        stroke="#3b82f6"
                        strokeWidth="2.5"
                    />
                    <circle cx="20" cy="120" r="4" fill="#ef4444" />
                    <circle cx="80" cy="65" r="4" fill="#ef4444" />
                    <circle cx="140" cy="50" r="4.5" fill="#ef4444" />
                    <circle cx="200" cy="135" r="4" fill="#ef4444" />
                    <circle cx="260" cy="100" r="4" fill="#ef4444" />
                    <circle cx="320" cy="40" r="4.5" fill="#ef4444" />
                </svg>
            </div>

            {/* Main Unified Floating Card */}
            <div className="relative z-10 flex w-full max-w-5xl flex-col items-center justify-between gap-8 rounded-[2.5rem] border border-white/80 bg-white/50 p-6 shadow-[0_25px_60px_rgba(15,39,68,0.12)] backdrop-blur-xl dark:border-white/10 dark:bg-zinc-900/50 sm:p-10 lg:min-h-[620px] lg:flex-row lg:items-stretch lg:p-12">
                {/* Left Branding Area */}
                <div className="flex w-full flex-col justify-between lg:w-[54%]">
                    <div>
                        <div className="flex items-center gap-3">
                            <img
                                src={ChartDBLogo}
                                alt="ChartDB"
                                className="h-9 w-auto dark:hidden"
                            />
                            <img
                                src={ChartDBDarkLogo}
                                alt="ChartDB"
                                className="hidden h-9 w-auto dark:block"
                            />
                        </div>

                        <h1 className="mt-8 text-3xl font-bold tracking-tight text-[#0f2744] dark:text-white sm:text-4xl">
                            ChartDB Data Visualization
                        </h1>
                    </div>

                    <div className="my-8 space-y-6">
                        {features.map((feature, index) => (
                            <div key={index} className="flex items-start gap-4">
                                {/* Solid dark navy rounded-square icon */}
                                <div className="flex size-10 shrink-0 items-center justify-center rounded-xl bg-[#0f2744] text-white shadow-sm dark:bg-blue-600">
                                    <feature.icon className="size-5" />
                                </div>
                                <div className="max-w-md">
                                    <h3 className="text-sm font-semibold text-[#0f2744] dark:text-zinc-100 sm:text-base">
                                        {feature.title}
                                    </h3>
                                    <p className="mt-0.5 text-xs text-[#486581] dark:text-zinc-400 sm:text-sm">
                                        {feature.description}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>

                    <div className="text-xs text-[#627d98] dark:text-zinc-500 sm:text-sm">
                        &copy; 2026 ChartDB
                    </div>
                </div>

                {/* Overlapping Translucent Login/Auth Card on Right */}
                <div className="relative z-20 w-full rounded-3xl border border-white/90 bg-white/85 p-8 shadow-[0_20px_50px_rgba(15,39,68,0.16)] backdrop-blur-2xl dark:border-zinc-700/60 dark:bg-zinc-900/85 sm:p-10 lg:my-auto lg:w-[400px]">
                    {/* Page Title */}
                    <div className="mb-8 text-center">
                        <h2 className="text-2xl font-bold tracking-tight text-blue-600 dark:text-blue-500 sm:text-3xl">
                            {title}
                        </h2>
                    </div>

                    {children}
                </div>
            </div>
        </div>
    );
};
