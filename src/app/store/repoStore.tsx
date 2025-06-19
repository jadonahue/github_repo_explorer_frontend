'use client';

import { createContext, useContext, useState } from 'react';

// Define the shape of a single GitHub repo in app
export interface Repo {
    repo_id: number;
    repo_name: string;
    description: string;
    stars: number;
    url: string;
    language: string;
    isFavorite?: boolean; // Flag to mark if repo is favorited by user
}

// Define the shape of the global repo store (what it manages)
interface RepoStore {
    search: string;
    setSearch: (s: string) => void;
    repos: Repo[];
    // setRepos: (repos: Repo[]) => void;
    setRepos: (repos: Repo[] | ((prev: Repo[]) => Repo[])) => void; // Support functional update pattern for setState

    loading: boolean;
    setLoading: (l: boolean) => void;
    error: string;
    setError: (e: string) => void;
    favorites: number[]; // Store repo IDs that are saved
    setFavorites: (ids: number[]) => void;
}

// Create a context object (but without default values)
// We’ll provide the actual values through the provider below
const RepoContext = createContext<RepoStore | undefined>(undefined);

// Context provider component — wraps your app to give access to repo state
export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
    // Local state: managed by useState and shared through context
    const [search, setSearch] = useState(''); // GitHub username input
    const [repos, setRepos] = useState<Repo[]>([]); // List of fetched repos
    const [loading, setLoading] = useState(false); // Indicates fetch in progress
    const [error, setError] = useState(''); // Any error messages to show to user
    const [favorites, setFavorites] = useState<number[]>([]); // Repo IDs user saved as favorites

    return (
        <RepoContext.Provider
            value={{
                search,
                setSearch,
                repos,
                setRepos,
                loading,
                setLoading,
                error,
                setError,
                favorites,
                setFavorites,
            }}
        >
            {children}
        </RepoContext.Provider>
    );
};

// Custom hook to use the repo store in components
// Throws an error if used outside <RepoProvider> to ensure safety
export const useRepoStore = () => {
    const context = useContext(RepoContext);
    if (!context) {
        throw new Error('useRepoStore must be used within a RepoProvider');
    }
    return context;
};
