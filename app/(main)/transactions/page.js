// app/transactions/page.js
'use client'

import { useState } from 'react'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    CheckIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    BanknotesIcon,
    CreditCardIcon
} from '@heroicons/react/24/outline'

export default function Transactions() {
    const [view, setView] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingId, setEditingId] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingId, setDeletingId] = useState(null)

    const [transactions, setTransactions] = useState([
        { id: 1, description: "Whole Foods Market", amount: 156.32, category: "Groceries", date: "2024-02-15", type: "expense", merchant: "Whole Foods", notes: "Weekly groceries" },
        { id: 2, description: "Salary Deposit", amount: 4200.00, category: "Income", date: "2024-02-14", type: "income", merchant: "Acme Inc", notes: "February salary" },
        { id: 3, description: "Netflix", amount: 15.99, category: "Entertainment", date: "2024-02-13", type: "expense", merchant: "Netflix", notes: "Monthly subscription" },
        { id: 4, description: "Uber", amount: 24.50, category: "Transportation", date: "2024-02-12", type: "expense", merchant: "Uber", notes: "Airport ride" },
        { id: 5, description: "Starbucks", amount: 5.75, category: "Dining", date: "2024-02-12", type: "expense", merchant: "Starbucks", notes: "Morning coffee" },
        { id: 6, description: "Rent Payment", amount: 1800.00, category: "Housing", date: "2024-02-01", type: "expense", merchant: "Landlord", notes: "February rent" },
    ])

    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: '',
        category: '',
        date: '',
        type: 'expense',
        merchant: '',
        notes: ''
    })

    const categories = [
        'Income', 'Groceries', 'Dining', 'Transportation', 'Entertainment',
        'Housing', 'Utilities', 'Shopping', 'Healthcare', 'Education', 'Other'
    ]

    // Calculate stats
    const totalIncome = transactions
        .filter(t => t.type === 'income')
        .reduce((sum, t) => sum + t.amount, 0)

    const totalExpenses = transactions
        .filter(t => t.type === 'expense')
        .reduce((sum, t) => sum + t.amount, 0)

    const balance = totalIncome - totalExpenses
    const transactionCount = transactions.length

    const formatXAF = (amount) => {
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('XAF', 'FCFA')
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (editingId) {
            // Update existing transaction
            setTransactions(transactions.map(t =>
                t.id === editingId ? { ...newTransaction, id: editingId, amount: parseFloat(newTransaction.amount) } : t
            ))
            setEditingId(null)
        } else {
            // Add new transaction
            const transaction = {
                id: transactions.length + 1,
                ...newTransaction,
                amount: parseFloat(newTransaction.amount)
            }
            setTransactions([transaction, ...transactions])
        }

        // Reset form
        setNewTransaction({
            description: '',
            amount: '',
            category: '',
            date: '',
            type: 'expense',
            merchant: '',
            notes: ''
        })
        setShowAddForm(false)
    }

    const handleEdit = (transaction) => {
        setNewTransaction({
            description: transaction.description,
            amount: transaction.amount.toString(),
            category: transaction.category,
            date: transaction.date,
            type: transaction.type,
            merchant: transaction.merchant || '',
            notes: transaction.notes || ''
        })
        setEditingId(transaction.id)
        setShowAddForm(true)
    }

    const handleDelete = (id) => {
        setDeletingId(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = () => {
        setTransactions(transactions.filter(t => t.id !== deletingId))
        setShowDeleteModal(false)
        setDeletingId(null)
    }

    // Filter transactions
    const filteredTransactions = transactions.filter(t => {
        const matchesSearch = t.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
            t.category.toLowerCase().includes(searchTerm.toLowerCase()) ||
            (t.merchant && t.merchant.toLowerCase().includes(searchTerm.toLowerCase()))

        const matchesView = view === 'all' || t.type === view

        return matchesSearch && matchesView
    })

    return (
        <div className="space-y-6 pb-24 lg:pb-6">
            {/* Header */}
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                    <h1 className="text-3xl font-bold text-gray-900">Transactions</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your income and expenses</p>
                </div>
                <button
                    onClick={() => {
                        setEditingId(null)
                        setNewTransaction({
                            description: '',
                            amount: '',
                            category: '',
                            date: '',
                            type: 'expense',
                            merchant: '',
                            notes: ''
                        })
                        setShowAddForm(!showAddForm)
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Transaction
                </button>
            </div>

            {/* Quick Stats - Mobile First Design */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Income Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Income</span>
                        <ArrowUpIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatXAF(totalIncome)}</p>
                    <p className="text-xs text-gray-500 mt-1">+12.5% vs last month</p>
                </div>

                {/* Expenses Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Expenses</span>
                        <ArrowDownIcon className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatXAF(totalExpenses)}</p>
                    <p className="text-xs text-gray-500 mt-1">-3.2% vs last month</p>
                </div>

                {/* Balance Card - Spans full width on mobile */}
                <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100/50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Net Balance</span>
                        <BanknotesIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatXAF(balance)}</p>
                    <p className="text-xs text-gray-500 mt-1">Across {transactionCount} transactions</p>
                </div>

                {/* Total Transactions - Hidden on mobile, shown on desktop */}
                <div className="hidden lg:block bg-gray-50 p-4 rounded-xl border border-gray-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-gray-600 uppercase tracking-wider">Transactions</span>
                        <CreditCardIcon className="w-4 h-4 text-gray-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{transactionCount}</p>
                    <p className="text-xs text-gray-500 mt-1">Total count</p>
                </div>
            </div>

            {/* Add/Edit Form Modal */}
            {showAddForm && (
                <div className="fixed inset-0 bg-black/50 flex items-end lg:items-center justify-center z-50 p-4" onClick={() => setShowAddForm(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto" onClick={e => e.stopPropagation()}>
                        <div className="p-6 border-b border-gray-100 sticky top-0 bg-white">
                            <div className="flex items-center justify-between">
                                <h2 className="text-xl font-semibold">{editingId ? 'Edit Transaction' : 'New Transaction'}</h2>
                                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-gray-100 rounded-lg">
                                    <XMarkIcon className="w-5 h-5" />
                                </button>
                            </div>
                        </div>

                        <form onSubmit={handleSubmit} className="p-6 space-y-4">
                            {/* Type Selector */}
                            <div className="grid grid-cols-2 gap-3">
                                <button
                                    type="button"
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense' })}
                                    className={`p-3 rounded-xl border-2 transition-all ${newTransaction.type === 'expense'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 text-gray-600'
                                        }`}
                                >
                                    💳 Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income' })}
                                    className={`p-3 rounded-xl border-2 transition-all ${newTransaction.type === 'income'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 text-gray-600'
                                        }`}
                                >
                                    💰 Income
                                </button>
                            </div>

                            {/* Description */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
                                <input
                                    type="text"
                                    value={newTransaction.description}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, description: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Grocery shopping"
                                    required
                                />
                            </div>

                            {/* Amount */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Amount (FCFA) *</label>
                                <input
                                    type="number"
                                    value={newTransaction.amount}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, amount: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="0"
                                    step="0.01"
                                    min="0"
                                    required
                                />
                            </div>

                            {/* Category */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Category *</label>
                                <select
                                    value={newTransaction.category}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, category: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                >
                                    <option value="">Select a category</option>
                                    {categories.map(cat => (
                                        <option key={cat} value={cat}>{cat}</option>
                                    ))}
                                </select>
                            </div>

                            {/* Date */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Date *</label>
                                <input
                                    type="date"
                                    value={newTransaction.date}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, date: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>

                            {/* Merchant (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Merchant (Optional)</label>
                                <input
                                    type="text"
                                    value={newTransaction.merchant}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, merchant: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="e.g., Walmart, Uber"
                                />
                            </div>

                            {/* Notes (Optional) */}
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Notes (Optional)</label>
                                <textarea
                                    value={newTransaction.notes}
                                    onChange={(e) => setNewTransaction({ ...newTransaction, notes: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    placeholder="Add any additional notes"
                                    rows="2"
                                />
                            </div>

                            {/* Submit Button */}
                            <button
                                type="submit"
                                className="w-full p-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all"
                            >
                                {editingId ? 'Update Transaction' : 'Add Transaction'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-2xl w-full max-w-sm p-6" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrashIcon className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Delete Transaction</h3>
                        <p className="text-gray-600 text-center mb-6">Are you sure you want to delete this transaction? This action cannot be undone.</p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 p-3 border border-gray-200 rounded-xl font-semibold hover:bg-gray-50"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={confirmDelete}
                                className="flex-1 p-3 bg-red-600 text-white rounded-xl font-semibold hover:bg-red-700"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}

            {/* Search and Filter */}
            <div className="bg-white p-4 rounded-xl border border-gray-100">
                <div className="flex flex-col sm:flex-row gap-3">
                    <div className="flex-1 relative">
                        <MagnifyingGlassIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        <input
                            type="text"
                            placeholder="Search transactions..."
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                        />
                    </div>

                    <div className="flex gap-2">
                        <button className="flex-1 sm:flex-none px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50 flex items-center justify-center gap-2">
                            <CalendarIcon className="w-5 h-5 text-gray-600" />
                            <span className="text-sm">Feb 2024</span>
                        </button>
                        <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                            <FunnelIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {['All', 'Income', 'Expenses'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setView(tab.toLowerCase())}
                            className={`px-4 py-2 rounded-lg text-sm font-medium transition-colors ${view === tab.toLowerCase()
                                    ? 'bg-blue-600 text-white'
                                    : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                                }`}
                        >
                            {tab}
                        </button>
                    ))}
                </div>

                {/* Results count */}
                <p className="text-xs text-gray-500 mt-3">
                    Showing {filteredTransactions.length} of {transactions.length} transactions
                </p>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-8 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCardIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No transactions found</h3>
                        <p className="text-gray-500 text-sm mb-4">Try adjusting your search or filter</p>
                        <button
                            onClick={() => {
                                setSearchTerm('')
                                setView('all')
                            }}
                            className="text-blue-600 font-medium"
                        >
                            Clear filters
                        </button>
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => (
                        <div
                            key={transaction.id}
                            className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                        >
                            <div className="flex items-start justify-between">
                                <div className="flex items-start gap-3">
                                    <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                        }`}>
                                        {transaction.type === 'income' ? '💰' : '💳'}
                                    </div>

                                    <div>
                                        <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                                        {transaction.merchant && (
                                            <p className="text-sm text-gray-500">{transaction.merchant}</p>
                                        )}
                                        <div className="flex flex-wrap items-center gap-2 mt-2">
                                            <span className={`text-xs px-2 py-1 rounded-full ${transaction.type === 'income'
                                                    ? 'bg-green-100 text-green-700'
                                                    : 'bg-blue-100 text-blue-700'
                                                }`}>
                                                {transaction.category}
                                            </span>
                                            <span className="text-xs text-gray-500">
                                                {new Date(transaction.date).toLocaleDateString('en-US', {
                                                    month: 'short',
                                                    day: 'numeric',
                                                    year: 'numeric'
                                                })}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="text-right flex flex-col items-end">
                                    <p className={`font-bold ${transaction.type === 'income' ? 'text-green-600' : 'text-red-600'
                                        }`}>
                                        {transaction.type === 'income' ? '+' : '-'}{formatXAF(transaction.amount)}
                                    </p>

                                    <div className="flex items-center gap-1 mt-2">
                                        <button
                                            onClick={() => handleEdit(transaction)}
                                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                                        >
                                            <PencilIcon className="w-4 h-4 text-gray-500" />
                                        </button>
                                        <button
                                            onClick={() => handleDelete(transaction.id)}
                                            className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                        >
                                            <TrashIcon className="w-4 h-4 text-red-500" />
                                        </button>
                                    </div>
                                </div>
                            </div>

                            {transaction.notes && (
                                <div className="mt-3 pt-3 border-t border-gray-100">
                                    <p className="text-sm text-gray-600">
                                        <span className="font-medium">Notes:</span> {transaction.notes}
                                    </p>
                                </div>
                            )}
                        </div>
                    ))
                )}
            </div>
        </div>
    )
}