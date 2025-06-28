'use client';

import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { registerUser } from '../service/authService';

export default function RegisterPage() {
    const router = useRouter();

    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        setError,
        setToken,
    } = useAuthStore();

    // Add local state for confirm password
    const [confirmPassword, setConfirmPassword] = useState('');
    const [loading, setLoading] = useState(false); // Loading state while user creation occurs

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate confirm password matches password
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        setLoading(true); // Start loading
        try {
            const data = await registerUser(email, password); // Call the backend
            setToken(data.token); // Save token globally + localStorage
            router.push('/home'); // Redirect after register
        } catch (err) {
            console.error('Register error:', err);
            setError('Registration failed. Try again.');
        } finally {
            setLoading(false); // Stop loading
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            {/* Loading message */}
            {loading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-200 dark:bg-gray-900 text-gray-500 dark:text-cyan-200 bg-opacity-80 z-50 space-y-4">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-amber-300 dark:border-t-cyan-500 rounded-full animate-spin"></div>
                    <span className="text-gray-700 dark:text-cyan-200 text-sm">
                        Creating account...
                    </span>
                </div>
            )}
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">
                    Create Account
                </h1>

                {/* Error message */}
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    disabled={loading} // Disable inputs while loading
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    disabled={loading} // Disable inputs while loading
                />

                <input
                    type="password"
                    placeholder="Confirm Password"
                    value={confirmPassword}
                    onChange={(e) => {
                        setConfirmPassword(e.target.value);
                    }}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
                    disabled={loading} // Disable inputs while loading
                />

                <button
                    type="submit"
                    disabled={loading} // Disable button while loading
                    className={`w-full py-2 rounded-lg transition ${
                        loading
                            ? 'bg-gray-300 text-gray-500 cursor-not-allowed'
                            : 'bg-amber-300 hover:bg-amber-400 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-gray-600 dark:text-white'
                    }`}
                >
                    {loading ? 'Signing Up...' : 'Sign Up'}
                </button>
            </form>
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-600 dark:text-slate-500">
                    Already have an account?
                </span>
                <button
                    onClick={() => router.push('/login')}
                    className="ml-2 text-amber-400 dark:text-cyan-500 hover:underline"
                    disabled={loading}
                >
                    Login
                </button>
            </div>
        </main>
    );
}
