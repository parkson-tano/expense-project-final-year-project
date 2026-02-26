// hooks/useBudgets.js
import { useState, useEffect } from 'react'
import api from '@/lib/axios'

export function useBudgets() {
    const [budgets, setBudgets] = useState([])
    const [loading, setLoading] = useState(true)
    const [summary, setSummary] = useState(null)

    const fetchBudgets = async () => {
        try {
            const response = await api.get('/budgets/')
            setBudgets(response.data.results || response.data)
        } catch (error) {
            console.error('Failed to fetch budgets:', error)
        } finally {
            setLoading(false)
        }
    }

    const fetchSummary = async () => {
        try {
            const response = await api.get('/budgets/summary/')
            setSummary(response.data)
        } catch (error) {
            console.error('Failed to fetch budget summary:', error)
        }
    }

    const addBudget = async (data) => {
        try {
            const response = await api.post('/budgets/', data)
            await fetchBudgets()
            await fetchSummary()
            return { success: true, data: response.data }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data || 'Failed to add budget'
            }
        }
    }

    const updateBudget = async (id, data) => {
        try {
            const response = await api.put(`/budgets/${id}/`, data)
            await fetchBudgets()
            await fetchSummary()
            return { success: true, data: response.data }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data || 'Failed to update budget'
            }
        }
    }

    const deleteBudget = async (id) => {
        try {
            await api.delete(`/budgets/${id}/`)
            await fetchBudgets()
            await fetchSummary()
            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data || 'Failed to delete budget'
            }
        }
    }

    useEffect(() => {
        fetchBudgets()
        fetchSummary()
    }, [])

    return {
        budgets,
        loading,
        summary,
        addBudget,
        updateBudget,
        deleteBudget,
        refresh: fetchBudgets
    }
}