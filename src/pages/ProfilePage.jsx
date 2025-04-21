import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { db } from '../utils/firebase';
import { collection, query, where, getDocs, doc, updateDoc, getDoc } from 'firebase/firestore';
import ProfileHeader from '../components/profile/ProfileHeader';
import ProfileStats from '../components/profile/ProfileStats';
import ProfileTabs from '../components/profile/ProfileTabs';
import ItemList from '../components/items/ItemList';

export default function ProfilePage() {
    const navigate = useNavigate();
    const { user, userLoggedIn, loading: authLoading } = useAuth();
    const [activeTab, setActiveTab] = useState('posted');
    const [items, setItems] = useState([]);
    const [pendingClaims, setPendingClaims] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (authLoading) return;
        
        if (!userLoggedIn) {
            navigate('/login');
            return;
        }
        
        fetchItems();
    }, [user, userLoggedIn, authLoading, activeTab, navigate]);

    useEffect(() => {
        if (activeTab === 'pending') {
            fetchPendingClaims();
        }
    }, [activeTab]);

    const fetchItems = async () => {
        if (!user) return;
        
        try {
            let itemsQuery;
            if (activeTab === 'posted') {
                itemsQuery = query(collection(db, 'items'), where('userId', '==', user.uid));
            } else if (activeTab === 'claimed') {
                itemsQuery = query(collection(db, 'items'), where('claimed_by', '==', user.uid));
            }
            
            if (itemsQuery) {
                const querySnapshot = await getDocs(itemsQuery);
                const itemsData = querySnapshot.docs.map(doc => ({
                    id: doc.id,
                    ...doc.data()
                }));
                setItems(itemsData);
            }
        } catch (error) {
            console.error('Error fetching items:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchPendingClaims = async () => {
        if (!user) return;
        
        try {
            console.log('Current user ID:', user.uid);
            
            const claimsQuery = query(
                collection(db, 'found_reports'),
                where('status', '==', 'pending')
            );
            
            const claimsSnapshot = await getDocs(claimsQuery);
            console.log('Total pending claims found:', claimsSnapshot.size);
            
            const claimsData = await Promise.all(claimsSnapshot.docs.map(async (claimDoc) => {
                const claim = { id: claimDoc.id, ...claimDoc.data() };
                console.log('Processing claim:', claim);
                
                const itemDocRef = doc(db, 'items', claim.lostItemId);
                const itemDoc = await getDoc(itemDocRef);
                console.log('Associated item:', itemDoc.exists() ? itemDoc.data() : 'Item not found');
                
                if (itemDoc.exists() && itemDoc.data().userId === user.uid) {
                    console.log('Claim matches current user');
                    return {
                        ...claim,
                        item: { id: itemDoc.id, ...itemDoc.data() }
                    };
                }
                console.log('Claim does not match current user');
                return null;
            }));
            
            const filteredClaims = claimsData.filter(claim => claim !== null);
            console.log('Final filtered claims:', filteredClaims);
            
            setPendingClaims(filteredClaims);
        } catch (error) {
            console.error('Error fetching pending claims:', error);
        }
    };

    const handleAcceptClaim = async (claimId, itemId) => {
        if (!user) return;
        
        try {
            await updateDoc(doc(db, 'found_reports', claimId), {
                status: 'confirmed'
            });

            await updateDoc(doc(db, 'items', itemId), {
                status: 'found'
            });

            fetchPendingClaims();
            fetchItems();
        } catch (error) {
            console.error('Error accepting claim:', error);
        }
    };

    const handleRejectClaim = async (claimId) => {
        if (!user) return;
        
        try {
            await updateDoc(doc(db, 'found_reports', claimId), {
                status: 'rejected'
            });
            fetchPendingClaims();
        } catch (error) {
            console.error('Error rejecting claim:', error);
        }
    };

    const calculateStats = () => {
        if (!user) return { postedItems: 0, claimedItems: 0, activeItems: 0 };
        
        const postedItems = items.filter(item => item.userId === user.uid).length;
        const claimedItems = items.filter(item => item.claimed_by === user.uid).length;
        const activeItems = items.filter(item => item.status === 'lost').length;

        return {
            postedItems,
            claimedItems,
            activeItems
        };
    };

    if (authLoading) {
        return <div className="container mx-auto px-4 py-8">Loading...</div>;
    }

    if (!userLoggedIn) {
        return null;
    }

    const renderContent = () => {
        if (loading) {
            return <div>Loading...</div>;
        }

        if (activeTab === 'pending') {
            return (
                <div className="space-y-4">
                    {pendingClaims.length === 0 ? (
                        <p className="text-gray-500 dark:text-gray-400">No pending claims</p>
                    ) : (
                        pendingClaims.map((claim) => (
                            <div key={claim.id} className="bg-white dark:bg-gray-800 rounded-lg shadow p-4">
                                <div className="flex items-center justify-between">
                                    <div className="flex space-x-4">
                                        {claim.photo_url && (
                                            <img 
                                                src={claim.photo_url} 
                                                alt="Found item" 
                                                className="w-24 h-24 object-cover rounded-lg"
                                            />
                                        )}
                                        <div>
                                            <h3 className="text-lg font-medium">{claim.item?.title}</h3>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Reported by: {claim.finderName}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Location: {claim.location}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Contact: {claim.contact}
                                            </p>
                                            <p className="text-sm text-gray-500 dark:text-gray-400">
                                                Message: {claim.message}
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex space-x-2">
                                        <button
                                            onClick={() => handleAcceptClaim(claim.id, claim.lostItemId)}
                                            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
                                        >
                                            Accept
                                        </button>
                                        <button
                                            onClick={() => handleRejectClaim(claim.id)}
                                            className="px-4 py-2 bg-red-500 text-white rounded hover:bg-red-600"
                                        >
                                            Reject
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))
                    )}
                </div>
            );
        }

        return <ItemList items={items} />;
    };

    return (
        <div className="container mx-auto px-4 py-8">
            <ProfileHeader user={user} />
            <ProfileStats stats={calculateStats()} />
            <ProfileTabs activeTab={activeTab} onTabChange={setActiveTab} />
            {renderContent()}
        </div>
    );
}