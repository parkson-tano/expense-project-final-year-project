// app/dashboard/page.js
'use client'

import { useState, useEffect } from 'react'
import {
    ArrowUpIcon,
    ArrowDownIcon,
    BanknotesIcon,
    CalendarIcon,
    ChevronRightIcon,
    ChartBarIcon,
    WalletIcon,
    HomeIcon,
    ShoppingBagIcon,
    TruckIcon,
    FilmIcon,
    BoltIcon,
    SparklesIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useBudgets } from '@/hooks/useBudgets'

export default function Dashboard() {
    const [showWelcome, setShowWelcome] = useState(true)
    const { user } = useAuth()
    const { transactions, summary, loading: txLoading } = useTransactions()
    const { categories, getCategoriesByType } = useCategories()
    const { budgets } = useBudgets()

    const [recentTransactions, setRecentTransactions] = useState([])
    const [categoryStats, setCategoryStats] = useState([])
    const [monthlyStats, setMonthlyStats] = useState({
        income: 0,
        expenses: 0,
        balance: 0,
        savingsRate: 0
    })
    const [activeCategoryCount, setActiveCategoryCount] = useState(0)
    const [insights, setInsights] = useState([])

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        else if (hour < 18) return 'Good afternoon'
        else return 'Good evening'
    }

    const greeting = getGreeting()

    const formatXAF = (amount) => {
        if (!amount && amount !== 0) return '0 FCFA'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.abs(amount)).replace('XAF', 'FCFA')
    }

    const formatCompact = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M'
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + 'k'
        }
        return amount.toString()
    }

    // Calculate dashboard data from real transactions
    useEffect(() => {
        const transactionsArray = Array.isArray(transactions) ? transactions : []

        if (transactionsArray.length > 0) {
            // Get 5 most recent transactions
            const sorted = [...transactionsArray].sort((a, b) =>
                new Date(b.date) - new Date(a.date)
            ).slice(0, 5)
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setRecentTransactions(sorted)

            // Calculate monthly totals
            const now = new Date()
            const currentMonth = now.getMonth()
            const currentYear = now.getFullYear()

            let monthIncome = 0
            let monthExpenses = 0
            const categoryMap = new Map()

            transactionsArray.forEach(t => {
                const tDate = new Date(t.date)
                const amount = Number(t.amount) || 0

                // Current month only
                if (tDate.getMonth() === currentMonth && tDate.getFullYear() === currentYear) {
                    if (t.type === 'income') {
                        monthIncome += amount
                    } else {
                        monthExpenses += amount

                        // Track category totals
                        const catId = t.category
                        const category = categories.find(c => c.id === catId) ||
                            t.category_details ||
                            { name: 'Other', color: 'gray', icon: '📦' }

                        if (!categoryMap.has(catId)) {
                            categoryMap.set(catId, {
                                name: category.name,
                                total: 0,
                                color: category.color || 'gray',
                                icon: category.icon || '📦'
                            })
                        }
                        categoryMap.get(catId).total += amount
                    }
                }
            })

            // Calculate savings rate
            const savingsRate = monthIncome > 0
                ? Math.round(((monthIncome - monthExpenses) / monthIncome) * 100)
                : 0

            setMonthlyStats({
                income: monthIncome,
                expenses: monthExpenses,
                balance: monthIncome - monthExpenses,
                savingsRate
            })

            // Get top 5 expense categories
            const topCategories = Array.from(categoryMap.values())
                .sort((a, b) => b.total - a.total)
                .slice(0, 5)
                .map(cat => ({
                    ...cat,
                    percentage: monthExpenses > 0
                        ? Math.round((cat.total / monthExpenses) * 100)
                        : 0
                }))

            setCategoryStats(topCategories)
            setActiveCategoryCount(categoryMap.size)

            // Generate financial insights (non-AI, just data-driven)
            const newInsights = []

            if (savingsRate > 30) {
                newInsights.push({
                    type: 'success',
                    message: `You're saving ${savingsRate}% of your income this month. Great job!`,
                    icon: '🎯'
                })
            } else if (savingsRate < 10) {
                newInsights.push({
                    type: 'warning',
                    message: 'Your savings rate is low. Try to reduce expenses.',
                    icon: '⚠️'
                })
            }

            if (monthExpenses > monthIncome) {
                newInsights.push({
                    type: 'warning',
                    message: `You're spending ${formatXAF(monthExpenses - monthIncome)} more than you earn.`,
                    icon: '📉'
                })
            }

            if (topCategories.length > 0) {
                newInsights.push({
                    type: 'info',
                    message: `Your top expense is ${topCategories[0].name} (${topCategories[0].percentage}% of spending).`,
                    icon: '💡'
                })
            }

            // Check budgets
            if (budgets && budgets.length > 0) {
                const nearLimit = budgets.filter(b => b.percentage_used >= 80)
                if (nearLimit.length > 0) {
                    newInsights.push({
                        type: 'warning',
                        message: `${nearLimit.length} budget${nearLimit.length > 1 ? 's are' : ' is'} near the limit.`,
                        icon: '🔔'
                    })
                }
            }

            setInsights(newInsights.slice(0, 3))
        }
    }, [transactions, categories, budgets])

    const getCategoryColor = (color) => {
        const colors = {
            blue: 'bg-blue-500',
            green: 'bg-green-500',
            amber: 'bg-amber-500',
            purple: 'bg-purple-500',
            red: 'bg-red-500',
            gray: 'bg-gray-500',
            emerald: 'bg-emerald-500',
            indigo: 'bg-indigo-500'
        }
        return colors[color] || 'bg-gray-500'
    }

    const daysInMonth = new Date(new Date().getFullYear(), new Date().getMonth() + 1, 0).getDate()
    const currentDay = new Date().getDate()
    const daysLeft = daysInMonth - currentDay
    const currentMonth = new Date().toLocaleString('default', { month: 'long' })

    // Calculate month-over-month change (simplified)
    const monthlyChange = summary?.expense_change
        ? (summary.expense_change > 0 ? '+' : '') + summary.expense_change + '%'
        : '0%'

    if (txLoading) {
        return (
            <div className="space-y-6 pb-24 lg:pb-6">
                <div className="h-32 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="h-40 bg-gray-200 rounded-2xl animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-200 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="grid lg:grid-cols-2 gap-6">
                    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                    <div className="h-64 bg-gray-200 rounded-2xl animate-pulse" />
                </div>
            </div>
        )
    }

    return (
        <div className="space-y-6 pb-24 lg:pb-6">
            {/* Welcome Banner - Dismissible */}
            {showWelcome && (
                <div className="relative bg-gradient-to-r from-blue-600 to-indigo-600 rounded-2xl p-6 text-white overflow-hidden">
                    <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" />
                    <div className="relative">
                        <div className="flex items-start justify-between">
                            <div>
                                <h1 className="text-2xl font-bold mb-1">
                                    {greeting}, {user?.first_name || 'User'}! 👋
                                </h1>
                                <p className="text-blue-100 text-sm max-w-md">
                                    Here&apos;s your financial summary for today.
                                </p>
                            </div>
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>

                        {/* Quick Stats Summary */}
                        <div className="mt-4 flex flex-wrap gap-3">
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <span className="text-xs opacity-80">Monthly Income</span>
                                <p className="text-sm font-semibold">{formatXAF(monthlyStats.income)}</p>
                            </div>
                            <div className="bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2">
                                <span className="text-xs opacity-80">Monthly Expenses</span>
                                <p className="text-sm font-semibold">{formatXAF(monthlyStats.expenses)}</p>
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {/* Main Balance Card - Prominent on mobile */}
            <div className="bg-gradient-to-br from-gray-900 to-gray-800 rounded-2xl p-6 text-white shadow-xl">
                <div className="flex items-center justify-between mb-4">
                    <span className="text-sm font-medium text-gray-400">Total Balance</span>
                    <WalletIcon className="w-5 h-5 text-gray-400" />
                </div>
                <div className="flex items-baseline justify-between">
                    <p className="text-4xl font-bold">{formatXAF(monthlyStats.balance)}</p>
                    <span className={`text-sm flex items-center gap-1 ${monthlyStats.balance >= 0 ? 'text-green-400' : 'text-red-400'
                        }`}>
                        {monthlyStats.balance >= 0 ? <ArrowUpIcon className="w-4 h-4" /> : <ArrowDownIcon className="w-4 h-4" />}
                        {Math.abs(monthlyStats.savingsRate)}%
                    </span>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Monthly Income</p>
                        <p className="text-sm font-semibold text-green-400">+{formatXAF(monthlyStats.income)}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Monthly Expenses</p>
                        <p className="text-sm font-semibold text-red-400">-{formatXAF(monthlyStats.expenses)}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    title="Savings Rate"
                    value={`${monthlyStats.savingsRate}%`}
                    change={monthlyStats.savingsRate > 20 ? 'Good' : 'Low'}
                    trend={monthlyStats.savingsRate > 20 ? 'up' : 'down'}
                    icon="🏦"
                    color="from-green-500 to-emerald-500"
                />
                <StatCard
                    title="Monthly Change"
                    value={monthlyChange}
                    change="vs last month"
                    trend="neutral"
                    icon="📈"
                    color="from-blue-500 to-indigo-500"
                    isSimple
                />
                <StatCard
                    title="Categories"
                    value={activeCategoryCount}
                    subtitle="Active this month"
                    icon="📊"
                    color="from-purple-500 to-pink-500"
                    isSimple
                />
                <StatCard
                    title="Days Left"
                    value={daysLeft}
                    subtitle={`In ${currentMonth}`}
                    icon="📅"
                    color="from-amber-500 to-orange-500"
                    isSimple
                />
            </div>

            {/* Insights - Mobile Scrollable */}
            {insights.length > 0 && (
                <div className="lg:hidden">
                    <div className="flex items-center justify-between mb-3">
                        <h2 className="text-lg font-semibold text-gray-900">Insights</h2>
                        <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">
                            {insights.length}
                        </span>
                    </div>
                    <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {insights.map((insight, idx) => (
                            <div
                                key={idx}
                                className="flex-none w-64 bg-gradient-to-br from-gray-50 to-gray-100/50 rounded-xl p-4 border border-gray-200"
                            >
                                <span className="text-2xl mb-2 block">{insight.icon}</span>
                                <p className="text-sm text-gray-700">{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Income vs Expenses</h2>
                            <span className="text-sm text-gray-500">This Month</span>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="h-[200px] lg:h-[250px] bg-gray-50 rounded-xl flex items-center justify-center">
                            <div className="w-full px-4">
                                <div className="space-y-4">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Income</span>
                                            <span className="font-semibold text-green-600">
                                                {formatCompact(monthlyStats.income)} FCFA
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-green-500 rounded-full"
                                                style={{ width: '100%' }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Expenses</span>
                                            <span className="font-semibold text-red-600">
                                                {formatCompact(monthlyStats.expenses)} FCFA
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-red-500 rounded-full"
                                                style={{
                                                    width: `${monthlyStats.income > 0
                                                        ? (monthlyStats.expenses / monthlyStats.income) * 100
                                                        : 0}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Savings</span>
                                            <span className="font-semibold text-blue-600">
                                                {formatCompact(monthlyStats.balance)} FCFA
                                            </span>
                                        </div>
                                        <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                                            <div
                                                className="h-full bg-blue-500 rounded-full"
                                                style={{
                                                    width: `${monthlyStats.income > 0
                                                        ? (monthlyStats.balance / monthlyStats.income) * 100
                                                        : 0}%`
                                                }}
                                            />
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Spending Categories - Simplified */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Top Categories</h2>
                            <Link href="/analytics" className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                                View all <ChevronRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="p-4 space-y-4">
                        {categoryStats.length > 0 ? (
                            categoryStats.map((cat, index) => (
                                <CategoryItem
                                    key={index}
                                    name={cat.name}
                                    amount={cat.total}
                                    percentage={cat.percentage}
                                    color={cat.color}
                                    icon={cat.icon}
                                />
                            ))
                        ) : (
                            <div className="text-center py-6">
                                <p className="text-gray-500">No expense data for this month</p>
                                <Link
                                    href="/transactions"
                                    className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                                >
                                    Add your first transaction
                                </Link>
                            </div>
                        )}
                    </div>
                </div>
            </div>

            {/* Recent Transactions Section */}
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                <div className="p-4 border-b border-gray-100">
                    <div className="flex items-center justify-between">
                        <div>
                            <h2 className="text-lg font-semibold text-gray-900">Recent Transactions</h2>
                            <p className="text-sm text-gray-500 mt-1">Your latest financial activities</p>
                        </div>
                        <Link href="/transactions" className="text-sm text-blue-600 flex items-center gap-1 hover:underline">
                            See all <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentTransactions.length > 0 ? (
                        recentTransactions.map((transaction) => {
                            const category = categories.find(c => c.id === transaction.category) ||
                                transaction.category_details ||
                                { name: 'Other', icon: '💳' }
                            return (
                                <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                                    <div className="flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                                }`}>
                                                {category.icon || (transaction.type === 'income' ? '💰' : '💳')}
                                            </div>
                                            <div>
                                                <p className="font-semibold text-gray-900">{transaction.description}</p>
                                                <div className="flex items-center gap-2 mt-1">
                                                    <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                        {category.name}
                                                    </span>
                                                    <span className="text-xs text-gray-500">
                                                        {new Date(transaction.date).toLocaleDateString('en-US', {
                                                            month: 'short',
                                                            day: 'numeric'
                                                        })}
                                                    </span>
                                                </div>
                                            </div>
                                        </div>
                                        <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                            }`}>
                                            {transaction.type === 'income' ? '+' : '-'}{formatXAF(transaction.amount)}
                                        </p>
                                    </div>
                                </div>
                            )
                        })
                    ) : (
                        <div className="p-8 text-center">
                            <p className="text-gray-500">No transactions yet</p>
                            <Link
                                href="/transactions"
                                className="inline-block mt-2 text-sm text-blue-600 hover:underline"
                            >
                                Add your first transaction
                            </Link>
                        </div>
                    )}
                </div>

                {/* Quick Action Button */}
                <div className="p-4 bg-gray-50 border-t border-gray-100">
                    <Link
                        href="/transactions"
                        className="block w-full text-center py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors"
                    >
                        Add New Transaction
                    </Link>
                </div>
            </div>

            {/* Desktop-only Insights */}
            {insights.length > 0 && (
                <div className="hidden lg:block bg-gradient-to-br from-blue-600 to-indigo-600 rounded-2xl p-6 text-white">
                    <div className="flex items-center gap-2 mb-4">
                        <SparklesIcon className="w-5 h-5" />
                        <h3 className="font-semibold">Quick Insights</h3>
                    </div>
                    <div className="grid grid-cols-3 gap-4">
                        {insights.map((insight, idx) => (
                            <div key={idx} className="bg-white/10 backdrop-blur-sm rounded-xl p-4">
                                <span className="text-2xl mb-2 block">{insight.icon}</span>
                                <p className="text-sm">{insight.message}</p>
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    )
}

// Stat Card Component
function StatCard({ title, value, change, trend, icon, color, subtitle, isSimple }) {
    const getTrendColor = () => {
        if (trend === 'up') return 'text-green-600'
        if (trend === 'down') return 'text-red-600'
        return 'text-gray-600'
    }

    const getTrendIcon = () => {
        if (trend === 'up') return <ArrowUpIcon className="w-3 h-3" />
        if (trend === 'down') return <ArrowDownIcon className="w-3 h-3" />
        return null
    }

    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm hover:shadow-md transition-shadow">
            <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-sm`}>
                    <span className="text-white">{icon}</span>
                </div>
                {!isSimple && change && trend !== 'neutral' && (
                    <span className={`text-xs flex items-center gap-0.5 ${getTrendColor()}`}>
                        {getTrendIcon()}
                        {change}
                    </span>
                )}
            </div>
            <p className="text-xs text-gray-500 mb-1">{title}</p>
            <p className="text-lg font-bold text-gray-900">{value}</p>
            {subtitle && <p className="text-xs text-gray-500 mt-1">{subtitle}</p>}
        </div>
    )
}

// Category Item Component
function CategoryItem({ name, amount, percentage, color, icon }) {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        amber: 'bg-amber-500',
        purple: 'bg-purple-500',
        red: 'bg-red-500',
        gray: 'bg-gray-500',
        emerald: 'bg-emerald-500',
        indigo: 'bg-indigo-500'
    }

    const formatXAF = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
        }).format(amount).replace('XAF', 'FCFA')
    }

    const formatCompact = (amount) => {
        if (amount >= 1000000) {
            return (amount / 1000000).toFixed(1) + 'M'
        } else if (amount >= 1000) {
            return (amount / 1000).toFixed(0) + 'k'
        }
        return amount.toString()
    }

    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-1">
                <div className="flex items-center gap-2">
                    <span className="text-gray-700">{icon || '📦'}</span>
                    <span className="text-gray-700">{name}</span>
                </div>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{formatCompact(amount)} FCFA</span>
                    <span className="text-xs text-gray-500">{percentage}%</span>
                </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color] || 'bg-gray-500'} rounded-full`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}