'use client';

import { useEffect } from 'react';
import {
    searchGithubRepos,
    saveRepoToFavorites,
    unsaveRepoFromFavorites,
    fetchFavorites,
} from '../service/repoService'; // Abstracted API call to backend
import { useRepoStore } from '../store/repoStore'; // Custom hook to access global repo state
import { useAuthStore } from '../store/authStore';
import RepoCard from '../components/RepoCard'; // Component for displaying individual repos
import { markReposWithFavorites } from '../utils/markFavorites';
import { usePathname } from 'next/navigation';
import NavBar from '../components/NavBar';

const HomePage = () => {
    // Get the current JWT token for authentication
    const { token } = useAuthStore();

    // Destructure global state and setters for repos, search term, loading, error, favorites
    const {
        search, // GitHub username entered by user
        setSearch, // Updates the search input value
        repos, // List of repos returned from backend
        setRepos, // Updates the list of repos in state
        error, // Error message to show to user
        setError, // Sets the error message
        loading, // Is data currently being fetched?
        setLoading, // Updates loading status
        favorites, // Favorite repos
        setFavorites, // Sets favorite repos
    } = useRepoStore();

    // Get current route pathname (e.g., '/home')
    const pathname = usePathname();

    // When the user navigates to '/home' and token exists,
    // reload favorites from backend and mark repos accordingly.
    // This keeps favorites in sync when navigating back to home page.
    useEffect(() => {
        if (!token || pathname !== '/home') return; // Only run on /home with valid token

        const updateFavoritesState = async () => {
            try {
                const ids = await fetchFavorites(token); // fetch user's favorite repo IDs
                setFavorites(ids); // update favorites global store

                // Normalize repo_id to number and mark favorites on existing repos
                setRepos((prevRepos) =>
                    markReposWithFavorites(
                        prevRepos.map((r) => ({
                            ...r,
                            repo_id: Number(r.repo_id),
                        })),
                        ids
                    )
                );
            } catch (error) {
                console.error(
                    'Error updating favorites on route change:',
                    error
                );
            }
        };

        updateFavoritesState();
    }, [pathname, token, setFavorites, setRepos]); // Runs when pathname/token change

    // On initial token set or change, load favorites from backend,
    // and mark repos accordingly
    useEffect(() => {
        const loadFavorites = async () => {
            if (!token) return; // exit early if no token

            try {
                const ids = await fetchFavorites(token); // Get saved favorite repo IDs
                console.log('Loaded favorites from backend:', ids);

                setFavorites(ids); // Update global favorites

                // Update repos with isFavorite flag for rendering
                setRepos((prevRepos) => markReposWithFavorites(prevRepos, ids));
            } catch (error) {
                console.error('Failed to load favorites:', error);
            }
        };

        loadFavorites();
    }, [token, setFavorites, setRepos]);

    // Handle user submitting a search for GitHub username repos
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!token) {
                throw new Error('User not authenticated');
            }

            // Search repos from backend (which calls GitHub API)
            const data = await searchGithubRepos(search, token);

            // Normalize repo_id to number for consistent ID matching
            const normalizedRepos = data.map((repo) => ({
                ...repo,
                repo_id: Number(repo.repo_id), // Ensure IDs are numbers for matching
            }));

            // Refresh favorites from backend to ensure current saved repos are synced
            const favoriteIds = (await fetchFavorites(token)).map((id) =>
                Number(id)
            );

            setFavorites(favoriteIds); // Update favorites in global state

            //  Mark repos with isFavorite: true/false
            const updatedRepos = markReposWithFavorites(
                normalizedRepos,
                favoriteIds
            );

            // Save updated list in global store
            setRepos(updatedRepos);
        } catch (error) {
            // Set user-friendly error message
            if (error instanceof Error) {
                setError(error.message);
            } else {
                setError('Something went wrong');
            }
        } finally {
            // Done loading
            setLoading(false);
        }
    };

    return (
        <div>
            <NavBar />
            <div className="flex flex-col items-center justify-center py-10 space-y-4">
                <h2 className="font-bold text-3xl">Home Page</h2>

                {/* Loading state */}
                {loading && (
                    <div className="fixed inset-0 flex flex-col items-center justify-center bg-amber-200 dark:bg-gray-900 text-gray-500 dark:text-cyan-200 bg-opacity-80 z-50 space-y-4">
                        <div className="w-12 h-12 border-4 border-gray-300 border-t-amber-300 dark:border-t-cyan-500 rounded-full animate-spin"></div>
                        <span className="text-gray-700 dark:text-cyan-200 text-sm">
                            Loading repos...
                        </span>
                    </div>
                )}

                {/* Search bar for GitHub username */}
                <form onSubmit={handleSearch}>
                    <input
                        type="text"
                        placeholder="Search github username"
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        className="w-60 border rounded-2xl px-8 py-2 mx-3"
                    />
                    <button type="submit" className="text-2xl">
                        Search
                    </button>
                </form>
            </div>

            {/* Error state */}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            {/* Display repos */}
            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 px-8">
                {repos.map((repo) => {
                    return (
                        <RepoCard
                            key={repo.repo_id}
                            name={repo.repo_name}
                            description={repo.description}
                            stars={repo.stars}
                            url={repo.url}
                            language={repo.language}
                            isFavorite={repo.isFavorite ?? false}
                            // Save repo to favorites
                            onSave={async () => {
                                try {
                                    if (!token)
                                        throw new Error('Not authenticated');
                                    await saveRepoToFavorites(repo, token);
                                    const newFavorites = [
                                        ...favorites,
                                        repo.repo_id,
                                    ];
                                    setFavorites(newFavorites);
                                    setRepos((prevRepos) =>
                                        markReposWithFavorites(
                                            prevRepos,
                                            newFavorites
                                        )
                                    );
                                } catch (error) {
                                    alert('Failed to save repo');
                                    console.error(error);
                                }
                            }}
                            // Remove repo from favorites
                            onUnsave={async () => {
                                try {
                                    if (!token)
                                        throw new Error('Not authenticated');

                                    const repoId = Number(repo.repo_id); // 🧪 normalize to number

                                    await unsaveRepoFromFavorites(
                                        repoId,
                                        token
                                    );

                                    const newFavorites = favorites.filter(
                                        (id) => Number(id) !== repoId
                                    ); // 🧪 ensure match

                                    setFavorites(newFavorites);
                                    setRepos((prevRepos) =>
                                        markReposWithFavorites(
                                            prevRepos,
                                            newFavorites
                                        )
                                    );
                                } catch (error) {
                                    alert('Failed to remove favorite');
                                    console.error(error);
                                }
                            }}
                        />
                    );
                })}
            </ul>
        </div>
    );
};

export default HomePage;
