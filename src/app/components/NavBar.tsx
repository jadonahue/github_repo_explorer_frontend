'use client';

import React, { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore';
import { useRouter } from 'next/navigation';

const NavBar = () => {
    const router = useRouter();
    const { token, setToken, clearToken } = useAuthStore();
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    // Sync with localStorage on refresh
    useEffect(() => {
        const storedToken = localStorage.getItem('token');
        if (storedToken && !token) {
            setToken(storedToken);
        }

        setIsLoggedIn(!!(token || storedToken));
    }, [token, setToken]);

    const handleLogout = () => {
        clearToken(); // clear from store
        localStorage.removeItem('token'); // clear from storage
        setIsLoggedIn(false);
        router.push('/login'); // Redirect to home or login page
    };

    return (
        <nav className="w-full bg-amber-200 dark:bg-gray-900 text-gray-500 dark:text-cyan-200 px-8 py-3 flex justify-between items-center">
            <div className="text-lg font-bold">GitHub Repo Explorer</div>
            <div className="space-x-4">
                {isLoggedIn ? (
                    <>
                        <button
                            onClick={() => router.push('/home')}
                            className="hover:underline"
                        >
                            Home
                        </button>
                        <button
                            onClick={() => router.push('/favorites')}
                            className="hover:underline"
                        >
                            Favorites
                        </button>
                        <button
                            onClick={handleLogout}
                            className="text-red-400 hover:underline"
                        >
                            Logout
                        </button>
                    </>
                ) : (
                    <>
                        <button
                            onClick={() => router.push('/login')}
                            className="hover:underline"
                        >
                            Login
                        </button>
                        <button
                            onClick={() => router.push('/register')}
                            className="hover:underline"
                        >
                            Register
                        </button>
                    </>
                )}
            </div>
        </nav>
    );
};

export default NavBar;
