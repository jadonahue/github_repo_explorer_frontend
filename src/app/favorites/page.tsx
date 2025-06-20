'use client';

import { useEffect, useState } from 'react';
import { useAuthStore } from '../store/authStore'; // Get user token
import { Repo } from '../store/repoStore';
import RepoCard from '../components/RepoCard';
import NavBar from '../components/NavBar';

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

                                        setFavorites((prev) =>
                                            prev.filter(
                                                (r) =>
                                                    r.repo_id !== repo.repo_id
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
                </>
            )}
        </div>
    );
};

export default FavoritesPage;
