import { Link } from 'react-router-dom';
import { useState } from 'react';
import ReportFoundItemForm from '../ReportFoundItemForm';

export default function ItemCard({ id, title, description, itemType, status, location, createdAt, photo_url, imageUrl, onViewDetails, userId }) {
    const [showReportForm, setShowReportForm] = useState(false);
    
    const statusColors = {
        lost: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
        found: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
        claimed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    };

    // Simple gray placeholder image as data URL
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

    const handleReportFound = (e) => {
        e.preventDefault();
        e.stopPropagation();
        setShowReportForm(true);
    };

    // Use photo_url if available, otherwise use imageUrl
    const imageSource = photo_url || imageUrl || placeholderImage;

    return (
        <>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden hover:shadow-lg transition-shadow duration-300">
                <div className="relative aspect-w-16 aspect-h-9">
                    <img
                        src={imageSource}
                        alt={title}
                        className="w-full h-48 object-cover"
                        onError={(e) => {
                            e.target.src = placeholderImage;
                            e.target.onerror = null;
                        }}
                    />
                    <div className="absolute top-2 right-2">
                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${statusColors[status]}`}>
                            {status.toUpperCase()}
                        </span>
                    </div>
                    {status === 'lost' && (
                        <button
                            onClick={handleReportFound}
                            className="absolute top-2 left-2 bg-green-600 text-white px-2 py-1 text-xs font-semibold rounded-full hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                        >
                            Report Found
                        </button>
                    )}
                </div>
                <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(createdAt).toLocaleDateString()}
                        </span>
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
                        {title}
                    </h3>
                    <p className="text-sm text-gray-500 dark:text-gray-400 mb-2">
                        {itemType}
                    </p>
                    <p className="text-gray-600 dark:text-gray-300 text-sm mb-4 line-clamp-2">
                        {description}
                    </p>
                    <div className="flex items-center text-sm text-gray-500 dark:text-gray-400 mb-4">
                        <svg className="h-4 w-4 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {location}
                    </div>
                    <Link
                        to={`/item/${id}`}
                        className="block w-full text-center bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                    >
                        View Details
                    </Link>
                </div>
            </div>

            {showReportForm && (
                <ReportFoundItemForm 
                    lostItem={{ id, title, description, userId }}
                    onClose={() => setShowReportForm(false)}
                />
            )}
        </>
    );
} 