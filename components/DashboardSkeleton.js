// components/DashboardSkeleton.js
export default function DashboardSkeleton() {
    return (
        <div className="space-y-6 animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-64" />

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
                {[...Array(4)].map((_, i) => (
                    <div key={i} className="bg-white p-5 rounded-xl border border-gray-100">
                        <div className="h-4 bg-gray-200 rounded w-24 mb-2" />
                        <div className="h-8 bg-gray-200 rounded w-32" />
                    </div>
                ))}
            </div>

            <div className="bg-white rounded-xl border border-gray-100 p-4">
                <div className="h-6 bg-gray-200 rounded w-40 mb-4" />
                {[...Array(3)].map((_, i) => (
                    <div key={i} className="h-16 bg-gray-100 rounded-lg mb-2" />
                ))}
            </div>
        </div>
    )
}