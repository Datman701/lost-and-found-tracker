import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { collection, query, where, getDocs } from 'firebase/firestore';
import { db } from '../utils/firebase';
import { useAuth } from '../context/AuthContext';
import ItemList from '../components/items/ItemList';
import ItemFilters from '../components/items/ItemFilters';

export default function FoundItemsPage() {
    const navigate = useNavigate();
    const { user } = useAuth();
    const [items, setItems] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState('');
    const [filters, setFilters] = useState({
        search: '',
        category: '',
        sortBy: 'newest'
    });

    useEffect(() => {
        const fetchItems = async () => {
            try {
                const itemsQuery = query(
                    collection(db, 'items'),
                    where('status', '==', 'found')
                );
                const snapshot = await getDocs(itemsQuery);
                const itemsData = snapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setItems(itemsData);
            } catch (err) {
                setError('Error fetching items: ' + err.message);
            } finally {
                setLoading(false);
            }
        };

        fetchItems();
    }, []);

    const handleFilterChange = (filterName, value) => {
        setFilters(prev => ({
            ...prev,
            [filterName]: value
        }));
    };

    const filteredItems = items
        .filter(item => {
            const matchesSearch = item.title.toLowerCase().includes(filters.search.toLowerCase()) ||
                                item.description.toLowerCase().includes(filters.search.toLowerCase());
            const matchesCategory = !filters.category || item.itemType === filters.category;
            return matchesSearch && matchesCategory;
        })
        .sort((a, b) => {
            switch (filters.sortBy) {
                case 'oldest':
                    return new Date(a.createdAt) - new Date(b.createdAt);
                case 'urgent':
                    return b.urgency - a.urgency;
                default: // newest
                    return new Date(b.createdAt) - new Date(a.createdAt);
            }
        });

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                    Found Items
                </h1>
                <button
                    onClick={() => navigate('/found/post')}
                    className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
                >
                    Report Found Item
                </button>
            </div>

            <ItemFilters
                filters={filters}
                onFilterChange={handleFilterChange}
            />

            <ItemList
                items={filteredItems}
                loading={loading}
                error={error}
            />
        </div>
    );
} 