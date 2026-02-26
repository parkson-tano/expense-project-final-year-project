// app/transactions/page.js
'use client'

import { useState, useEffect } from 'react'
import {
    MagnifyingGlassIcon,
    FunnelIcon,
    CalendarIcon,
    PlusIcon,
    PencilIcon,
    TrashIcon,
    XMarkIcon,
    ArrowUpIcon,
    ArrowDownIcon,
    BanknotesIcon,
    CreditCardIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'

export default function Transactions() {
    const [view, setView] = useState('all')
    const [searchTerm, setSearchTerm] = useState('')
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingTransaction, setEditingTransaction] = useState(null)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [deletingId, setDeletingId] = useState(null)
    const [selectedMonth, setSelectedMonth] = useState(() => {
        const now = new Date()
        return `${now.getFullYear()}-${String(now.getMonth() + 1).padStart(2, '0')}`
    })
    const [showCategoryWarning, setShowCategoryWarning] = useState(false)

    const {
        transactions = [],
        loading,
        summary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refresh: refreshTransactions
    } = useTransactions()

    const {
        categories = [],
        loading: catLoading,
        error: catError,
        getCategoriesByType
    } = useCategories()

    // Show warning if using default categories
    useEffect(() => {
        if (catError) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setShowCategoryWarning(true)
            const timer = setTimeout(() => setShowCategoryWarning(false), 5000)
            return () => clearTimeout(timer)
        }
    }, [catError])

    // Calculate stats from real data
    const totalIncome = Array.isArray(transactions)
        ? transactions.filter(t => t?.type === 'income').reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
        : 0

    const totalExpenses = Array.isArray(transactions)
        ? transactions.filter(t => t?.type === 'expense').reduce((sum, t) => sum + (Number(t.amount) || 0), 0)
        : 0

    const balance = totalIncome - totalExpenses
    const transactionCount = Array.isArray(transactions) ? transactions.length : 0

    const [newTransaction, setNewTransaction] = useState({
        description: '',
        amount: '',
        category: '',
        date: new Date().toISOString().split('T')[0],
        type: 'expense',
        merchant: '',
        notes: ''
    })

    const formatXAF = (amount) => {
        if (!amount && amount !== 0) return '0 FCFA'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('XAF', 'FCFA')
    }

    const handleSubmit = async (e) => {
        e.preventDefault()

        // Prepare data for API
        const submitData = {
            ...newTransaction,
            amount: parseFloat(newTransaction.amount),
            category: newTransaction.category ? parseInt(newTransaction.category) : null
        }

        let result
        if (editingTransaction) {
            result = await updateTransaction(editingTransaction.id, submitData)
        } else {
            result = await addTransaction(submitData)
        }

        if (result?.success) {
            // Reset form
            setNewTransaction({
                description: '',
                amount: '',
                category: '',
                date: new Date().toISOString().split('T')[0],
                type: 'expense',
                merchant: '',
                notes: ''
            })
            setEditingTransaction(null)
            setShowAddForm(false)
            await refreshTransactions()
        } else {
            alert('Error: ' + JSON.stringify(result?.error))
        }
    }

    const handleEdit = (transaction) => {
        setEditingTransaction(transaction)
        setNewTransaction({
            description: transaction.description || '',
            amount: transaction.amount?.toString() || '',
            category: transaction.category?.toString() || '',
            date: transaction.date || new Date().toISOString().split('T')[0],
            type: transaction.type || 'expense',
            merchant: transaction.merchant || '',
            notes: transaction.notes || ''
        })
        setShowAddForm(true)
    }

    const handleDelete = (id) => {
        setDeletingId(id)
        setShowDeleteModal(true)
    }

    const confirmDelete = async () => {
        const result = await deleteTransaction(deletingId)
        if (result?.success) {
            setShowDeleteModal(false)
            setDeletingId(null)
            await refreshTransactions()
        } else {
            alert('Error: ' + JSON.stringify(result?.error))
        }
    }

    // Filter transactions
    const filteredTransactions = Array.isArray(transactions)
        ? transactions.filter(t => {
            if (!t) return false
            const matchesSearch = (t.description?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (t.category_details?.name?.toLowerCase() || '').includes(searchTerm.toLowerCase()) ||
                (t.merchant?.toLowerCase() || '').includes(searchTerm.toLowerCase())

            const matchesView = view === 'all' || t.type === view

            // Filter by month if selected
            let matchesMonth = true
            if (selectedMonth && t.date) {
                const transactionMonth = t.date.substring(0, 7)
                matchesMonth = transactionMonth === selectedMonth
            }

            return matchesSearch && matchesView && matchesMonth
        })
        : []

    const getCategoryOptions = () => {
        const type = editingTransaction?.type || newTransaction.type || 'expense'
        return getCategoriesByType ? getCategoriesByType(type) : []
    }

    // Reset form when type changes
    useEffect(() => {
        if (!editingTransaction) {
            // eslint-disable-next-line react-hooks/set-state-in-effect
            setNewTransaction(prev => ({
                ...prev,
                category: ''
            }))
        }
    }, [newTransaction.type, editingTransaction])

    if (loading || catLoading) {
        return (
            <div className="space-y-6 pb-24 lg:pb-6">
                <div className="h-8 bg-gray-200 rounded w-48 animate-pulse" />
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                    {[...Array(4)].map((_, i) => (
                        <div key={i} className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
                <div className="h-24 bg-gray-100 rounded-xl animate-pulse" />
                <div className="space-y-3">
                    {[...Array(3)].map((_, i) => (
                        <div key={i} className="h-32 bg-gray-100 rounded-xl animate-pulse" />
                    ))}
                </div>
            </div>
        )
    }

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
                        setEditingTransaction(null)
                        setNewTransaction({
                            description: '',
                            amount: '',
                            category: '',
                            date: new Date().toISOString().split('T')[0],
                            type: 'expense',
                            merchant: '',
                            notes: ''
                        })
                        setShowAddForm(true)
                    }}
                    className="inline-flex items-center justify-center px-6 py-3 bg-gradient-to-r from-blue-600 to-blue-500 text-white rounded-xl font-semibold hover:from-blue-700 hover:to-blue-600 transition-all duration-200 shadow-lg shadow-blue-500/25"
                >
                    <PlusIcon className="w-5 h-5 mr-2" />
                    New Transaction
                </button>
            </div>

            {/* Category Warning */}
            {showCategoryWarning && (
                <div className="bg-yellow-50 border border-yellow-200 rounded-xl p-4 flex items-center gap-3">
                    <ExclamationTriangleIcon className="w-5 h-5 text-yellow-600 flex-shrink-0" />
                    <p className="text-sm text-yellow-700">
                        Using default categories. Connect to server to create custom categories.
                    </p>
                </div>
            )}

            {/* Quick Stats */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                {/* Income Card */}
                <div className="bg-gradient-to-br from-green-50 to-green-100/50 p-4 rounded-xl border border-green-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-green-600 uppercase tracking-wider">Income</span>
                        <ArrowUpIcon className="w-4 h-4 text-green-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatXAF(totalIncome)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {summary?.income_change ? `${summary.income_change > 0 ? '+' : ''}${summary.income_change}% vs last month` : ''}
                    </p>
                </div>

                {/* Expenses Card */}
                <div className="bg-gradient-to-br from-red-50 to-red-100/50 p-4 rounded-xl border border-red-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-red-600 uppercase tracking-wider">Expenses</span>
                        <ArrowDownIcon className="w-4 h-4 text-red-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatXAF(totalExpenses)}</p>
                    <p className="text-xs text-gray-500 mt-1">
                        {summary?.expense_change ? `${summary.expense_change > 0 ? '+' : ''}${summary.expense_change}% vs last month` : ''}
                    </p>
                </div>

                {/* Balance Card */}
                <div className="col-span-2 lg:col-span-1 bg-gradient-to-br from-blue-50 to-indigo-100/50 p-4 rounded-xl border border-blue-200">
                    <div className="flex items-center justify-between mb-2">
                        <span className="text-xs font-medium text-blue-600 uppercase tracking-wider">Net Balance</span>
                        <BanknotesIcon className="w-4 h-4 text-blue-600" />
                    </div>
                    <p className="text-lg font-bold text-gray-900">{formatXAF(balance)}</p>
                    <p className="text-xs text-gray-500 mt-1">Across {transactionCount} transactions</p>
                </div>

                {/* Total Transactions */}
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
                                <h2 className="text-xl font-semibold">{editingTransaction ? 'Edit Transaction' : 'New Transaction'}</h2>
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
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'expense', category: '' })}
                                    className={`p-3 rounded-xl border-2 transition-all ${newTransaction.type === 'expense'
                                            ? 'border-red-500 bg-red-50 text-red-700'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                        }`}
                                >
                                    💳 Expense
                                </button>
                                <button
                                    type="button"
                                    onClick={() => setNewTransaction({ ...newTransaction, type: 'income', category: '' })}
                                    className={`p-3 rounded-xl border-2 transition-all ${newTransaction.type === 'income'
                                            ? 'border-green-500 bg-green-50 text-green-700'
                                            : 'border-gray-200 text-gray-600 hover:bg-gray-50'
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
                                    step="1"
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
                                    {getCategoryOptions().map(cat => (
                                        <option key={cat.id} value={cat.id}>
                                            {cat.icon} {cat.name}
                                        </option>
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
                                {editingTransaction ? 'Update Transaction' : 'Add Transaction'}
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
                        <div className="relative">
                            <input
                                type="month"
                                value={selectedMonth}
                                onChange={(e) => setSelectedMonth(e.target.value)}
                                className="pl-10 pr-4 py-3 border border-gray-200 rounded-xl focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm"
                            />
                            <CalendarIcon className="absolute left-3 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400" />
                        </div>
                        <button className="px-4 py-3 border border-gray-200 rounded-xl hover:bg-gray-50">
                            <FunnelIcon className="w-5 h-5 text-gray-600" />
                        </button>
                    </div>
                </div>

                {/* Filter Chips */}
                <div className="flex flex-wrap gap-2 mt-4">
                    {['all', 'income', 'expense'].map((tab) => (
                        <button
                            key={tab}
                            onClick={() => setView(tab)}
                            className={`px-4 py-2 rounded-lg text-sm font-medium capitalize transition-colors ${view === tab
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
                    Showing {filteredTransactions.length} of {transactionCount} transactions
                </p>
            </div>

            {/* Transactions List */}
            <div className="space-y-3">
                {filteredTransactions.length === 0 ? (
                    <div className="bg-white rounded-xl border border-gray-100 p-12 text-center">
                        <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <CreditCardIcon className="w-10 h-10 text-gray-400" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-1">No transactions found</h3>
                        <p className="text-gray-500 text-sm mb-4">
                            {searchTerm || view !== 'all' || selectedMonth
                                ? 'Try adjusting your filters'
                                : 'Get started by adding your first transaction'}
                        </p>
                        {(searchTerm || view !== 'all' || selectedMonth) ? (
                            <button
                                onClick={() => {
                                    setSearchTerm('')
                                    setView('all')
                                    setSelectedMonth(`${new Date().getFullYear()}-${String(new Date().getMonth() + 1).padStart(2, '0')}`)
                                }}
                                className="text-blue-600 font-medium hover:underline"
                            >
                                Clear all filters
                            </button>
                        ) : (
                            <button
                                onClick={() => {
                                    setEditingTransaction(null)
                                    setNewTransaction({
                                        description: '',
                                        amount: '',
                                        category: '',
                                        date: new Date().toISOString().split('T')[0],
                                        type: 'expense',
                                        merchant: '',
                                        notes: ''
                                    })
                                    setShowAddForm(true)
                                }}
                                className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                            >
                                <PlusIcon className="w-4 h-4" />
                                Add Transaction
                            </button>
                        )}
                    </div>
                ) : (
                    filteredTransactions.map((transaction) => {
                        const category = categories.find(c => c.id === transaction.category) || transaction.category_details
                        return (
                            <div
                                key={transaction.id}
                                className="bg-white rounded-xl border border-gray-100 p-4 hover:shadow-md transition-shadow"
                            >
                                <div className="flex items-start justify-between">
                                    <div className="flex items-start gap-3">
                                        <div className={`w-12 h-12 rounded-xl flex items-center justify-center text-xl flex-shrink-0 ${transaction.type === 'income' ? 'bg-green-100' : 'bg-red-100'
                                            }`}>
                                            {category?.icon || (transaction.type === 'income' ? '💰' : '💳')}
                                        </div>

                                        <div>
                                            <h3 className="font-semibold text-gray-900">{transaction.description}</h3>
                                            {transaction.merchant && (
                                                <p className="text-sm text-gray-500">{transaction.merchant}</p>
                                            )}
                                            <div className="flex flex-wrap items-center gap-2 mt-2">
                                                <span
                                                    className={`text-xs px-2 py-1 rounded-full ${transaction.type === 'income'
                                                            ? 'bg-green-100 text-green-700'
                                                            : 'bg-blue-100 text-blue-700'
                                                        }`}
                                                >
                                                    {category?.name || transaction.category}
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
                                                title="Edit"
                                            >
                                                <PencilIcon className="w-4 h-4 text-gray-500" />
                                            </button>
                                            <button
                                                onClick={() => handleDelete(transaction.id)}
                                                className="p-2 hover:bg-red-50 rounded-lg transition-colors"
                                                title="Delete"
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
                        )
                    })
                )}
            </div>
        </div>
    )
}