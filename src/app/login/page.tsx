'use client'; // Required for using hooks in a Next.js app directory

import { useRouter } from 'next/navigation';
import { loginUser } from '../service/authService'; // Handles API login logic
import { useAuthStore } from '../store/authStore'; // Custom hook for accessing global auth state
import { useState } from 'react';

export default function LoginPage() {
    const router = useRouter();

    // Destructure global state and setters from AuthStore
    const {
        email,
        setEmail,
        password,
        setPassword,
        error,
        setError,
        setToken,
    } = useAuthStore();

    // Local state for showing loading spinner during login
    const [loading, setLoading] = useState(false);

    // Handle form submit
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error message
        setLoading(true); // Start loading spinner

        try {
            // Call login service with email and password
            const data = await loginUser(email, password);

            setToken(data.token); // Store JWT token globally

            // Reset email and password field to emtpy
            setEmail('');
            setPassword('');

            // Redirect to home or favorites after successful login
            router.push('/home');
        } catch (error) {
            // On failure, display a generic error
            console.error('Login error:', error);
            setError('Something went wrong. Try again.');
        } finally {
            setLoading(false); // Stop loading spinner
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
            <div className="text-center mb-10 px-4">
                <h1 className="text-3xl font-bold">
                    Discover Hidden Gems on GitHub
                </h1>
                <p className="mt-2 text-gray-600 dark:text-slate-500 text-sm max-w-md mx-auto">
                    Search for trending, interesting, or personal repositories.
                    Save your favorites, revisit them anytime, and explore the
                    open-source universe.
                </p>
            </div>

            {/* Loading login message */}
            {loading && (
                <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-200 dark:bg-gray-900 text-gray-500 dark:text-cyan-200 bg-opacity-80 z-50 space-y-4">
                    <div className="w-12 h-12 border-4 border-gray-300 border-t-amber-300 dark:border-t-cyan-500 rounded-full animate-spin"></div>
                    <span className="text-gray-700 dark:text-cyan-200 text-sm">
                        Logging in...
                    </span>
                </div>
            )}
            <form
                onSubmit={handleLogin}
                className="bg-white p-8 rounded-2xl shadow-lg w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">Login</h1>

                {/* Show error if it exists */}
                {error && (
                    <div className="text-red-500 text-sm text-center">
                        {error}
                    </div>
                )}

                {/* Email input */}
                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                />

                {/* Password input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                    disabled={loading}
                />

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-amber-300 hover:bg-amber-400 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-gray-600 dark:text-white py-2 rounded-lg transition"
                    disabled={loading}
                >
                    Log In
                </button>
            </form>

            {/* Link to registration page */}
            <div className="mt-4 text-center">
                <span className="text-sm text-gray-600 dark:text-slate-500">
                    Don’t have an account?
                </span>
                <button
                    onClick={() => router.push('/register')}
                    className="ml-2 text-amber-400 dark:text-cyan-500 hover:underline"
                    disabled={loading}
                >
                    Register
                </button>
            </div>
        </main>
    );
}
