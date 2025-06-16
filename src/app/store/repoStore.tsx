'use client';

import { createContext, useContext, useState } from 'react';

interface Repo {
    repo_id: string;
    repo_name: string;
    // Add other fields if needed
}

interface RepoStore {
    search: string;
    setSearch: (s: string) => void;
    repos: Repo[];
    setRepos: (repos: Repo[]) => void;
    loading: boolean;
    setLoading: (l: boolean) => void;
    error: string;
    setError: (e: string) => void;
}

const RepoContext = createContext<RepoStore | undefined>(undefined);

export const RepoProvider = ({ children }: { children: React.ReactNode }) => {
    const [search, setSearch] = useState('');
    const [repos, setRepos] = useState<Repo[]>([]);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

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
            }}
        >
            {children}
        </RepoContext.Provider>
    );
};

export const useRepoStore = () => {
    const context = useContext(RepoContext);
    if (!context) {
        throw new Error('useRepoStore must be used within a RepoProvider');
    }
    return context;
};
