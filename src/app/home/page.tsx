'use client';

import { useEffect } from 'react';
import {
    searchGithubRepos,
    saveRepoToFavorites,
    fetchFavorites,
} from '../service/repoService'; // Abstracted API call to backend
import { useRepoStore } from '../store/repoStore'; // Custom hook to access global repo state
import { useAuthStore } from '../store/authStore';
import RepoCard from '../components/RepoCard'; // Component for displaying individual repos
import { markReposWithFavorites } from '../utils/markFavorites';

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

    useEffect(() => {
        if (token) {
            fetchFavorites(token)
                .then((ids) => {
                    console.log('Loaded favorites from backend:', ids);
                    setFavorites(ids);

                    // Mark any previously loaded repos as favorites
                    setRepos((prevRepos) =>
                        markReposWithFavorites(prevRepos, ids)
                    );
                })
                .catch((err) => {
                    console.error('Failed to load favorites:', err);
                });
        }
    }, [token, setFavorites, setRepos]);

    // Handle search form submission
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            if (!token) {
                throw new Error('User not authenticated');
            }

            // Call backend to fetch GitHub repos for the entered username
            const data = await searchGithubRepos(search, token);

            const normalizedRepos = data.map((repo) => ({
                ...repo,
                repo_id: Number(repo.repo_id), // Ensure IDs are numbers for matching
            }));

            // Get fresh list of favorites (after refresh)
            const favoriteIds = (await fetchFavorites(token)).map((id) =>
                Number(id)
            );

            setFavorites(favoriteIds); // update global store so rest of UI also syncs

            // ✅ Mark each repo with isFavorite
            const updatedRepos = markReposWithFavorites(
                normalizedRepos,
                favoriteIds
            );

            // ✅ Update global repo list
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
            <div>Home Page</div>
            <form onSubmit={handleSearch}>
                <input
                    type="text"
                    placeholder="search github repos"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                />
                <button type="submit">Search</button>
            </form>

            {loading && <p>Loading...</p>}
            {error && <p style={{ color: 'red' }}>{error}</p>}

            <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
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
                            onSave={async () => {
                                try {
                                    if (!token)
                                        throw new Error('Not authenticated');
                                    await saveRepoToFavorites(repo, token);
                                    alert('Saved to favorites!');

                                    const newFavorites = [
                                        ...favorites,
                                        repo.repo_id,
                                    ];
                                    setFavorites(newFavorites);

                                    // Re-mark all repos with new favorites
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
                        />
                    );
                })}
            </ul>
        </div>
    );
};

export default HomePage;
