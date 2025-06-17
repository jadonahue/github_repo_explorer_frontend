'use client';

import { searchGithubRepos } from '../service/repoService'; // Abstracted API call to backend
import { useRepoStore } from '../store/repoStore'; // Custom hook to access global repo state
import RepoCard from '../components/RepoCard'; // Component for displaying individual repos

const HomePage = () => {
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
    } = useRepoStore();

    // Handle search form submission
    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            // Get auth token from localStorage (set at login)
            const token = localStorage.getItem('token'); // or wherever you store it

            if (!token) {
                throw new Error('User not authenticated');
            }

            // Call backend to fetch GitHub repos for the entered username
            const data = await searchGithubRepos(search, token);

            // Store result in global state
            setRepos(data);
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
                {repos.map((repo) => (
                    <RepoCard
                        key={repo.repo_id}
                        name={repo.repo_name}
                        description={repo.description ?? 'No description'}
                        stars={repo.stars}
                        url={repo.url}
                        language={repo.language ?? 'Unknown'}
                    />
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
