import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { Mail, Eye, EyeOff, Check, X } from 'lucide-react';
import { AuthLayout } from '@/components/auth-layout/auth-layout';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:3000';

export const RegisterPage: React.FC = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [loading, setLoading] = useState(false);
    const navigate = useNavigate();

    const passwordRequirements = [
        { label: '8 characters', met: password.length >= 8 },
        { label: 'Uppercase letter', met: /[A-Z]/.test(password) },
        { label: 'Lowercase letter', met: /[a-z]/.test(password) },
        { label: 'Number', met: /[0-9]/.test(password) },
    ];

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(null);

        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true);

        try {
            const res = await fetch(`${API_URL}/auth/register`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ email, password }),
            });

            const data = await res.json();

            if (!res.ok) {
                throw new Error(data.message || 'Failed to register');
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
        <AuthLayout title="Register">
            {error && (
                <div className="mb-6 rounded-lg bg-red-100 p-3 text-xs text-red-700 dark:bg-red-900/30 dark:text-red-400">
                    {error}
                </div>
            )}

            <form className="space-y-5" onSubmit={handleSubmit}>
                <div className="space-y-4">
                    <div>
                        <div className="relative">
                            <input
                                type="email"
                                required
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                className="block w-full border-0 border-b-2 border-blue-500 bg-transparent py-2.5 pl-0 pr-10 text-slate-800 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-0 dark:border-blue-500 dark:text-white dark:placeholder:text-zinc-500 sm:text-sm"
                                placeholder="Email"
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
                        <div className="mt-2.5 space-y-1.5 text-xs">
                            {passwordRequirements.map((req, index) => (
                                <div
                                    key={index}
                                    className={`flex items-center gap-1.5 transition-colors ${
                                        req.met
                                            ? 'font-medium text-emerald-600 dark:text-emerald-400'
                                            : 'text-slate-400 dark:text-zinc-500'
                                    }`}
                                >
                                    {req.met ? (
                                        <Check className="size-3.5 stroke-[2.5]" />
                                    ) : (
                                        <X className="size-3.5" />
                                    )}
                                    <span>{req.label}</span>
                                </div>
                            ))}
                        </div>
                    </div>

                    <div>
                        <div className="relative">
                            <input
                                type={showConfirmPassword ? 'text' : 'password'}
                                required
                                value={confirmPassword}
                                onChange={(e) =>
                                    setConfirmPassword(e.target.value)
                                }
                                className="block w-full border-0 border-b-2 border-blue-500 bg-transparent py-2.5 pl-0 pr-10 text-slate-800 placeholder:text-slate-400 focus:border-blue-700 focus:outline-none focus:ring-0 dark:border-blue-500 dark:text-white dark:placeholder:text-zinc-500 sm:text-sm"
                                placeholder="Confirm Password"
                            />
                            <button
                                type="button"
                                onClick={() =>
                                    setShowConfirmPassword(!showConfirmPassword)
                                }
                                className="absolute inset-y-0 right-0 flex items-center pr-1 text-blue-600 hover:text-blue-700 focus:outline-none dark:text-blue-400 dark:hover:text-blue-300"
                            >
                                {showConfirmPassword ? (
                                    <EyeOff className="size-5" />
                                ) : (
                                    <Eye className="size-5" />
                                )}
                            </button>
                        </div>
                    </div>
                </div>

                <div className="pt-2">
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full rounded-xl bg-blue-600 py-3 text-sm font-semibold text-white shadow-lg shadow-blue-500/25 transition hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:opacity-50"
                    >
                        {loading ? 'Creating account...' : 'Sign up'}
                    </button>
                </div>
            </form>

            <p className="mt-8 text-center text-xs text-slate-600 dark:text-zinc-400 sm:text-sm">
                Already have an account?{' '}
                <Link
                    to="/login"
                    className="font-semibold text-blue-600 hover:text-blue-700 hover:underline dark:text-blue-400"
                >
                    Log in
                </Link>
            </p>
        </AuthLayout>
    );
};
