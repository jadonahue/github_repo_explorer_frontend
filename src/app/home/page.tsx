'use client';

import { searchGithubRepos } from '../service/repoService'; // Abstracted API call function
import { useRepoStore } from '../store/repoStore';

const HomePage = () => {
    const {
        search,
        setSearch,
        repos,
        setRepos,
        error,
        setError,
        loading,
        setLoading,
    } = useRepoStore();

    const handleSearch = async (e: React.FormEvent) => {
        e.preventDefault();
        setError('');
        setLoading(true);

        try {
            const token = localStorage.getItem('token'); // or wherever you store it

            if (!token) {
                throw new Error('User not authenticated');
            }

            // Call service
            const data = await searchGithubRepos(search, token);

            setRepos(data);
        } catch (err: any) {
            setError(err.message || 'Something went wrong');
        } finally {
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
            <ul>
                {repos.map((repo) => (
                    <li key={repo.repo_id}>{repo.repo_name}</li>
                ))}
            </ul>
        </div>
    );
};

export default HomePage;
