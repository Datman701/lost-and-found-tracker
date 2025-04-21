import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { db } from '../utils/firebase';
import { doc, getDoc, collection, query, where, getDocs, updateDoc } from 'firebase/firestore';
import { useAuth } from '../context/AuthContext';

export default function ItemDetailPage() {
    const { id } = useParams();
    const navigate = useNavigate();
    const { user } = useAuth();
    const [item, setItem] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [foundReports, setFoundReports] = useState([]);

    // Simple gray placeholder image as data URL
    const placeholderImage = 'data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgZmlsbD0iI2YzZjRmNiIvPjx0ZXh0IHg9IjUwJSIgeT0iNTAlIiBmb250LWZhbWlseT0iQXJpYWwiIGZvbnQtc2l6ZT0iMjQiIGZpbGw9IiM5Y2EzYWYiIHRleHQtYW5jaG9yPSJtaWRkbGUiIGR5PSIuM2VtIj5ObyBJbWFnZTwvdGV4dD48L3N2Zz4=';

    useEffect(() => {
        fetchItem();
        fetchFoundReports();
    }, [id]);

    const fetchItem = async () => {
        try {
            const itemDoc = await getDoc(doc(db, 'items', id));
            if (itemDoc.exists()) {
                setItem({ id: itemDoc.id, ...itemDoc.data() });
            } else {
                setError('Item not found');
            }
        } catch (error) {
            console.error('Error fetching item:', error);
            setError('Error loading item details');
        } finally {
            setLoading(false);
        }
    };

    const fetchFoundReports = async () => {
        try {
            const reportsQuery = query(
                collection(db, 'found_reports'),
                where('item_id', '==', id)
            );
            const reportsSnapshot = await getDocs(reportsQuery);
            const reports = reportsSnapshot.docs.map(doc => ({
                id: doc.id,
                ...doc.data()
            }));
            setFoundReports(reports);
        } catch (error) {
            console.error('Error fetching found reports:', error);
        }
    };

    const handleClaimAction = async (reportId, action) => {
        try {
            const reportRef = doc(db, 'found_reports', reportId);
            const itemRef = doc(db, 'items', id);
            
            if (action === 'accept') {
                // Update report status
                await updateDoc(reportRef, {
                    status: 'confirmed'
                });
                
                // Update item status
                await updateDoc(itemRef, {
                    status: 'found'
                });
            } else {
                // Update report status
                await updateDoc(reportRef, {
                    status: 'rejected'
                });
            }
            
            // Refresh data
            fetchFoundReports();
            fetchItem();
        } catch (error) {
            console.error('Error updating claim:', error);
            setError('Error updating claim status');
        }
    };

    if (loading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (error) {
        return <div className="container mx-auto px-4 py-8 text-red-500">{error}</div>;
    }

    // Use photo_url if available, otherwise use imageUrl, fallback to placeholder
    const imageSource = item.photo_url || item.imageUrl || placeholderImage;

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg overflow-hidden">
                <div className="p-6">
                    <h1 className="text-3xl font-bold mb-4">{item.title}</h1>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div>
                            <div className="aspect-w-16 aspect-h-9 mb-4">
                                <img
                                    src={imageSource}
                                    alt={item.title}
                                    className="object-cover w-full h-48 rounded-lg"
                                    onError={(e) => {
                                        e.target.src = placeholderImage;
                                        e.target.onerror = null;
                                    }}
                                />
                            </div>
                        </div>

                        <div className="space-y-6">
                            <div>
                                <h2 className="text-xl font-semibold mb-2">Description</h2>
                                <p className="text-gray-600 dark:text-gray-300">{item.description}</p>
                            </div>

                            <div>
                                <h2 className="text-xl font-semibold mb-2">Item Details</h2>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    <span className="font-medium">Category:</span> {item.itemType}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    <span className="font-medium">Status:</span>{' '}
                                    <span className={`${
                                        item.status === 'lost' ? 'text-red-500' :
                                        item.status === 'found' ? 'text-green-500' :
                                        'text-yellow-500'
                                    }`}>
                                        {item.status.charAt(0).toUpperCase() + item.status.slice(1)}
                                    </span>
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    <span className="font-medium">Location:</span> {item.location}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    <span className="font-medium">Contact:</span> {item.phoneNumber}
                                </p>
                                <p className="text-gray-600 dark:text-gray-300 mb-2">
                                    <span className="font-medium">Urgency:</span> {item.urgency}
                                </p>
                            </div>

                            {user && user.uid === item.userId && foundReports.length > 0 && (
                                <div>
                                    <h2 className="text-xl font-semibold mb-2">Found Reports</h2>
                                    <div className="space-y-4">
                                        {foundReports.map(report => (
                                            <div key={report.id} className="border rounded-lg p-4">
                                                <p className="font-medium">{report.finder_name}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">{report.message}</p>
                                                <p className="text-sm text-gray-600 dark:text-gray-300">Contact: {report.contact}</p>
                                                {report.status === 'pending' && (
                                                    <div className="mt-2 space-x-2">
                                                        <button
                                                            onClick={() => handleClaimAction(report.id, 'accept')}
                                                            className="bg-green-500 text-white px-3 py-1 rounded hover:bg-green-600"
                                                        >
                                                            Accept
                                                        </button>
                                                        <button
                                                            onClick={() => handleClaimAction(report.id, 'reject')}
                                                            className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600"
                                                        >
                                                            Reject
                                                        </button>
                                                    </div>
                                                )}
                                                {report.status !== 'pending' && (
                                                    <p className="mt-2 text-sm font-medium">
                                                        Status: <span className={report.status === 'confirmed' ? 'text-green-500' : 'text-red-500'}>
                                                            {report.status.charAt(0).toUpperCase() + report.status.slice(1)}
                                                        </span>
                                                    </p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
