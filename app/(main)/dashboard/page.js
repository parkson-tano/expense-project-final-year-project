// app/dashboard/page.js
import { Suspense } from 'react'
import DashboardStats from '@/components/DashboardStats'
import RecentTransactions from '@/components/RecentTransactions'
import ExpenseChart from '@/components/ExpenseChart'
import CategoryBreakdown from '@/components/CategoryBreakdown'
import QuickActions from '@/components/QuickActions'

export default function Dashboard() {
    const userData = {
        name: "Alex Chen",
        totalBalance: 28450.75,
        monthlyIncome: 6200.00,
        monthlyExpenses: 3840.50,
        savingsRate: 38,
        monthlyChange: 12.5
    }

    return (
        <div className="space-y-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Welcome back, {userData.name}!</h1>
                    <p className="text-gray-600 mt-1">Here&lsquo;s what&lsquo;s happening with your finances today.</p>
                </div>
                <QuickActions />
            </div>

            {/* Stats Grid */}
            <DashboardStats stats={userData} />

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Income vs Expenses</h2>
                    <Suspense fallback={<ChartSkeleton />}>
                        <ExpenseChart />
                    </Suspense>
                </div>
                <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100">
                    <h2 className="text-lg font-semibold mb-4">Spending Categories</h2>
                    <Suspense fallback={<ChartSkeleton />}>
                        <CategoryBreakdown />
                    </Suspense>
                </div>
            </div>

            {/* Recent Transactions */}
            <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
                <div className="p-6">
                    <RecentTransactions />
                </div>
            </div>
        </div>
    )
}

function ChartSkeleton() {
    return (
        <div className="h-[300px] bg-gray-100 rounded-xl animate-pulse" />
    )
}