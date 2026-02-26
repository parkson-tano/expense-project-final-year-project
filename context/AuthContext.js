// context/AuthContext.js
'use client'

import { createContext, useContext, useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import api from '@/lib/axios'

const AuthContext = createContext()

export function AuthProvider({ children }) {
    const [user, setUser] = useState(null)
    const [loading, setLoading] = useState(true)
    const router = useRouter()

    const checkUser = async () => {
        const token = localStorage.getItem('access_token')
        if (token) {
            try {
                const response = await api.get('/users/profile/')
                setUser(response.data)
            } catch (error) {
                localStorage.removeItem('access_token')
                localStorage.removeItem('refresh_token')
            }
        }
        setLoading(false)
    }

    useEffect(() => {
        const initializeAuth = async () => {
            await checkUser()
        }
        initializeAuth()
    }, [])

    const login = async (email, password) => {
        try {
            const response = await api.post('/users/login/', { email, password })
            const { access, refresh, user } = response.data

            localStorage.setItem('access_token', access)
            localStorage.setItem('refresh_token', refresh)
            setUser(user)

            router.push('/dashboard')
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data?.error || 'Login failed'
            }
        }
    }

    const register = async (userData) => {
        try {
            const response = await api.post('/users/register/', userData)
            const { access, refresh, user } = response.data

            localStorage.setItem('access_token', access)
            localStorage.setItem('refresh_token', refresh)
            setUser(user)

            router.push('/dashboard')
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Registration failed'
            }
        }
    }

    const logout = () => {
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
        router.push('/')
    }

    const updateProfile = async (data) => {
        try {
            const response = await api.patch('/users/profile/', data)
            setUser(response.data)
            return { success: true }
        } catch (error) {
            return {
                success: false,
                error: error.response?.data || 'Update failed'
            }
        }
    }

    return (
        <AuthContext.Provider value={{
            user,
            loading,
            login,
            register,
            logout,
            updateProfile
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export const useAuth = () => useContext(AuthContext)