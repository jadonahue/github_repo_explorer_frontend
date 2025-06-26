'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore'; // Auth token access
import { useRepoStore } from '../store/repoStore'; // Repo & favorite state management
import RepoCard from '../components/RepoCard'; // UI component for each repo
import NavBar from '../components/NavBar';
import { markReposWithFavorites } from '../utils/markFavorites'; // Adds isFavorite flag to repo list

// Displays the user's saved repositories
const FavoritesPage = () => {
    const { token } = useAuthStore();

    // Global state: list of favorite repo IDs and all repos
    const { favorites, setFavorites, repos, setRepos } = useRepoStore();

    // Local UI state
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load favorites from backend when the component mounts or token changes
    useEffect(() => {
        if (!token) return;

        const fetchFavorites = async () => {
            setLoading(true);

            try {
                const res = await fetch(
                    `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/favorites`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!res.ok) {
                    const data = await res.json();
                    throw new Error(
                        data.message || 'Failed to fetch favorites'
                    );
                }

                // Raw favorites: [{ repo_id: ... }]
                const data = await res.json();

                // Normalize repo IDs to numbers for matching
                const favIds = data.map((repo: { repo_id: string | number }) =>
                    Number(repo.repo_id)
                );
                setFavorites(favIds); // Update global favorites store with IDs

                // Apply isFavorite: true/false to global repo list
                setRepos((prevRepos) =>
                    markReposWithFavorites(prevRepos, favIds)
                );
            } catch (error) {
                if (error instanceof Error) {
                    setError(error.message);
                } else {
                    setError('An unknown error occurred');
                }
            } finally {
                setLoading(false);
            }
        };

        fetchFavorites();
    }, [token, setFavorites, setRepos]); // added setFavorites, setRepos to deps

    // 💔 Handle removing a repo from favorites
    const handleUnsave = async (repo_id: number) => {
        if (!token) return;
        try {
            const res = await fetch(
                `${process.env.NEXT_PUBLIC_BACKEND_URL}/user/favorites/${repo_id}`,
                {
                    method: 'DELETE',
                    headers: { Authorization: `Bearer ${token}` },
                }
            );

            if (!res.ok) throw new Error('Failed to remove favorite');

            // Update global favorites state
            const newFavorites = favorites.filter((id) => id !== repo_id);
            setFavorites(newFavorites);

            // Re-flag repos with isFavorite: false where needed
            setRepos((prevRepos) =>
                markReposWithFavorites(prevRepos, newFavorites)
            );
        } catch (error) {
            console.error(error);
            alert('Error removing favorite');
        }
    };

    return (
        <div>
            <NavBar />
            {/* Show login prompt if not logged in */}
            {!token && <p>Please login to view favorites.</p>}
            {/* Show loading spinner */}
            {token && loading && <p>Loading favorites...</p>}
            {/* Show error message */}
            {token && error && <p style={{ color: 'red' }}>{error}</p>}
            {/* Show empty state */}
            {token && !loading && favorites.length === 0 && (
                <p>No favorites saved yet.</p>
            )}
            {/* Show favorites list */}
            {token && !loading && favorites.length > 0 && (
                <>
                    <h1 className="text-2xl font-bold mb-4">
                        Your Favorite Repositories
                    </h1>
                    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-8">
                        {repos
                            .filter((repo) => favorites.includes(repo.repo_id)) // Only show repos whose IDs are in favorites
                            .map((repo) => (
                                <RepoCard
                                    key={repo.repo_id}
                                    name={repo.repo_name}
                                    description={repo.description}
                                    stars={repo.stars}
                                    url={repo.url}
                                    language={repo.language}
                                    isFavorite={true}
                                    onUnsave={() => handleUnsave(repo.repo_id)}
                                />
                            ))}
                    </ul>
                </>
            )}
        </div>
    );
};

export default FavoritesPage;
