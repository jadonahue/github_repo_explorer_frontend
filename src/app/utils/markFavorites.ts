import { Repo } from '../store/repoStore';

export function markReposWithFavorites(
    repos: Repo[],
    favorites: number[]
): Repo[] {
    return repos.map((repo) => ({
        ...repo,
        isFavorite: favorites.includes(repo.repo_id),
    }));
}
