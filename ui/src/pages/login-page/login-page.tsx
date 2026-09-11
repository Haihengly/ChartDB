import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff } from 'lucide-react';
import { AuthLayout } from '@/components/auth-layout/auth-layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const LoginPage: React.FC = () => {
    const [emailOrUsername, setEmailOrUsername] = useState('');
    const [password, setPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);
        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/login`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ emailOrUsername, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to login');
            }

            localStorage.setItem('auth_token', data.access_token);
            localStorage.setItem('auth_user', JSON.stringify(data.user));
            navigate('/');
        } catch (err: unknown) {
            if (err instanceof Error) {
                setError(err.message);
            } else {
                setError('An error occurred');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <AuthLayout title="Login">
            {error && (
                <div className="mb-6 rounded-lg bg-red-100 p-3 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <form className="space-y-6" onSubmit={handleSubmit}>
                <div className="space-y-6">
                    <div>
                        <div className="relative">
                            <input
                                type="text"
                                required
                                value={emailOrUsername}
                                onChange={(e) =>
                                    setEmailOrUsername(e.target.value)
                                }
                                className="block w-full border-0 border-b-2 border-blue-500 bg-transparent py-2.5 pl-0 pr-10 text-slate-800 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-0 dark:border-blue-500 dark:text-white dark:placeholder:text-zinc-500 sm:text-sm"
                                placeholder="Email or Username"
                            />
                            <div className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-1">
                                <Mail className="size-5 text-blue-600 dark:text-blue-400" />
                            </div>
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                type={showPassword ? 'text' : 'password'}
                                required
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                className="block w-full border-0 border-b-2 border-blue-500 bg-transparent py-2.5 pl-0 pr-10 text-slate-800 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-0 dark:border-blue-500 dark:text-white dark:placeholder:text-zinc-500 sm:text-sm"
                                placeholder="Password"
                            />
                            <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="absolute inset-y-0 right-0 flex items-center pr-1 text-blue-600 hover:text-blue-700 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {showPassword ? (
                                    <EyeOff className="size-5" />
                                ) : (
                                    <Eye className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="flex items-center justify-between pt-1">
                    <label className="flex cursor-pointer items-center gap-2 text-xs text-slate-700 dark:text-zinc-300 sm:text-sm">
                        <input
                            id="remember-me"
                            name="remember-me"
                            type="checkbox"
                            className="size-4 rounded border-slate-300 text-blue-600 focus:ring-blue-500 dark:border-zinc-600 dark:bg-zinc-800"
                        />
                        <span>Remember me</span>
                    </label>

                    <a
                        href="#"
                        className="text-xs font-medium text-blue-600 hover:text-blue-700 dark:text-blue-400 sm:text-sm"
                    >
                        Forgot Password?
                    </a>
                </div>

                <div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Logging in...' : 'Login'}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-xs text-slate-600 dark:text-zinc-400 sm:text-sm">
                Don't have an account?{' '}
                <Link
                    to="/register"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                >
                    Register
                </Link>
            </p>
        </AuthLayout>
    );
};
