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
        // Adjust BACKEND_URL to reflect your current backend path
        `${process.env.NEXT_BACKEND_URL}/user/searchRepo?username=${username}`,
        {
            headers: {
                Authorization: `Bearer ${token}`, // Send token to backend for auth
            },
        }
    );

    // Attempt to parse the backend's response as JSON
    const data: GitHubRepo[] = await response.json();

    // If the response was not OK (e.g. 401, 500), extract the error message
    if (!response.ok) {
        console.error('Backend searchRepo error:', data); // ✅ Log error responses for debugging
        // Type narrowing: if data has a `message` property, use it
        const message =
            typeof data === 'object' && 'message' in data
                ? (data as { message: string }).message
                : 'Failed to fetch GitHub repos';

        throw new Error(message);
    }
    // Debug, Log the raw API response
    console.log('raw GitHub repo response:', data);

    // Convert backend repo shape (GitHubRepo) to frontend Repo shape
    return data.map(
        (repo): Repo => ({
            repo_id: repo.repo_id,
            repo_name: repo.repo_name,
            description: repo.description ?? 'No description', // Provide default description if null
            stars: repo.stars,
            url: repo.html_url,
            language: repo.language ?? 'Unknown', // Provide default language if null
        })
    );
}

/**
 * Save a repository to the user's favorites via backend
 */
export async function saveRepoToFavorites(repo: Repo, token: string) {
    const response = await fetch(
        `${process.env.NEXT_BACKEND_URL}/user/favorites`,
        {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                Authorization: `Bearer ${token}`, // Include auth token in request header
            },
            body: JSON.stringify({
                repo_id: repo.repo_id,
                repo_name: repo.repo_name,
                description: repo.description,
                stars: repo.stars,
                html_url: repo.url,
                language: repo.language,
            }),
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to save favorite');
    }

    return data.favorite; // Return saved favorite data from backend response
}

// Fetch saved favorites from backend
export async function fetchFavorites(token: string): Promise<number[]> {
    const response = await fetch(
        `${process.env.NEXT_BACKEND_URL}/user/favorites`,
        {
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to fetch favorites');
    }

    // Handle the case when backend just returns an array (not wrapped in `favorites`)
    const favoritesArray = Array.isArray(data)
        ? data
        : Array.isArray(data.favorites)
        ? data.favorites
        : [];

    // Convert array of repo objects into array of repo IDs
    return favoritesArray.map((repo: { repo_id: number }) => repo.repo_id);
}

/**
 * Unsave (remove) a repo from the user's favorites
 */
export async function unsaveRepoFromFavorites(repoId: number, token: string) {
    const response = await fetch(
        `${process.env.NEXT_BACKEND_URL}/user/favorites/${repoId}`,
        {
            method: 'DELETE',
            headers: {
                Authorization: `Bearer ${token}`,
            },
        }
    );

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || 'Failed to remove favorite');
    }

    return data;
}
