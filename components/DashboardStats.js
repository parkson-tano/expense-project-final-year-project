// components/DashboardStats.js
'use client'

import { ArrowUpIcon, ArrowDownIcon } from '@heroicons/react/24/solid'

export default function DashboardStats({ stats }) {
    const statCards = [
        {
            title: 'Total Balance',
            value: `${stats.totalBalance.toLocaleString()}XAF`,
            change: '+2.5%',
            trend: 'up',
            icon: '💰',
            color: 'from-blue-500 to-blue-600'
        },
        {
            title: 'Monthly Income',
            value: `${stats.monthlyIncome.toLocaleString()}XAF`,
            change: '+5.0%',
            trend: 'up',
            icon: '📈',
            color: 'from-green-500 to-emerald-600'
        },
        {
            title: 'Monthly Expenses',
            value: `${stats.monthlyExpenses.toLocaleString()}XAF`,
            change: '-3.2%',
            trend: 'down',
            icon: '📉',
            color: 'from-orange-500 to-red-600'
        },
        {
            title: 'Savings Rate',
            value: `${stats.savingsRate}%`,
            change: '+1.2%',
            trend: 'up',
            icon: '🏦',
            color: 'from-purple-500 to-pink-600'
        }
    ]

    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
            {statCards.map((card, index) => (
                <div
                    key={index}
                    className="relative bg-white p-6 rounded-2xl shadow-sm border border-gray-100 hover:shadow-lg transition-all duration-300 group"
                >
                    <div className="flex items-start justify-between">
                        <div>
                            <p className="text-sm text-gray-600 mb-1">{card.title}</p>
                            <p className="text-2xl font-bold text-gray-900">{card.value}</p>
                        </div>
                        <div className={`w-12 h-12 bg-gradient-to-br ${card.color} rounded-xl flex items-center justify-center text-2xl group-hover:scale-110 transition-transform duration-300`}>
                            {card.icon}
                        </div>
                    </div>

                    <div className="mt-4 flex items-center space-x-2">
                        {card.trend === 'up' ? (
                            <ArrowUpIcon className="w-4 h-4 text-green-500" />
                        ) : (
                            <ArrowDownIcon className="w-4 h-4 text-red-500" />
                        )}
                        <span className={card.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                            {card.change}
                        </span>
                        <span className="text-gray-500 text-sm">vs last month</span>
                    </div>
                </div>
            ))}
        </div>
    )
}