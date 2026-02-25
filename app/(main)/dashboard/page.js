// app/dashboard/page.js
'use client'

import { useState, useEffect } from 'react'
import {
    ArrowUpIcon,
    ArrowDownIcon,
    BanknotesIcon,
    CalendarIcon,
    ChevronRightIcon,
    SparklesIcon,
    BellAlertIcon,
    ChartBarIcon,
    WalletIcon
} from '@heroicons/react/24/outline'
import Link from 'next/link'

export default function Dashboard() {
    const [showWelcome, setShowWelcome] = useState(true)

    const getGreeting = () => {
        const hour = new Date().getHours()
        if (hour < 12) return 'Good morning'
        else if (hour < 18) return 'Good afternoon'
        else return 'Good evening'
    }

    const greeting = getGreeting()

    const userData = {
        name: "Jasmine",
        totalBalance: 2845075, // in XAF
        monthlyIncome: 620000,
        monthlyExpenses: 384050,
        savingsRate: 38,
        monthlyChange: 12.5
    }

    const recentTransactions = [
        { id: 1, description: "Whole Foods Market", amount: -15632, category: "Groceries", date: "2024-02-15", time: "10:30 AM", type: "expense" },
        { id: 2, description: "Salary Deposit", amount: 420000, category: "Income", date: "2024-02-14", time: "9:00 AM", type: "income" },
        { id: 3, description: "Netflix", amount: -1599, category: "Entertainment", date: "2024-02-13", time: "3:15 PM", type: "expense" },
        { id: 4, description: "Uber", amount: -2450, category: "Transportation", date: "2024-02-12", time: "8:45 PM", type: "expense" },
    ]

    const insights = [
        { type: 'success', message: 'You saved 15% more this month', icon: '🎯' },
        { type: 'warning', message: 'Entertainment spending is high', icon: '⚠️' },
        { type: 'info', message: 'Set a grocery budget', icon: '💡' },
    ]

    const formatXAF = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(Math.abs(amount)).replace('XAF', 'FCFA')
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
                                    {greeting}, {userData.name}! 👋
                                </h1>
                                <p className="text-blue-100 text-sm max-w-md">
                                    Here&apos;s your financial summary for today. You&apos;re doing great!
                                </p>
                            </div>
                            <button
                                onClick={() => setShowWelcome(false)}
                                className="p-2 hover:bg-white/20 rounded-lg transition-colors"
                            >
                                <span className="text-xl">✕</span>
                            </button>
                        </div>

                        {/* Quick tip */}
                        <div className="mt-4 flex items-center gap-2 bg-white/20 backdrop-blur-sm rounded-lg px-4 py-2 w-fit">
                            <SparklesIcon className="w-4 h-4" />
                            <span className="text-sm">AI Insight: You&apos;re on track to meet your savings goal</span>
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
                    <p className="text-4xl font-bold">{formatXAF(userData.totalBalance)}</p>
                    <span className="text-sm text-green-400 flex items-center gap-1">
                        <ArrowUpIcon className="w-4 h-4" />
                        +2.5%
                    </span>
                </div>
                <div className="flex items-center gap-4 mt-4 pt-4 border-t border-gray-700">
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Monthly Income</p>
                        <p className="text-sm font-semibold text-green-400">+{formatXAF(userData.monthlyIncome)}</p>
                    </div>
                    <div className="flex-1">
                        <p className="text-xs text-gray-400 mb-1">Monthly Expenses</p>
                        <p className="text-sm font-semibold text-red-400">-{formatXAF(userData.monthlyExpenses)}</p>
                    </div>
                </div>
            </div>

            {/* Quick Stats Grid */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                <StatCard
                    title="Savings Rate"
                    value={`${userData.savingsRate}%`}
                    change="+3.2%"
                    trend="up"
                    icon="🏦"
                    color="from-green-500 to-emerald-500"
                />
                <StatCard
                    title="Monthly Change"
                    value={`${userData.monthlyChange}%`}
                    change="+2.1%"
                    trend="up"
                    icon="📈"
                    color="from-blue-500 to-indigo-500"
                />
                <StatCard
                    title="Categories"
                    value="8"
                    subtitle="Active this month"
                    icon="📊"
                    color="from-purple-500 to-pink-500"
                    isSimple
                />
                <StatCard
                    title="Days Left"
                    value="13"
                    subtitle="In February"
                    icon="📅"
                    color="from-amber-500 to-orange-500"
                    isSimple
                />
            </div>

            {/* AI Insights - Mobile Scrollable */}
            <div className="lg:hidden">
                <div className="flex items-center justify-between mb-3">
                    <h2 className="text-lg font-semibold text-gray-900">AI Insights</h2>
                    <span className="text-xs bg-blue-100 text-blue-600 px-2 py-1 rounded-full">3 new</span>
                </div>
                <div className="flex gap-3 overflow-x-auto pb-2 -mx-4 px-4">
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

            {/* Charts Section */}
            <div className="grid lg:grid-cols-2 gap-6">
                {/* Income vs Expenses Chart */}
                <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                    <div className="p-4 border-b border-gray-100">
                        <div className="flex items-center justify-between">
                            <h2 className="text-lg font-semibold text-gray-900">Income vs Expenses</h2>
                            <select className="text-sm border border-gray-200 rounded-lg px-2 py-1">
                                <option>This Month</option>
                                <option>Last Month</option>
                                <option>Last 3 Months</option>
                            </select>
                        </div>
                    </div>
                    <div className="p-4">
                        <div className="h-[200px] lg:h-[250px] bg-gray-50 rounded-xl flex items-center justify-center">
                            {/* Simple bar chart representation */}
                            <div className="w-full px-4">
                                <div className="space-y-3">
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Income</span>
                                            <span className="font-semibold text-green-600">{formatXAF(620000)}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-green-500 rounded-full" style={{ width: '100%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Expenses</span>
                                            <span className="font-semibold text-red-600">{formatXAF(384050)}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-red-500 rounded-full" style={{ width: '62%' }} />
                                        </div>
                                    </div>
                                    <div>
                                        <div className="flex justify-between text-sm mb-1">
                                            <span>Savings</span>
                                            <span className="font-semibold text-blue-600">{formatXAF(235950)}</span>
                                        </div>
                                        <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                                            <div className="h-full bg-blue-500 rounded-full" style={{ width: '38%' }} />
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
                            <Link href="/analytics" className="text-sm text-blue-600 flex items-center gap-1">
                                View all <ChevronRightIcon className="w-4 h-4" />
                            </Link>
                        </div>
                    </div>
                    <div className="p-4 space-y-3">
                        <CategoryItem name="Housing" amount={180000} percentage={47} color="blue" />
                        <CategoryItem name="Groceries" amount={85000} percentage={22} color="green" />
                        <CategoryItem name="Transportation" amount={45000} percentage={12} color="amber" />
                        <CategoryItem name="Entertainment" amount={35000} percentage={9} color="purple" />
                        <CategoryItem name="Others" amount={39050} percentage={10} color="gray" />
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
                        <Link href="/transactions" className="text-sm text-blue-600 flex items-center gap-1">
                            See all <ChevronRightIcon className="w-4 h-4" />
                        </Link>
                    </div>
                </div>

                <div className="divide-y divide-gray-100">
                    {recentTransactions.map((transaction) => (
                        <div key={transaction.id} className="p-4 hover:bg-gray-50 transition-colors">
                            <div className="flex items-center justify-between">
                                <div className="flex items-center gap-3">
                                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {transaction.type === 'income' ? '💰' : '💳'}
                                    </div>
                                    <div>
                                        <p className="font-semibold text-gray-900">{transaction.description}</p>
                                        <div className="flex items-center gap-2 mt-1">
                                            <span className="text-xs px-2 py-0.5 bg-gray-100 text-gray-600 rounded-full">
                                                {transaction.category}
                                            </span>
                                            <span className="text-xs text-gray-500">{transaction.time}</span>
                                        </div>
                                    </div>
                                </div>
                                <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                    }`}>
                                    {transaction.type === 'income' ? '+' : '-'}{formatXAF(transaction.amount)}
                                </p>
                            </div>
                        </div>
                    ))}
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

            {/* Desktop-only AI Insights */}
            <div className="hidden lg:block bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl p-6 text-white">
                <div className="flex items-center gap-2 mb-4">
                    <SparklesIcon className="w-5 h-5" />
                    <h3 className="font-semibold">AI Financial Insights</h3>
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
        </div>
    )
}

// Stat Card Component
function StatCard({ title, value, change, trend, icon, color, subtitle, isSimple }) {
    return (
        <div className="bg-white rounded-xl border border-gray-100 p-4 shadow-sm">
            <div className="flex items-start justify-between mb-2">
                <div className={`w-8 h-8 rounded-lg bg-gradient-to-br ${color} flex items-center justify-center text-sm`}>
                    {icon}
                </div>
                {!isSimple && change && (
                    <span className={`text-xs flex items-center gap-0.5 ${trend === 'up' ? 'text-green-600' : 'text-red-600'
                        }`}>
                        {trend === 'up' ? <ArrowUpIcon className="w-3 h-3" /> : <ArrowDownIcon className="w-3 h-3" />}
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
function CategoryItem({ name, amount, percentage, color }) {
    const colors = {
        blue: 'bg-blue-500',
        green: 'bg-green-500',
        amber: 'bg-amber-500',
        purple: 'bg-purple-500',
        gray: 'bg-gray-500'
    }

    const formatXAF = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
        }).format(amount).replace('XAF', 'FCFA')
    }

    return (
        <div>
            <div className="flex items-center justify-between text-sm mb-1">
                <span className="text-gray-700">{name}</span>
                <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-900">{formatXAF(amount)}</span>
                    <span className="text-xs text-gray-500">{percentage}%</span>
                </div>
            </div>
            <div className="h-1.5 bg-gray-100 rounded-full overflow-hidden">
                <div className={`h-full ${colors[color]} rounded-full`} style={{ width: `${percentage}%` }} />
            </div>
        </div>
    )
}