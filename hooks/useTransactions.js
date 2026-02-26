// hooks/useTransactions.js
import { useState, useEffect } from 'react'
import api from '@/lib/axios'

export function useTransactions() {
    const [transactions, setTransactions] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)
    const [summary, setSummary] = useState(null)

    const fetchTransactions = async () => {
        try {
            setLoading(true)
            const response = await api.get('/transactions/')
            setTransactions(response.data.results || response.data)
            setError(null)
        } catch (err) {
            setError(err.response?.data || 'Failed to fetch transactions')
        } finally {
            setLoading(false)
        }
    }

    const fetchSummary = async (days = 30) => {
        try {
            const response = await api.get(`/transactions/summary/?days=${days}`)
            setSummary(response.data)
        } catch (err) {
            console.error('Failed to fetch summary:', err)
        }
    }

    const addTransaction = async (data) => {
        try {
            const response = await api.post('/transactions/', data)
            await fetchTransactions()
            await fetchSummary()
            return { success: true, data: response.data }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data || 'Failed to add transaction'
            }
        }
    }

    const updateTransaction = async (id, data) => {
        try {
            const response = await api.put(`/transactions/${id}/`, data)
            await fetchTransactions()
            await fetchSummary()
            return { success: true, data: response.data }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data || 'Failed to update transaction'
            }
        }
    }

    const deleteTransaction = async (id) => {
        try {
            await api.delete(`/transactions/${id}/`)
            await fetchTransactions()
            await fetchSummary()
            return { success: true }
        } catch (err) {
            return {
                success: false,
                error: err.response?.data || 'Failed to delete transaction'
            }
        }
    }

    useEffect(() => {
        fetchTransactions()
        fetchSummary()
    }, [])

    return {
        transactions,
        loading,
        error,
        summary,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        refresh: fetchTransactions
    }
}