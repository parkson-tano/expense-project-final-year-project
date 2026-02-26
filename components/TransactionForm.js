// components/TransactionForm.js (updated)
'use client'

import { useState, useEffect } from 'react'
import { XMarkIcon } from '@heroicons/react/24/outline'

export default function TransactionForm({
    transaction,
    categories = [],
    onSubmit,
    onClose,
    isSubmitting = false
}) {
    // Ensure categories is an array
    const categoriesArray = Array.isArray(categories) ? categories : []

    // Initialize formData with default category
    const getDefaultCategory = () => {
        if (transaction?.category) {
            return transaction.category
        }
        if (categoriesArray.length > 0) {
            const defaultCat = categoriesArray.find(c =>
                c && c.name && (c.name === 'Salary' || c.name === 'Other') && c.type === (transaction?.type || 'expense')
            ) || categoriesArray[0]
            return defaultCat?.id || ''
        }
        return ''
    }

    const [formData, setFormData] = useState({
        type: transaction?.type || 'expense',
        amount: transaction?.amount || '',
        description: transaction?.description || '',
        category: getDefaultCategory(),
        date: transaction?.date || new Date().toISOString().split('T')[0],
        merchant: transaction?.merchant || '',
        notes: transaction?.notes || ''
    })

    const [errors, setErrors] = useState({})

    const validate = () => {
        const newErrors = {}
        if (!formData.amount || formData.amount <= 0) {
            newErrors.amount = 'Amount must be greater than 0'
        }
        if (!formData.description?.trim()) {
            newErrors.description = 'Description is required'
        }
        if (!formData.category) {
            newErrors.category = 'Please select a category'
        }
        if (!formData.date) {
            newErrors.date = 'Date is required'
        }
        setErrors(newErrors)
        return Object.keys(newErrors).length === 0
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        if (validate()) {
            onSubmit(formData)
        }
    }

    return (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <div className="bg-white rounded-xl max-w-md w-full max-h-[90vh] overflow-y-auto">
                <div className="p-4 border-b border-gray-100 flex items-center justify-between sticky top-0 bg-white">
                    <h2 className="text-lg font-semibold">
                        {transaction ? 'Edit Transaction' : 'New Transaction'}
                    </h2>
                    <button
                        onClick={onClose}
                        className="p-1 hover:bg-gray-100 rounded"
                        disabled={isSubmitting}
                    >
                        <XMarkIcon className="w-5 h-5" />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="p-4 space-y-4">
                    {/* Type */}
                    <div className="grid grid-cols-2 gap-3">
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'expense', category: '' })}
                            disabled={isSubmitting}
                            className={`p-3 rounded-lg border-2 transition ${formData.type === 'expense'
                                    ? 'border-red-500 bg-red-50 text-red-700'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            💳 Expense
                        </button>
                        <button
                            type="button"
                            onClick={() => setFormData({ ...formData, type: 'income', category: '' })}
                            disabled={isSubmitting}
                            className={`p-3 rounded-lg border-2 transition ${formData.type === 'income'
                                    ? 'border-green-500 bg-green-50 text-green-700'
                                    : 'border-gray-200 text-gray-600 hover:bg-gray-50'
                                } ${isSubmitting ? 'opacity-50 cursor-not-allowed' : ''}`}
                        >
                            💰 Income
                        </button>
                    </div>

                    {/* Amount */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Amount (FCFA) *
                        </label>
                        <input
                            type="number"
                            value={formData.amount}
                            onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                            disabled={isSubmitting}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.amount ? 'border-red-500' : 'border-gray-200'
                                } ${isSubmitting ? 'bg-gray-100' : ''}`}
                            placeholder="0"
                            min="0"
                            step="1"
                        />
                        {errors.amount && (
                            <p className="text-xs text-red-600 mt-1">{errors.amount}</p>
                        )}
                    </div>

                    {/* Description */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Description *
                        </label>
                        <input
                            type="text"
                            value={formData.description}
                            onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                            disabled={isSubmitting}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.description ? 'border-red-500' : 'border-gray-200'
                                } ${isSubmitting ? 'bg-gray-100' : ''}`}
                            placeholder="e.g., Grocery shopping"
                        />
                        {errors.description && (
                            <p className="text-xs text-red-600 mt-1">{errors.description}</p>
                        )}
                    </div>

                    {/* Category */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Category *
                        </label>
                        <select
                            value={formData.category}
                            onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                            disabled={isSubmitting || categoriesArray.length === 0}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.category ? 'border-red-500' : 'border-gray-200'
                                } ${isSubmitting || categoriesArray.length === 0 ? 'bg-gray-100' : ''}`}
                        >
                            <option value="">Select a category</option>
                            {categoriesArray.map((cat) => (
                                <option key={cat.id} value={cat.id}>
                                    {cat.icon} {cat.name}
                                </option>
                            ))}
                        </select>
                        {errors.category && (
                            <p className="text-xs text-red-600 mt-1">{errors.category}</p>
                        )}
                        {categoriesArray.length === 0 && (
                            <p className="text-xs text-yellow-600 mt-1">
                                No categories available. Please refresh the page.
                            </p>
                        )}
                    </div>

                    {/* Date */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Date *
                        </label>
                        <input
                            type="date"
                            value={formData.date}
                            onChange={(e) => setFormData({ ...formData, date: e.target.value })}
                            disabled={isSubmitting}
                            className={`w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-500 ${errors.date ? 'border-red-500' : 'border-gray-200'
                                } ${isSubmitting ? 'bg-gray-100' : ''}`}
                        />
                        {errors.date && (
                            <p className="text-xs text-red-600 mt-1">{errors.date}</p>
                        )}
                    </div>

                    {/* Merchant (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Merchant (Optional)
                        </label>
                        <input
                            type="text"
                            value={formData.merchant}
                            onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
                            disabled={isSubmitting}
                            className={`w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'bg-gray-100' : ''
                                }`}
                            placeholder="e.g., Supermarket"
                        />
                    </div>

                    {/* Notes (Optional) */}
                    <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                            Notes (Optional)
                        </label>
                        <textarea
                            value={formData.notes}
                            onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                            disabled={isSubmitting}
                            className={`w-full p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-blue-500 ${isSubmitting ? 'bg-gray-100' : ''
                                }`}
                            rows="2"
                            placeholder="Additional notes..."
                        />
                    </div>

                    {/* Submit */}
                    <div className="flex gap-3 pt-2">
                        <button
                            type="button"
                            onClick={onClose}
                            disabled={isSubmitting}
                            className="flex-1 py-2.5 border border-gray-200 text-gray-700 rounded-lg font-semibold hover:bg-gray-50 transition disabled:opacity-50"
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            disabled={isSubmitting || categoriesArray.length === 0}
                            className="flex-1 py-2.5 bg-blue-600 text-white rounded-lg font-semibold hover:bg-blue-700 transition disabled:opacity-50"
                        >
                            {isSubmitting ? 'Saving...' : (transaction ? 'Update' : 'Add')}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    )
}