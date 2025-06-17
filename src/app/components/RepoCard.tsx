import React from 'react';

interface RepoCardProps {
    name: string;
    description: string;
    stars: number;
    url: string;
    language: string;
    onSave?: () => void;
    isFavorite?: boolean;
}

const RepoCard: React.FC<RepoCardProps> = ({
    name,
    description,
    stars,
    url,
    language,
    onSave,
    isFavorite,
}) => {
    return (
        <div className="bg-white shadow-md rounded-2xl p-4 space-y-2 hover:shadow-lg transition">
            <div className="flex justify-between items-start">
                <h2 className="text-xl font-semibold text-blue-600">
                    <a href={url} target="_blank" rel="noopener noreferrer">
                        {name}
                    </a>
                </h2>

                {onSave && (
                    <button
                        onClick={onSave}
                        className="text-sm bg-blue-100 text-blue-600 px-3 py-1 rounded-md hover:bg-blue-200"
                    >
                        {isFavorite ? 'Saved' : 'Save'}
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
