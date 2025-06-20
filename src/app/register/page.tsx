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

    const handleRegister = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');

        // Validate confirm password matches password
        if (password !== confirmPassword) {
            setError('Passwords do not match');
            return;
        }

        try {
            const data = await registerUser(email, password); // Call the backend
            setToken(data.token); // Save token globally + localStorage
            router.push('/home'); // Redirect after register
        } catch (err) {
            console.error('Register error:', err);
            setError('Registration failed. Try again.');
        }
    };

    return (
        <main className="flex items-center justify-center min-h-screen bg-gray-100">
            <form
                onSubmit={handleRegister}
                className="bg-white p-8 rounded-2xl shadow-md w-full max-w-sm space-y-4"
            >
                <h1 className="text-2xl font-bold text-center">
                    Create Account
                </h1>

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
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full border border-gray-300 rounded-lg px-4 py-2"
                    required
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
                />

                <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700"
                >
                    Sign Up
                </button>
            </form>
        </main>
    );
}
