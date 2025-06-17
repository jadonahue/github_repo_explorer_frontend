// Import the local app-level Repo type (used across frontend)
import { Repo } from '../store/repoStore';

// Match the shape of each repo returned from your backend API
export interface GitHubRepo {
    repo_id: number;
    repo_name: string;
    description: string | null;
    stars: number;
    html_url: string;
    language: string | null;
}

/**
 * Fetch GitHub repositories for a given username via the backend.
 * The backend handles calling the GitHub API and returns the repo list.
 */
export async function searchGithubRepos(username: string, token: string) {
    const response = await fetch(
        `http://localhost:3001/user/searchRepo?username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Send token to backend for auth
            },
        }
    );

    // Attempt to parse the backend's response as JSON
    const data: GitHubRepo[] = await response.json();

    // Debug, Log the raw API response
    console.log('raw GitHub repo response:', data);

    // If the response was not OK (e.g. 401, 500), extract the error message
    if (!response.ok) {
        // Type narrowing: if data has a `message` property, use it
        const message =
            typeof data === 'object' && 'message' in data
                ? (data as { message: string }).message
                : 'Failed to fetch GitHub repos';

        throw new Error(message);
    }

    // Convert backend repo shape (GitHubRepo) to frontend Repo shape
    return data.map(
        (repo): Repo => ({
            repo_id: repo.repo_id,
            repo_name: repo.repo_name,
            description: repo.description ?? 'No description',
            stars: repo.stars,
            url: repo.html_url,
            language: repo.language ?? 'Unknown',
        })
    );
}
