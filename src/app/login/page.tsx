'use client'; // Required for using hooks in a Next.js app directory

import { useRouter } from 'next/navigation';
import { loginUser } from '../service/authService'; // Handles API login logic
import { useAuthStore } from '../store/authStore'; // Custom hook for accessing global auth state

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

    // Handle form submit
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error message

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
        }
    };

    return (
        <main className="flex flex-col items-center justify-center min-h-screen">
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
                />

                {/* Password input */}
                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
                    required
                />

                {/* Submit button */}
                <button
                    type="submit"
                    className="w-full bg-amber-300 hover:bg-amber-400 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-gray-600 dark:text-white py-2 rounded-lg transition"
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
                >
                    Register
                </button>
            </div>
        </main>
    );
}
