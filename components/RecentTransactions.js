// components/RecentTransactions.js
'use client'

import { useState } from 'react'
import { MagnifyingGlassIcon, FunnelIcon } from '@heroicons/react/24/outline'

export default function RecentTransactions() {
    const [searchTerm, setSearchTerm] = useState('')
    const [filter, setFilter] = useState('all')

    const transactions = [
        { id: 1, description: "Whole Foods Market", amount: -156.32, category: "Groceries", date: "2024-02-15", time: "10:30 AM", type: "expense", merchant: "Whole Foods" },
        { id: 2, description: "Salary Deposit - Acme Inc", amount: 4200.00, category: "Income", date: "2024-02-14", time: "9:00 AM", type: "income", merchant: "Acme Inc" },
        { id: 3, description: "Netflix Subscription", amount: -15.99, category: "Entertainment", date: "2024-02-13", time: "3:15 PM", type: "expense", merchant: "Netflix" },
        { id: 4, description: "Uber Ride", amount: -24.50, category: "Transportation", date: "2024-02-12", time: "8:45 PM", type: "expense", merchant: "Uber" },
        { id: 5, description: "Starbucks Coffee", amount: -5.75, category: "Dining", date: "2024-02-12", time: "9:15 AM", type: "expense", merchant: "Starbucks" },
    ]

    const filteredTransactions = transactions.filter(t =>
        t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.category.toLowerCase().includes(searchTerm.toLowerCase())
    )

    const getCategoryColor = (category) => {
        const colors = {
            Groceries: 'bg-emerald-100 text-emerald-800',
            Income: 'bg-green-100 text-green-800',
            Entertainment: 'bg-purple-100 text-purple-800',
            Transportation: 'bg-blue-100 text-blue-800',
            Dining: 'bg-orange-100 text-orange-800',
        }
        return colors[category] || 'bg-gray-100 text-gray-800'
    }

    return (
        <div>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
                <h2 className="text-xl font-semibold">Recent Activity</h2>

                <div className="flex gap-2">
                    <div className="relative flex-1 sm:flex-initial">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-blue-500 w-full"
                        />
                    </div>

                    <button className="p-2 border border-gray-200 rounded-xl hover:bg-gray-50 transition-colors">
                        <FunnelIcon className="w-5 h-5 text-gray-600" />
                    </button>
                </div>
            </div>

            <div className="space-y-3">
                {filteredTransactions.map((transaction) => (
                    <div
                        key={transaction.id}
                        className="flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-gray-100 transition-colors"
                    >
                        <div className="flex items-center space-x-4">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center text-lg ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                }`}>
                                {transaction.type === 'income' ? '💰' : '💳'}
                            </div>
                            <div>
                                <p className="font-semibold text-gray-900">{transaction.description}</p>
                                <div className="flex items-center space-x-2 mt-1">
                                    <span className={`text-xs px-2 py-1 rounded-full ${getCategoryColor(transaction.category)}`}>
                                        {transaction.category}
                                    </span>
                                    <span className="text-xs text-gray-500">
                                        {transaction.date} · {transaction.time}
                                    </span>
                                </div>
                            </div>
                        </div>

                        <div className={`text-right font-semibold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                            }`}>
                            {transaction.type === 'income' ? '+' : '-'}{Math.abs(transaction.amount).toFixed(2)} XAF
                        </div>
                    </div>
                ))}
            </div>

            <button className="w-full mt-4 py-3 text-center text-blue-600 font-semibold hover:bg-blue-50 rounded-xl transition-colors">
                View All Transactions →
            </button>
        </div>
    )
}