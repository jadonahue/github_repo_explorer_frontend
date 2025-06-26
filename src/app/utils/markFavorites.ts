import { Repo } from '../store/repoStore';

// Adds an `isFavorite` boolean flag to each repo in the list,
// indicating whether the repo's ID exists in the user's favorites.
export function markReposWithFavorites(
    repos: Repo[],
    favorites: (string | number)[]
): Repo[] {
    // Normalize favorite IDs to numbers for consistent comparison
    const favoriteIds = favorites.map(Number);

    // Return a new array where each repo has isFavorite set to true or false
    return repos.map((repo) => ({
        ...repo,
        // Also ensure repo_id is a number before checking if it's in favorites
        isFavorite: favoriteIds.includes(Number(repo.repo_id)), // also ensure repo_id is number
    }));
}
