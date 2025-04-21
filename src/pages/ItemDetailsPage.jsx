import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, getDoc } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailsPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');

    useEffect(() => {
        const fetchItem = async () => {
            try {
                const itemDoc = await getDoc(doc(db, 'items', id));
                if (itemDoc.exists()) {
                    setItem({ id: itemDoc.id, ...itemDoc.data() });
                } else {
                    setError('Item not found');
                }
            } catch (err) {
                setError('Error fetching item: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItem();
    }, [id]);

    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="container mx-auto px-4 py-8">
                <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded relative" role="alert">
                    <strong className="font-bold">Error!</strong>
                    <span className="block sm:inline"> {error}</span>
                </div>
                <button
                    onClick={() => navigate(-1)}
                    className="mt-4 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Go Back
                </button>
            </div>
        );
    }

    if (!item) {
        return null;
    }

    const statusColors = {
        lost: 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-200',
        found: 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-200',
        claimed: 'bg-blue-100 text-blue-800 dark:bg-blue-900/20 dark:text-blue-200'
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <button
                onClick={() => navigate(-1)}
                className="mb-6 flex items-center text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300"
            >
                <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M10 19l-7-7m0 0l7-7m-7 7h18" />
                </svg>
                Back
            </button>

            <div className="bg-white dark:bg-gray-800 shadow rounded-lg overflow-hidden">
                {item.photo_url && (
                    <div className="w-full h-96">
                        <img
                            src={item.photo_url}
                            alt={item.title}
                            className="w-full h-full object-cover"
                        />
                    </div>
                )}

                <div className="p-6">
                    <div className="flex items-center justify-between mb-4">
                        <span className={`px-3 py-1 text-sm font-semibold rounded-full ${statusColors[item.status]}`}>
                            {item.status.toUpperCase()}
                        </span>
                        <span className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(item.createdAt).toLocaleDateString()}
                        </span>
                    </div>

                    <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-2">
                        {item.title}
                    </h1>

                    <p className="text-lg text-gray-500 dark:text-gray-400 mb-4">
                        {item.itemType}
                    </p>

                    <div className="flex items-center text-gray-500 dark:text-gray-400 mb-6">
                        <svg className="h-5 w-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                        </svg>
                        {item.location}
                    </div>

                    <div className="prose dark:prose-invert max-w-none mb-8">
                        <h2 className="text-xl font-semibold mb-2">Description</h2>
                        <p>{item.description}</p>
                    </div>

                    {item.status === 'found' && !item.claimedBy && user && (
                        <button
                            className="w-full bg-blue-600 text-white py-3 px-4 rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                            onClick={() => navigate(`/claim/${item.id}`)}
                        >
                            Claim This Item
                        </button>
                    )}

                    {item.status === 'lost' && item.userId === user?.uid && (
                        <button
                            className="w-full bg-green-600 text-white py-3 px-4 rounded-lg hover:bg-green-700 focus:outline-none focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors"
                            onClick={() => navigate(`/mark-found/${item.id}`)}
                        >
                            Mark as Found
                        </button>
                    )}
                </div>
            </div>
        </div>
    );
} 