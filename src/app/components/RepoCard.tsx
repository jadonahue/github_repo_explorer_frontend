import React from 'react';

interface RepoCardProps {
    name: string;
    description: string;
    stars: number;
    url: string;
    language: string;
    onSave?: () => void;
    onUnsave?: () => void;
    isFavorite?: boolean;
}

const RepoCard: React.FC<RepoCardProps> = ({
    name,
    description,
    stars,
    url,
    language,
    onSave,
    onUnsave,
    isFavorite,
}) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 space-y-2 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold truncate max-w-full text-gray-500 dark:text-cyan-600">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {name}
                    </a>
                </h2>

                {(onSave || onUnsave) && (
                    <button
                        onClick={isFavorite ? onUnsave : onSave}
                        className={`px-4 py-2 rounded transition-colors duration-300 ${
                            isFavorite
                                ? 'bg-red-500 hover:bg-red-600 text-white'
                                : 'bg-amber-300 hover:bg-amber-400 dark:bg-cyan-500 dark:hover:bg-cyan-600 text-gray-600 dark:text-white'
                        }`}
                    >
                        {isFavorite ? 'Unsave' : 'Save'}
                    </button>
                )}
            </div>

            <p className="text-gray-700 text-sm">
                {description || 'No description'}
            </p>

            <div className="text-sm text-gray-500 flex justify-between">
                <span>⭐ {stars}</span>
                <span>{language || 'N/A'}</span>
            </div>
        </div>
    );
};

export default RepoCard;
