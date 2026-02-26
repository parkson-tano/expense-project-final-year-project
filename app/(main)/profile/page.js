// app/profile/page.js
'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import {
    UserIcon,
    EnvelopeIcon,
    BellIcon,
    ShieldCheckIcon,
    CurrencyDollarIcon,
    ArrowLeftOnRectangleIcon,
    TrashIcon,
    PencilIcon,
    CheckIcon,
    XMarkIcon,
    DevicePhoneMobileIcon,
    LanguageIcon,
    MoonIcon,
    SunIcon,
    KeyIcon,
    CreditCardIcon,
    DocumentTextIcon,
    ChartBarIcon,
    ExclamationTriangleIcon
} from '@heroicons/react/24/outline'
import { useAuth } from '@/context/AuthContext'
import { useTransactions } from '@/hooks/useTransactions'
import { useBudgets } from '@/hooks/useBudgets'
import api from '@/lib/axios'

export default function Profile() {
    const router = useRouter()
    const { user, logout, updateProfile, loading: authLoading } = useAuth()
    const { summary } = useTransactions()
    const { budgets, summary: budgetSummary } = useBudgets()

    const [activeTab, setActiveTab] = useState('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [showPasswordModal, setShowPasswordModal] = useState(false)
    const [passwordData, setPasswordData] = useState({
        old_password: '',
        new_password: '',
        confirm_password: ''
    })
    const [passwordError, setPasswordError] = useState('')
    const [passwordSuccess, setPasswordSuccess] = useState('')
    const [isChangingPassword, setIsChangingPassword] = useState(false)

    const [notifications, setNotifications] = useState({
        email: user?.email_notifications ?? true,
        push: user?.push_notifications ?? true,
        sms: user?.sms_alerts ?? false,
        budgetAlerts: user?.budget_alerts ?? true,
        weeklyReport: user?.weekly_report ?? true,
        marketing: false
    })

    const [userData, setUserData] = useState({
        first_name: user?.first_name || '',
        last_name: user?.last_name || '',
        email: user?.email || '',
        phone: user?.phone_number || '',
        joinDate: user?.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
        totalTransactions: user?.transaction_count || 0,
        accountAge: user?.account_age_days ? `${Math.floor(user.account_age_days / 30)} months` : '0 months',
        currency: user?.currency || 'XAF',
        language: user?.language || 'en',
        monthlyBudget: user?.monthly_budget || 0,
        savingsGoal: user?.savings_goal || 0
    })

    const [editedUser, setEditedUser] = useState({ ...userData })

    // Update userData when user changes
    useEffect(() => {
        if (user) {
            setUserData({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone_number || '',
                joinDate: user.date_joined ? new Date(user.date_joined).toLocaleDateString('en-US', { month: 'long', year: 'numeric' }) : 'January 2024',
                totalTransactions: user.transaction_count || 0,
                accountAge: user.account_age_days ? `${Math.floor(user.account_age_days / 30)} months` : '0 months',
                currency: user.currency || 'XAF',
                language: user.language || 'en',
                monthlyBudget: user.monthly_budget || 0,
                savingsGoal: user.savings_goal || 0
            })
            setEditedUser({
                first_name: user.first_name || '',
                last_name: user.last_name || '',
                email: user.email || '',
                phone: user.phone_number || '',
                currency: user.currency || 'XAF',
                language: user.language || 'en',
                monthlyBudget: user.monthly_budget || 0,
                savingsGoal: user.savings_goal || 0
            })
            setNotifications({
                email: user.email_notifications ?? true,
                push: user.push_notifications ?? true,
                sms: user.sms_alerts ?? false,
                budgetAlerts: user.budget_alerts ?? true,
                weeklyReport: user.weekly_report ?? true,
                marketing: false
            })
        }
    }, [user])

    const formatXAF = (amount) => {
        if (!amount && amount !== 0) return '0 FCFA'
        return new Intl.NumberFormat('en-US', {
            style: 'currency',
            currency: 'XAF',
            minimumFractionDigits: 0,
            maximumFractionDigits: 0,
        }).format(amount).replace('XAF', 'FCFA')
    }

    const tabs = [
        { id: 'profile', name: 'Profile', icon: UserIcon },
        { id: 'security', name: 'Security', icon: ShieldCheckIcon },
        { id: 'notifications', name: 'Notifications', icon: BellIcon },
        { id: 'preferences', name: 'Preferences', icon: LanguageIcon },
        { id: 'budget', name: 'Budget', icon: ChartBarIcon }
    ]

    const handleSaveProfile = async () => {
        const result = await updateProfile({
            first_name: editedUser.first_name,
            last_name: editedUser.last_name,
            phone_number: editedUser.phone,
            currency: editedUser.currency,
            language: editedUser.language,
            monthly_budget: editedUser.monthlyBudget,
            savings_goal: editedUser.savingsGoal
        })

        if (result.success) {
            setIsEditing(false)
        } else {
            alert('Failed to update profile: ' + JSON.stringify(result.error))
        }
    }

    const handleCancelEdit = () => {
        setEditedUser({
            first_name: userData.first_name,
            last_name: userData.last_name,
            email: userData.email,
            phone: userData.phone,
            currency: userData.currency,
            language: userData.language,
            monthlyBudget: userData.monthlyBudget,
            savingsGoal: userData.savingsGoal
        })
        setIsEditing(false)
    }

    const handleNotificationChange = async (key) => {
        const newValue = !notifications[key]
        setNotifications(prev => ({ ...prev, [key]: newValue }))

        // Update on server
        await updateProfile({
            email_notifications: key === 'email' ? newValue : notifications.email,
            push_notifications: key === 'push' ? newValue : notifications.push,
            sms_alerts: key === 'sms' ? newValue : notifications.sms,
            budget_alerts: key === 'budgetAlerts' ? newValue : notifications.budgetAlerts,
            weekly_report: key === 'weeklyReport' ? newValue : notifications.weeklyReport
        })
    }

    const handleLogout = async () => {
        await logout()
        router.push('/')
    }

    const handleChangePassword = async (e) => {
        e.preventDefault()
        setPasswordError('')
        setPasswordSuccess('')

        if (passwordData.new_password !== passwordData.confirm_password) {
            setPasswordError('New passwords do not match')
            return
        }

        setIsChangingPassword(true)
        try {
            await api.post('/users/change_password/', {
                old_password: passwordData.old_password,
                new_password: passwordData.new_password
            })
            setPasswordSuccess('Password changed successfully!')
            setTimeout(() => {
                setShowPasswordModal(false)
                setPasswordData({ old_password: '', new_password: '', confirm_password: '' })
            }, 2000)
        } catch (error) {
            setPasswordError(error.response?.data?.old_password?.[0] || 'Failed to change password')
        } finally {
            setIsChangingPassword(false)
        }
    }

    const handleDeleteAccount = async () => {
        // Implement account deletion
        setShowDeleteModal(false)
    }

    const getInitials = () => {
        if (userData.first_name && userData.last_name) {
            return `${userData.first_name[0]}${userData.last_name[0]}`.toUpperCase()
        }
        if (userData.first_name) return userData.first_name[0].toUpperCase()
        if (userData.email) return userData.email[0].toUpperCase()
        return 'U'
    }

    const getDisplayName = () => {
        if (userData.first_name && userData.last_name) {
            return `${userData.first_name} ${userData.last_name}`
        }
        if (userData.first_name) return userData.first_name
        if (userData.email) return userData.email.split('@')[0]
        return 'User'
    }

    // Calculate budget progress
    const totalBudgeted = budgets?.reduce((sum, b) => sum + (b.amount || 0), 0) || 0
    const totalSpent = budgets?.reduce((sum, b) => sum + (b.spent_amount || 0), 0) || 0
    const budgetProgress = totalBudgeted > 0 ? Math.round((totalSpent / totalBudgeted) * 100) : 0

    // Calculate savings goal progress
    const totalSavings = (summary?.total_income || 0) - (summary?.total_expenses || 0)
    const savingsProgress = userData.savingsGoal > 0 ? Math.min(Math.round((totalSavings / userData.savingsGoal) * 100), 100) : 0

    if (authLoading) {
        return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600" />
            </div>
        )
    }

    return (
        <div className="min-h-screen bg-gray-50 pb-24 lg:pb-6">
            {/* Header with Cover Image */}
            <div className="relative h-32 lg:h-48 bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600">
                <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:20px_20px]" />

                {/* Profile Header - Overlapping Avatar */}
                <div className="absolute -bottom-12 left-4 lg:left-8 flex items-end gap-4">
                    <div className="relative">
                        <div className="w-24 h-24 lg:w-32 lg:h-32 rounded-2xl bg-white p-1 shadow-xl">
                            <div className="w-full h-full rounded-xl bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center">
                                <span className="text-3xl lg:text-4xl font-bold text-white">
                                    {getInitials()}
                                </span>
                            </div>
                        </div>
                        <button
                            onClick={() => setIsEditing(true)}
                            className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors"
                        >
                            <PencilIcon className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Mobile View Name */}
                    <div className="lg:hidden">
                        <h1 className="text-xl font-bold text-white">{getDisplayName()}</h1>
                        <p className="text-sm text-blue-100">{userData.email}</p>
                    </div>
                </div>

                {/* Desktop Welcome Message */}
                <div className="hidden lg:block absolute bottom-4 right-8 text-white text-right">
                    <p className="text-sm opacity-90">Member since {userData.joinDate}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8">
                <div className="lg:hidden mb-6">
                    {/* Mobile Greeting */}
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {userData.first_name || 'User'}!</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account settings</p>
                </div>

                {/* Mobile Tab Navigation - Horizontal Scroll */}
                <div className="lg:hidden mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4 scrollbar-hide">
                        {tabs.map((tab) => (
                            <button
                                key={tab.id}
                                onClick={() => setActiveTab(tab.id)}
                                className={`
                                    flex items-center gap-2 px-4 py-2 rounded-xl whitespace-nowrap transition-all
                                    ${activeTab === tab.id
                                        ? 'bg-blue-600 text-white shadow-md'
                                        : 'bg-white text-gray-600 border border-gray-200 hover:bg-gray-50'
                                    }
                                `}
                            >
                                <tab.icon className="w-4 h-4" />
                                <span className="text-sm font-medium">{tab.name}</span>
                            </button>
                        ))}
                    </div>
                </div>

                {/* Desktop Sidebar + Content */}
                <div className="grid lg:grid-cols-4 gap-6">
                    {/* Desktop Sidebar */}
                    <div className="hidden lg:block lg:col-span-1">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden sticky top-6">
                            {/* User Info */}
                            <div className="p-6 bg-gradient-to-br from-blue-50 to-indigo-50 border-b border-gray-100">
                                <h2 className="text-xl font-bold text-gray-900">{getDisplayName()}</h2>
                                <p className="text-sm text-gray-600 mt-1">{userData.email}</p>
                                <p className="text-xs text-gray-500 mt-2">Member since {userData.joinDate}</p>
                            </div>

                            {/* Navigation */}
                            <nav className="p-4">
                                {tabs.map((tab) => (
                                    <button
                                        key={tab.id}
                                        onClick={() => setActiveTab(tab.id)}
                                        className={`
                                            w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all mb-1
                                            ${activeTab === tab.id
                                                ? 'bg-blue-600 text-white shadow-md'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }
                                        `}
                                    >
                                        <tab.icon className="w-5 h-5" />
                                        {tab.name}
                                    </button>
                                ))}

                                <div className="border-t border-gray-200 my-4" />

                                <button
                                    onClick={handleLogout}
                                    className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all"
                                >
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </nav>

                            {/* Quick Stats */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Transactions</p>
                                        <p className="text-lg font-bold text-gray-900">{summary?.transaction_count || 0}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Account Age</p>
                                        <p className="text-lg font-bold text-gray-900">{userData.accountAge}</p>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>

                    {/* Content Area */}
                    <div className="lg:col-span-3">
                        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
                            {/* Profile Tab */}
                            {activeTab === 'profile' && (
                                <div className="divide-y divide-gray-100">
                                    {/* Header */}
                                    <div className="p-6 flex items-center justify-between">
                                        <div>
                                            <h2 className="text-xl font-semibold text-gray-900">Profile Information</h2>
                                            <p className="text-sm text-gray-500 mt-1">Update your personal information</p>
                                        </div>
                                        {!isEditing ? (
                                            <button
                                                onClick={() => setIsEditing(true)}
                                                className="px-4 py-2 bg-blue-600 text-white rounded-xl text-sm font-semibold hover:bg-blue-700 transition-colors"
                                            >
                                                Edit Profile
                                            </button>
                                        ) : (
                                            <div className="flex gap-2">
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="px-4 py-2 bg-green-600 text-white rounded-xl text-sm font-semibold hover:bg-green-700 transition-colors flex items-center gap-1"
                                                >
                                                    <CheckIcon className="w-4 h-4" />
                                                    Save
                                                </button>
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-4 py-2 bg-gray-100 text-gray-700 rounded-xl text-sm font-semibold hover:bg-gray-200 transition-colors flex items-center gap-1"
                                                >
                                                    <XMarkIcon className="w-4 h-4" />
                                                    Cancel
                                                </button>
                                            </div>
                                        )}
                                    </div>

                                    {/* Form */}
                                    <div className="p-6">
                                        <div className="space-y-4 max-w-2xl">
                                            <div className="grid grid-cols-2 gap-4">
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">First Name</label>
                                                    <input
                                                        type="text"
                                                        value={isEditing ? editedUser.first_name : userData.first_name}
                                                        onChange={(e) => setEditedUser({ ...editedUser, first_name: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`
                                                            w-full p-3 border rounded-xl transition-all
                                                            ${isEditing
                                                                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                            }
                                                        `}
                                                    />
                                                </div>
                                                <div>
                                                    <label className="block text-sm font-medium text-gray-700 mb-2">Last Name</label>
                                                    <input
                                                        type="text"
                                                        value={isEditing ? editedUser.last_name : userData.last_name}
                                                        onChange={(e) => setEditedUser({ ...editedUser, last_name: e.target.value })}
                                                        disabled={!isEditing}
                                                        className={`
                                                            w-full p-3 border rounded-xl transition-all
                                                            ${isEditing
                                                                ? 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                                                : 'border-gray-200 bg-gray-50 text-gray-600'
                                                            }
                                                        `}
                                                    />
                                                </div>
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={userData.email}
                                                    disabled
                                                    className="w-full p-3 border border-gray-200 bg-gray-50 text-gray-600 rounded-xl"
                                                />
                                            </div>

                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={isEditing ? editedUser.phone : userData.phone}
                                                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
                                                    disabled={!isEditing}
                                                    className={`
                                                        w-full p-3 border rounded-xl transition-all
                                                        ${isEditing
                                                            ? 'border-gray-300 focus:ring-2 focus:ring-blue-500'
                                                            : 'border-gray-200 bg-gray-50 text-gray-600'
                                                        }
                                                    `}
                                                    placeholder="+237 XXXXXXXXX"
                                                />
                                            </div>

                                            {!isEditing && (
                                                <div className="bg-blue-50 rounded-xl p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-900">Account Summary</p>
                                                            <p className="text-xs text-blue-700 mt-1">
                                                                You&apos;ve made {summary?.transaction_count || 0} transactions since joining.
                                                                Keep up the great work!
                                                            </p>
                                                        </div>
                                                    </div>
                                                </div>
                                            )}
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Security Tab */}
                            {activeTab === 'security' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Security Settings</h2>
                                    <div className="space-y-6 max-w-2xl">
                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <KeyIcon className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Password</p>
                                                    <p className="text-sm text-gray-500">Change your password</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setShowPasswordModal(true)}
                                                className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                                            >
                                                Change
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <ShieldCheckIcon className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                                                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                Enable
                                            </button>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                <DevicePhoneMobileIcon className="w-5 h-5 text-gray-600" />
                                                <div>
                                                    <p className="font-medium text-gray-900">Trusted Devices</p>
                                                    <p className="text-sm text-gray-500">Manage your active sessions</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
                                                Manage
                                            </button>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {/* Notifications Tab */}
                            {activeTab === 'notifications' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Notification Preferences</h2>
                                    <div className="space-y-4 max-w-2xl">
                                        <NotificationToggle
                                            label="Email Notifications"
                                            description="Receive updates via email"
                                            enabled={notifications.email}
                                            onChange={() => handleNotificationChange('email')}
                                        />
                                        <NotificationToggle
                                            label="Push Notifications"
                                            description="Get real-time alerts on your device"
                                            enabled={notifications.push}
                                            onChange={() => handleNotificationChange('push')}
                                        />
                                        <NotificationToggle
                                            label="SMS Alerts"
                                            description="Important updates via text message"
                                            enabled={notifications.sms}
                                            onChange={() => handleNotificationChange('sms')}
                                        />
                                        <NotificationToggle
                                            label="Budget Alerts"
                                            description="Get notified when nearing budget limits"
                                            enabled={notifications.budgetAlerts}
                                            onChange={() => handleNotificationChange('budgetAlerts')}
                                        />
                                        <NotificationToggle
                                            label="Weekly Report"
                                            description="Receive weekly financial summaries"
                                            enabled={notifications.weeklyReport}
                                            onChange={() => handleNotificationChange('weeklyReport')}
                                        />
                                    </div>
                                </div>
                            )}

                            {/* Preferences Tab */}
                            {activeTab === 'preferences' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Preferences</h2>
                                    <div className="space-y-6 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Currency</label>
                                            <select
                                                value={isEditing ? editedUser.currency : userData.currency}
                                                onChange={(e) => setEditedUser({ ...editedUser, currency: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <option value="XAF">XAF - Central African CFA Franc</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                            <select
                                                value={isEditing ? editedUser.language : userData.language}
                                                onChange={(e) => setEditedUser({ ...editedUser, language: e.target.value })}
                                                disabled={!isEditing}
                                                className={`w-full p-3 border rounded-xl focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                    }`}
                                            >
                                                <option value="en">English</option>
                                                <option value="fr">French</option>
                                                <option value="es">Spanish</option>
                                                <option value="ar">Arabic</option>
                                            </select>
                                        </div>

                                        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
                                            <div className="flex items-center gap-3">
                                                {darkMode ? <MoonIcon className="w-5 h-5 text-gray-600" /> : <SunIcon className="w-5 h-5 text-gray-600" />}
                                                <div>
                                                    <p className="font-medium text-gray-900">Dark Mode</p>
                                                    <p className="text-sm text-gray-500">Toggle dark theme</p>
                                                </div>
                                            </div>
                                            <button
                                                onClick={() => setDarkMode(!darkMode)}
                                                className={`relative w-12 h-6 rounded-full transition-colors ${darkMode ? 'bg-blue-600' : 'bg-gray-300'}`}
                                            >
                                                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${darkMode ? 'right-1' : 'left-1'}`} />
                                            </button>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}

                            {/* Budget Tab */}
                            {activeTab === 'budget' && (
                                <div className="p-6">
                                    <h2 className="text-xl font-semibold text-gray-900 mb-6">Budget Settings</h2>
                                    <div className="space-y-6 max-w-2xl">
                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Monthly Budget</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={isEditing ? editedUser.monthlyBudget : userData.monthlyBudget}
                                                    onChange={(e) => setEditedUser({ ...editedUser, monthlyBudget: parseInt(e.target.value) })}
                                                    disabled={!isEditing}
                                                    className={`w-full p-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FCFA</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">
                                                You&apos;ve used {budgetProgress}% of your total budget
                                            </p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Savings Goal</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={isEditing ? editedUser.savingsGoal : userData.savingsGoal}
                                                    onChange={(e) => setEditedUser({ ...editedUser, savingsGoal: parseInt(e.target.value) })}
                                                    disabled={!isEditing}
                                                    className={`w-full p-3 pl-12 border rounded-xl focus:ring-2 focus:ring-blue-500 ${isEditing ? 'border-gray-300' : 'border-gray-200 bg-gray-50'
                                                        }`}
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FCFA</span>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-green-800">Progress to Goal</span>
                                                <span className="text-sm font-bold text-green-800">{savingsProgress}%</span>
                                            </div>
                                            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-600 rounded-full" style={{ width: `${savingsProgress}%` }} />
                                            </div>
                                            <p className="text-xs text-green-700 mt-2">
                                                You&apos;re {formatXAF(Math.max(0, userData.savingsGoal - totalSavings))} away from your savings goal
                                            </p>
                                        </div>

                                        {isEditing && (
                                            <div className="flex justify-end gap-3 pt-4">
                                                <button
                                                    onClick={handleCancelEdit}
                                                    className="px-6 py-2 border border-gray-200 rounded-xl text-gray-700 hover:bg-gray-50"
                                                >
                                                    Cancel
                                                </button>
                                                <button
                                                    onClick={handleSaveProfile}
                                                    className="px-6 py-2 bg-blue-600 text-white rounded-xl hover:bg-blue-700"
                                                >
                                                    Save Changes
                                                </button>
                                            </div>
                                        )}
                                    </div>
                                </div>
                            )}
                        </div>

                        {/* Danger Zone - Mobile */}
                        <div className="lg:hidden mt-6">
                            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
                                <h3 className="text-lg font-semibold text-red-600 mb-4">Danger Zone</h3>
                                <button
                                    onClick={() => setShowDeleteModal(true)}
                                    className="w-full flex items-center justify-center gap-2 px-4 py-3 border-2 border-red-200 text-red-600 rounded-xl font-medium hover:bg-red-50 transition-colors"
                                >
                                    <TrashIcon className="w-5 h-5" />
                                    Delete Account
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Change Password Modal */}
            {showPasswordModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowPasswordModal(false)}>
                    <div className="bg-white rounded-2xl max-w-md w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-xl font-bold text-gray-900">Change Password</h3>
                            <button onClick={() => setShowPasswordModal(false)} className="p-1 hover:bg-gray-100 rounded-lg">
                                <XMarkIcon className="w-5 h-5" />
                            </button>
                        </div>

                        {passwordError && (
                            <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-sm text-red-600">
                                <ExclamationTriangleIcon className="w-4 h-4 flex-shrink-0" />
                                {passwordError}
                            </div>
                        )}

                        {passwordSuccess && (
                            <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg text-sm text-green-600">
                                {passwordSuccess}
                            </div>
                        )}

                        <form onSubmit={handleChangePassword} className="space-y-4">
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Current Password</label>
                                <input
                                    type="password"
                                    value={passwordData.old_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, old_password: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.new_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, new_password: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <div>
                                <label className="block text-sm font-medium text-gray-700 mb-1">Confirm New Password</label>
                                <input
                                    type="password"
                                    value={passwordData.confirm_password}
                                    onChange={(e) => setPasswordData({ ...passwordData, confirm_password: e.target.value })}
                                    className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                    required
                                />
                            </div>
                            <button
                                type="submit"
                                disabled={isChangingPassword}
                                className="w-full py-3 bg-blue-600 text-white rounded-xl font-semibold hover:bg-blue-700 transition-colors disabled:opacity-50"
                            >
                                {isChangingPassword ? 'Changing...' : 'Change Password'}
                            </button>
                        </form>
                    </div>
                </div>
            )}

            {/* Delete Account Modal */}
            {showDeleteModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4" onClick={() => setShowDeleteModal(false)}>
                    <div className="bg-white rounded-2xl max-w-sm w-full p-6" onClick={e => e.stopPropagation()}>
                        <div className="w-16 h-16 bg-red-100 rounded-full flex items-center justify-center mx-auto mb-4">
                            <TrashIcon className="w-8 h-8 text-red-600" />
                        </div>
                        <h3 className="text-xl font-bold text-center mb-2">Delete Account</h3>
                        <p className="text-gray-600 text-center text-sm mb-6">
                            Are you sure you want to delete your account? This action cannot be undone and all your data will be permanently removed.
                        </p>
                        <div className="flex gap-3">
                            <button
                                onClick={() => setShowDeleteModal(false)}
                                className="flex-1 py-3 border border-gray-200 rounded-xl font-medium hover:bg-gray-50 transition-colors"
                            >
                                Cancel
                            </button>
                            <button
                                onClick={handleDeleteAccount}
                                className="flex-1 py-3 bg-red-600 text-white rounded-xl font-medium hover:bg-red-700 transition-colors"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    )
}

// Notification Toggle Component
function NotificationToggle({ label, description, enabled, onChange }) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-50 rounded-xl">
            <div>
                <p className="font-medium text-gray-900">{label}</p>
                <p className="text-sm text-gray-500">{description}</p>
            </div>
            <button
                onClick={onChange}
                className={`relative w-12 h-6 rounded-full transition-colors ${enabled ? 'bg-blue-600' : 'bg-gray-300'}`}
            >
                <div className={`absolute top-1 w-4 h-4 rounded-full bg-white transition-transform ${enabled ? 'right-1' : 'left-1'}`} />
            </button>
        </div>
    )
}