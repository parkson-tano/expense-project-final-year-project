// app/profile/page.js
'use client'

import { useState } from 'react'
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
    ChartBarIcon
} from '@heroicons/react/24/outline'

export default function Profile() {
    const [activeTab, setActiveTab] = useState('profile')
    const [isEditing, setIsEditing] = useState(false)
    const [showDeleteModal, setShowDeleteModal] = useState(false)
    const [darkMode, setDarkMode] = useState(false)
    const [notifications, setNotifications] = useState({
        email: true,
        push: true,
        sms: false,
        budgetAlerts: true,
        weeklyReport: true,
        marketing: false
    })

    const [user, setUser] = useState({
        name: "Jasmine M",
        email: "jasmien.m@example.com",
        phone: "+237 6XX XXX XXX",
        joinDate: "January 15, 2024",
        totalTransactions: 156,
        accountAge: "6 months",
        currency: "XAF",
        language: "English",
        monthlyBudget: 500000,
        savingsGoal: 2000000,
        avatar: null
    })

    const [editedUser, setEditedUser] = useState({ ...user })

    const formatXAF = (amount) => {
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

    const handleSaveProfile = () => {
        setUser(editedUser)
        setIsEditing(false)
    }

    const handleCancelEdit = () => {
        setEditedUser(user)
        setIsEditing(false)
    }

    const handleNotificationChange = (key) => {
        setNotifications(prev => ({ ...prev, [key]: !prev[key] }))
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
                                    {user.name.charAt(0)}
                                </span>
                            </div>
                        </div>
                        <button className="absolute -bottom-2 -right-2 w-8 h-8 bg-white rounded-lg shadow-md flex items-center justify-center hover:bg-gray-50 transition-colors">
                            <PencilIcon className="w-4 h-4 text-gray-600" />
                        </button>
                    </div>

                    {/* Mobile View Name */}
                    <div className="lg:hidden">
                        <h1 className="text-xl font-bold text-white">{user.name}</h1>
                        <p className="text-sm text-blue-100">{user.email}</p>
                    </div>
                </div>

                {/* Desktop Welcome Message */}
                <div className="hidden lg:block absolute bottom-4 right-8 text-white text-right">
                    <p className="text-sm opacity-90">Member since {user.joinDate}</p>
                </div>
            </div>

            {/* Main Content */}
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 lg:pt-8">
                <div className="lg:hidden mb-6">
                    {/* Mobile Greeting */}
                    <h1 className="text-2xl font-bold text-gray-900">Welcome back, {user.name.split(' ')[0]}!</h1>
                    <p className="text-gray-500 text-sm mt-1">Manage your account settings</p>
                </div>

                {/* Mobile Tab Navigation - Horizontal Scroll */}
                <div className="lg:hidden mb-6">
                    <div className="flex gap-2 overflow-x-auto pb-2 -mx-4 px-4">
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
                                <h2 className="text-xl font-bold text-gray-900">{user.name}</h2>
                                <p className="text-sm text-gray-600 mt-1">{user.email}</p>
                                <p className="text-xs text-gray-500 mt-2">Member since {user.joinDate}</p>
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

                                <button className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium text-red-600 hover:bg-red-50 transition-all">
                                    <ArrowLeftOnRectangleIcon className="w-5 h-5" />
                                    Sign Out
                                </button>
                            </nav>

                            {/* Quick Stats */}
                            <div className="p-4 bg-gray-50 border-t border-gray-100">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Transactions</p>
                                        <p className="text-lg font-bold text-gray-900">{user.totalTransactions}</p>
                                    </div>
                                    <div className="text-center">
                                        <p className="text-xs text-gray-500">Account Age</p>
                                        <p className="text-lg font-bold text-gray-900">{user.accountAge}</p>
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
                                            <div>
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Full Name</label>
                                                <input
                                                    type="text"
                                                    value={isEditing ? editedUser.name : user.name}
                                                    onChange={(e) => setEditedUser({ ...editedUser, name: e.target.value })}
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Email Address</label>
                                                <input
                                                    type="email"
                                                    value={isEditing ? editedUser.email : user.email}
                                                    onChange={(e) => setEditedUser({ ...editedUser, email: e.target.value })}
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
                                                <label className="block text-sm font-medium text-gray-700 mb-2">Phone Number</label>
                                                <input
                                                    type="tel"
                                                    value={isEditing ? editedUser.phone : user.phone}
                                                    onChange={(e) => setEditedUser({ ...editedUser, phone: e.target.value })}
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

                                            {!isEditing && (
                                                <div className="bg-blue-50 rounded-xl p-4">
                                                    <div className="flex items-start gap-3">
                                                        <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center flex-shrink-0">
                                                            <DocumentTextIcon className="w-4 h-4 text-blue-600" />
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-blue-900">Account Summary</p>
                                                            <p className="text-xs text-blue-700 mt-1">
                                                                You&apos;ve made {user.totalTransactions} transactions since joining.
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
                                                    <p className="text-sm text-gray-500">Last changed 3 months ago</p>
                                                </div>
                                            </div>
                                            <button className="px-4 py-2 text-sm font-medium text-blue-600 hover:bg-blue-50 rounded-lg transition-colors">
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
                                                    <p className="text-sm text-gray-500">2 active sessions</p>
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
                                            <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                                                <option value="XAF">XAF - Central African CFA Franc</option>
                                                <option value="USD">USD - US Dollar</option>
                                                <option value="EUR">EUR - Euro</option>
                                                <option value="GBP">GBP - British Pound</option>
                                            </select>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Language</label>
                                            <select className="w-full p-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500">
                                                <option>English</option>
                                                <option>French</option>
                                                <option>Spanish</option>
                                                <option>Arabic</option>
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
                                                    value={user.monthlyBudget}
                                                    className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FCFA</span>
                                            </div>
                                            <p className="text-xs text-gray-500 mt-2">You&apos;ve used 76% of your monthly budget</p>
                                        </div>

                                        <div>
                                            <label className="block text-sm font-medium text-gray-700 mb-2">Savings Goal</label>
                                            <div className="relative">
                                                <input
                                                    type="number"
                                                    value={user.savingsGoal}
                                                    className="w-full p-3 pl-12 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
                                                />
                                                <span className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-500 font-medium">FCFA</span>
                                            </div>
                                        </div>

                                        <div className="bg-green-50 rounded-xl p-4">
                                            <div className="flex items-center justify-between mb-2">
                                                <span className="text-sm font-medium text-green-800">Progress to Goal</span>
                                                <span className="text-sm font-bold text-green-800">42%</span>
                                            </div>
                                            <div className="h-2 bg-green-200 rounded-full overflow-hidden">
                                                <div className="h-full bg-green-600 rounded-full" style={{ width: '42%' }} />
                                            </div>
                                            <p className="text-xs text-green-700 mt-2">
                                                You&apos;re {formatXAF(840000)} away from your savings goal
                                            </p>
                                        </div>
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
                                onClick={() => {
                                    // Handle delete
                                    setShowDeleteModal(false)
                                }}
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