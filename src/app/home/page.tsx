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
import NavBar from '../components/NavBar';

const HomePage = () => {
    // Destructure token from authStore
    const { token } = useAuthStore();

    // Destructure global state and updater functions from the store
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

    // On token change, load user's favorites from backend
    useEffect(() => {
        const loadFavorites = async () => {
            if (!token) return; // Exit if not logged in

            try {
                const ids = await fetchFavorites(token); // Get saved repo_ids
                console.log('Loaded favorites from backend:', ids);

                setFavorites(ids); // Save favorites in global store

                // Update each repo's isFavorite flag based on saved IDs
                setRepos((prevRepos) => markReposWithFavorites(prevRepos, ids));
            } catch (error) {
                console.error('Failed to load favorites:', error);
            }
        };

        loadFavorites();
    }, [token, setFavorites, setRepos]);

    // Handle form submit: fetch GitHub repos for given username
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!token) {
                throw new Error('User not authenticated');
            }

            // Call backend -> GitHub API -> return repo list
            const data = await searchGithubRepos(search, token);

            // Normalize repo_id to number for consistent comparison
            const normalizedRepos = data.map((repo) => ({
                ...repo,
                repo_id: Number(repo.repo_id), // Ensure IDs are numbers for matching
            }));

            // Reload fresh favorite IDs in case they changed
            const favoriteIds = (await fetchFavorites(token)).map((id) =>
                Number(id)
            );

            setFavorites(favoriteIds); // Sync global favorites state

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

            {/* Loading state */}
            {loading && <p>Loading...</p>}

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
                                    await unsaveRepoFromFavorites(
                                        repo.repo_id,
                                        token
                                    );
                                    const newFavorites = favorites.filter(
                                        (id) => id !== repo.repo_id
                                    );
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
