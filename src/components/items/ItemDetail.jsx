import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function ItemDetail({ item, onClaim, onDelete, isOwner }) {
    const navigate = useNavigate();

    return (
        <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
            {item.imageUrl && (
                <div className="relative h-64">
                    <img
                        src={item.imageUrl}
                        alt={item.title}
                        className="w-full h-full object-cover"
                    />
                </div>
            )}
            
            <div className="p-6">
                <div className="flex justify-between items-start mb-4">
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                        {item.title}
                    </h2>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${
                        item.status === 'lost' 
                            ? 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                            : 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    }`}>
                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                    </span>
                </div>

                <div className="space-y-4">
                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Description</h3>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{item.description}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Location</h3>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{item.location}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Category</h3>
                        <p className="mt-1 text-gray-900 dark:text-gray-100 capitalize">{item.itemType}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Contact</h3>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{item.phoneNumber}</p>
                    </div>

                    <div>
                        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Posted By</h3>
                        <p className="mt-1 text-gray-900 dark:text-gray-100">{item.userEmail}</p>
                    </div>
                </div>

                <div className="mt-6 flex justify-end space-x-4">
                    {isOwner ? (
                        <>
                            <button
                                onClick={() => navigate(`/edit/${item.id}`)}
                                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                            >
                                Edit
                            </button>
                            <button
                                onClick={() => onDelete(item.id)}
                                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 focus:outline-none focus:ring-2 focus:ring-red-500 focus:ring-offset-2"
                            >
                                Delete
                            </button>
                        </>
                    ) : (
                        <button
                            onClick={() => onClaim(item.id)}
                            className="px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2"
                        >
                            Claim Item
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 