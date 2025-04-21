import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, useNavigate } from "react-router-dom";
import { db } from "../utils/firebase";
import { collection, query, where, getDocs } from "firebase/firestore";
import WelcomeBanner from "../components/WelcomeBanner";
import QuickActionCard from "../components/QuickActionCard";
import StatisticsCard from "../components/StatisticsCard";

export default function HomePage() {
    const { user, userLoggedIn } = useAuth();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        lostItems: 0,
        foundItems: 0,
    });

    useEffect(() => {
        const fetchStats = async () => {
            if (!user) return;

            try {
                // Get lost items count
                const lostItemsQuery = query(collection(db, 'items'), where('status', '==', 'lost'));
                const lostSnapshot = await getDocs(lostItemsQuery);
                
                // Get found items count
                const foundItemsQuery = query(collection(db, 'items'), where('status', '==', 'found'));
                const foundSnapshot = await getDocs(foundItemsQuery);
                
                setStats({
                    lostItems: lostSnapshot.size,
                    foundItems: foundSnapshot.size,
                });
            } catch (error) {
                console.error('Error fetching stats:', error);
            }
        };

        fetchStats();
    }, [user]);

    if (!userLoggedIn) {
        return <Navigate to="/login" replace={true} />;
    }

    const lostItemIcon = (
        <svg className="w-8 h-8 text-red-600 dark:text-red-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 4v16m8-8H4" />
        </svg>
    );

    const browseIcon = (
        <svg className="w-8 h-8 text-blue-600 dark:text-blue-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
        </svg>
    );

    return (
        <div className="container mx-auto px-4 py-8">
            <WelcomeBanner />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-12">
                <QuickActionCard
                    title="Report Lost Item"
                    description="Lost something? Report it here and let the community help you find it."
                    icon={lostItemIcon}
                    buttonText="Report Item"
                    onClick={() => navigate("/lost/post")}
                    bgColor="bg-red-100"
                    textColor="text-red-600"
                    darkBgColor="dark:bg-red-900"
                    darkTextColor="dark:text-red-300"
                />

                <QuickActionCard
                    title="Browse Lost Items"
                    description="Found something? Check if someone reported it missing."
                    icon={browseIcon}
                    buttonText="Browse Items"
                    onClick={() => navigate("/lost")}
                />
            </div>

            <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6">
                Current Statistics
            </h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatisticsCard
                    count={stats.lostItems}
                    label="Items Lost"
                    color="text-red-600 dark:text-red-400"
                />
                <StatisticsCard
                    count={stats.foundItems}
                    label="Items Found"
                    color="text-green-600"
                />
            </div>
        </div>
    );
}