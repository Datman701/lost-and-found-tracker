export default function ProfileStats({ stats }) {
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.postedItems}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Items Posted
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.claimedItems}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Items Claimed
                </p>
            </div>
            <div className="bg-white dark:bg-gray-800 shadow rounded-lg p-4 text-center">
                <h3 className="text-lg font-medium text-gray-900 dark:text-white">
                    {stats.activeItems}
                </h3>
                <p className="text-sm text-gray-500 dark:text-gray-400">
                    Active Items
                </p>
            </div>
        </div>
    );
} 