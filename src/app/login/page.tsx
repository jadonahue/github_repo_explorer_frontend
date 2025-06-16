'use client'; // Required for using hooks in a Next.js app directory

import { useRouter } from 'next/navigation';
import { loginUser } from '../service/authService'; // Handles API login logic
import { useAuthStore } from '../store/authStore'; // Custom hook for accessing global auth state

export default function LoginPage() {
    const router = useRouter();

    // Destructure global state and setters from AuthStore
    const { email, setEmail, password, setPassword, error, setError } =
        useAuthStore();

    // Handle form submit
    const handleLogin = async (e: React.FormEvent) => {
        e.preventDefault();
        setError(''); // Reset error message

        try {
            // Call login service with email and password
            const data = await loginUser(email, password);

            // Store token locally (for now using localStorage; could switch to cookies later)
            localStorage.setItem('token', data.token);

            // Redirect to home or favorites after successful login
            router.push('/home');
        } catch (error) {
            // On failure, display a generic error
            console.error('Login error:', error);
            setError('Something went wrong. Try again.');
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-50">
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
                    className="w-full bg-blue-600 text-white py-2 rounded-lg hover:bg-blue-700 transition"
                >
                    Log In
                </button>
            </form>
        </main>
    );
}
