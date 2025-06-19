'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore'; // Get user token
import { Repo } from '../store/repoStore';
import RepoCard from '../components/RepoCard';

// Displays the user's favorite repositories
const FavoritesPage = () => {
    const { token } = useAuthStore();
    const [favorites, setFavorites] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    // Load favorites from backend when the component mounts or token changes
    useEffect(() => {
        if (!token) return;

        const fetchFavorites = async () => {
            setLoading(true);

            try {
                const res = await fetch(
                    'http://localhost:3001/user/favorites',
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

                const data: Repo[] = await res.json();
                setFavorites(data);
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
    }, [token]);

    // Render: if no token, prompt to log in
    if (!token) return <p>Please login to view favorites.</p>;

    // Render: loading state
    if (loading) return <p>Loading favorites...</p>;

    // Render: error message if fetch failed
    if (error) return <p style={{ color: 'red' }}>{error}</p>;

    // Render: empty state if no favorites
    if (favorites.length === 0) return <p>No favorites saved yet.</p>;

    // Render: user's favorite repos using RepoCard
    return (
        <div>
            <h1 className="text-2xl font-bold mb-4">
                Your Favorite Repositories
            </h1>
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
                {favorites.map((repo) => (
                    <RepoCard
                        key={repo.repo_id}
                        name={repo.repo_name}
                        description={repo.description}
                        stars={repo.stars}
                        url={repo.url}
                        language={repo.language}
                        isFavorite={true}
                        onUnsave={async () => {
                            try {
                                const res = await fetch(
                                    `http://localhost:3001/user/favorites/${repo.repo_id}`,
                                    {
                                        method: 'DELETE',
                                        headers: {
                                            Authorization: `Bearer ${token}`,
                                        },
                                    }
                                );
                                if (!res.ok)
                                    throw new Error(
                                        'Failed to remove favorite'
                                    );

                                // Update UI locally after deletion
                                setFavorites((prev) =>
                                    prev.filter(
                                        (r) => r.repo_id !== repo.repo_id
                                    )
                                );
                            } catch (error) {
                                console.error(error);
                                alert('Error removing favorite');
                            }
                        }}
                    />
                ))}
            </ul>
        </div>
    );
};

export default FavoritesPage;
