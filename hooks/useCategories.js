// hooks/useCategories.js
import { useState, useEffect } from 'react'
import api from '@/lib/axios'

// Default categories to create in backend
const DEFAULT_CATEGORY_DATA = [
    // Income categories
    { name: 'Salary', type: 'income', icon: '💰', color: 'green' },
    { name: 'Freelance', type: 'income', icon: '💻', color: 'blue' },
    { name: 'Investment', type: 'income', icon: '📈', color: 'purple' },
    { name: 'Business', type: 'income', icon: '🏢', color: 'indigo' },
    { name: 'Gift', type: 'income', icon: '🎁', color: 'pink' },

    // Expense categories
    { name: 'Housing', type: 'expense', icon: '🏠', color: 'blue' },
    { name: 'Groceries', type: 'expense', icon: '🛒', color: 'green' },
    { name: 'Dining', type: 'expense', icon: '🍽️', color: 'orange' },
    { name: 'Transportation', type: 'expense', icon: '🚗', color: 'amber' },
    { name: 'Entertainment', type: 'expense', icon: '🎬', color: 'purple' },
    { name: 'Utilities', type: 'expense', icon: '💡', color: 'yellow' },
    { name: 'Shopping', type: 'expense', icon: '🛍️', color: 'pink' },
    { name: 'Healthcare', type: 'expense', icon: '🏥', color: 'red' },
    { name: 'Education', type: 'expense', icon: '📚', color: 'indigo' },
    { name: 'Insurance', type: 'expense', icon: '🛡️', color: 'cyan' },
    { name: 'Subscriptions', type: 'expense', icon: '📱', color: 'emerald' },
    { name: 'Other', type: 'expense', icon: '📦', color: 'gray' },
]

export function useCategories() {
    const [categories, setCategories] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [initialized, setInitialized] = useState(false)

    // Create default categories in backend
    const createDefaultCategories = async () => {
        try {
            const createdCategories = []
            for (const catData of DEFAULT_CATEGORY_DATA) {
                try {
                    const response = await api.post('/categories/', catData)
                    createdCategories.push(response.data)
                } catch (err) {
                    console.warn(`Failed to create category ${catData.name}:`, err)
                }
            }
            return createdCategories
        } catch (error) {
            console.error('Failed to create default categories:', error)
            return []
        }
    }

    const fetchCategories = async () => {
        try {
            setLoading(true)
            const response = await api.get('/categories/')
            let data = response.data?.results || response.data || []

            // If no categories exist, create defaults
            if (!data || data.length === 0) {
                const createdCategories = await createDefaultCategories()
                data = createdCategories
            }

            setCategories(data)
            setError(null)
        } catch (error) {
            console.error('Failed to fetch categories:', error)
            setError('Failed to load categories')
        } finally {
            setLoading(false)
            setInitialized(true)
        }
    }

    const addCategory = async (data) => {
        try {
            const response = await api.post('/categories/', data)
            await fetchCategories() // Refresh the list
            return { success: true, data: response.data }
        } catch (err) {
            console.error('Failed to add category:', err)
            return {
                success: false,
                error: err.response?.data || 'Failed to add category'
            }
        }
    }

    const updateCategory = async (id, data) => {
        try {
            const response = await api.put(`/categories/${id}/`, data)
            await fetchCategories()
            return { success: true, data: response.data }
        } catch (err) {
            console.error('Failed to update category:', err)
            return {
                success: false,
                error: err.response?.data || 'Failed to update category'
            }
        }
    }

    const deleteCategory = async (id) => {
        try {
            await api.delete(`/categories/${id}/`)
            await fetchCategories()
            return { success: true }
        } catch (err) {
            console.error('Failed to delete category:', err)
            return {
                success: false,
                error: err.response?.data || 'Failed to delete category'
            }
        }
    }

    const getCategoriesByType = (type) => {
        if (!Array.isArray(categories)) return []
        return categories.filter(c => c && c.type === type)
    }

    const getCategoryById = (id) => {
        if (!Array.isArray(categories)) return null
        return categories.find(c => c && c.id === id)
    }

    useEffect(() => {
        fetchCategories()
    }, [])

    return {
        categories: Array.isArray(categories) ? categories : [],
        loading,
        error,
        initialized,
        addCategory,
        updateCategory,
        deleteCategory,
        getCategoriesByType,
        getCategoryById,
        refresh: fetchCategories
    }
}