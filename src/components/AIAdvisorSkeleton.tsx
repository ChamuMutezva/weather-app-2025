function AIAdvisorSkeleton() {
    return (
        <div className="bg-card p-6 rounded-[var(--radius-20)] shadow-xl border border-border animate-pulse">
            <div className="flex items-center gap-2 mb-4">
                <div className="w-6 h-6 bg-gray-300 rounded"></div>
                <div className="h-6 bg-gray-300 rounded w-32"></div>
            </div>

            <div className="space-y-4">
                <div className="h-5 bg-gray-300 rounded w-64"></div>
                <div className="w-full h-20 bg-gray-300 rounded-lg"></div>
                <div className="w-full h-12 bg-gray-300 rounded-lg"></div>
            </div>
        </div>
    );
}

export default AIAdvisorSkeleton;
