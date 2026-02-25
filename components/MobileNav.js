// components/MobileNav.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    CreditCardIcon,
    ChartBarIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    CurrencyDollarIcon,
    BellIcon,
    ArrowRightOnRectangleIcon,
    Cog6ToothIcon
} from '@heroicons/react/24/outline'

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const [isScrolled, setIsScrolled] = useState(false)
    const [showTooltip, setShowTooltip] = useState(null)
    const pathname = usePathname()

    useEffect(() => {
        const handleScroll = () => {
            setIsScrolled(window.scrollY > 10)
        }
        window.addEventListener('scroll', handleScroll)
        return () => window.removeEventListener('scroll', handleScroll)
    }, [])

    // Close mobile menu when route changes
    useEffect(() => {
        setIsOpen(false)
    }, [pathname])

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon, color: 'blue' },
        { name: 'Transactions', href: '/transactions', icon: CreditCardIcon, color: 'green' },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon, color: 'purple' },
        { name: 'Profile', href: '/profile', icon: UserIcon, color: 'orange' },
    ]

    const isActive = (path) => pathname === path

    const getIconColor = (item, isActiveItem) => {
        if (isActiveItem) {
            return {
                blue: 'text-blue-600',
                green: 'text-green-600',
                purple: 'text-purple-600',
                orange: 'text-orange-600'
            }[item.color]
        }
        return 'text-gray-400 group-hover:text-gray-600'
    }

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex flex-col h-full bg-white/80 backdrop-blur-xl border-r border-gray-200/80 shadow-sm">
                    {/* Logo Area with Glass Effect */}
                    <div className="flex h-20 items-center px-6 border-b border-gray-100/80">
                        <Link href="/" className="flex items-center space-x-3 group">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg shadow-blue-500/20 group-hover:scale-105 transition-transform duration-300">
                                    <CurrencyDollarIcon className="w-5 h-5 text-white" />
                                </div>
                                <div className="absolute -top-1 -right-1 w-3 h-3 bg-green-500 rounded-full border-2 border-white animate-pulse" />
                            </div>
                            <div>
                                <span className="text-xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-indigo-600 bg-clip-text text-transparent">
                                    FinanceAI
                                </span>
                                <span className="block text-xs text-gray-500">Smart Money Manager</span>
                            </div>
                        </Link>
                    </div>

                    {/* Navigation */}
                    <nav className="flex-1 px-4 py-6">
                        <div className="space-y-1">
                            {navItems.map((item) => {
                                const active = isActive(item.href)
                                return (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        className={`
                      group relative flex items-center gap-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${active
                                                ? `bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-50 to-indigo-50' :
                                                    item.color === 'green' ? 'from-green-50 to-emerald-50' :
                                                        item.color === 'purple' ? 'from-purple-50 to-pink-50' :
                                                            'from-orange-50 to-amber-50'} text-gray-900 shadow-sm`
                                                : 'text-gray-600 hover:bg-gray-100/80'
                                            }
                    `}
                                        onMouseEnter={() => setShowTooltip(item.name)}
                                        onMouseLeave={() => setShowTooltip(null)}
                                    >
                                        <item.icon className={`w-5 h-5 transition-colors duration-200 ${active ? getIconColor(item, true) : 'text-gray-400 group-hover:text-gray-600'
                                            }`} />
                                        <span className="flex-1">{item.name}</span>

                                        {/* Active Indicator */}
                                        {active && (
                                            <div className={`w-1.5 h-1.5 rounded-full ${item.color === 'blue' ? 'bg-blue-600' :
                                                    item.color === 'green' ? 'bg-green-600' :
                                                        item.color === 'purple' ? 'bg-purple-600' :
                                                            'bg-orange-600'
                                                }`} />
                                        )}

                                        {/* Tooltip */}
                                        {showTooltip === item.name && !active && (
                                            <div className="absolute left-full ml-2 px-2 py-1 bg-gray-900 text-white text-xs rounded-lg whitespace-nowrap">
                                                Go to {item.name}
                                            </div>
                                        )}
                                    </Link>
                                )
                            })}
                        </div>

                        {/* Quick Actions */}
                        <div className="mt-8 pt-6 border-t border-gray-100">
                            <div className="bg-gradient-to-br from-blue-50 to-indigo-50 rounded-xl p-4">
                                <p className="text-xs font-medium text-gray-500 mb-2">QUICK ACTIONS</p>
                                <button className="w-full flex items-center gap-3 px-3 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors mb-2">
                                    <BellIcon className="w-4 h-4 text-gray-500" />
                                    <span>Notifications</span>
                                    <span className="ml-auto bg-red-500 text-white text-xs px-1.5 py-0.5 rounded-full">3</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-3 py-2 bg-white rounded-lg text-sm text-gray-700 hover:bg-gray-50 transition-colors">
                                    <Cog6ToothIcon className="w-4 h-4 text-gray-500" />
                                    <span>Settings</span>
                                </button>
                            </div>
                        </div>
                    </nav>

                    {/* User Profile Section */}
                    <div className="p-4 border-t border-gray-100">
                        <div className="flex items-center gap-3 px-4 py-3 bg-gray-50/80 rounded-xl">
                            <div className="relative">
                                <div className="w-10 h-10 bg-gradient-to-br from-gray-700 to-gray-900 rounded-xl flex items-center justify-center">
                                    <span className="text-sm font-semibold text-white">AC</span>
                                </div>
                                <div className="absolute -bottom-0.5 -right-0.5 w-3 h-3 bg-green-500 rounded-full border-2 border-white" />
                            </div>
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-semibold text-gray-900 truncate">Alex Chen</p>
                                <p className="text-xs text-gray-500 truncate">alex@example.com</p>
                            </div>
                            <button className="p-2 hover:bg-gray-200 rounded-lg transition-colors">
                                <ArrowRightOnRectangleIcon className="w-4 h-4 text-gray-500" />
                            </button>
                        </div>
                    </div>
                </div>
            </aside>

            {/* Mobile Header */}
            <div className={`
        lg:hidden fixed top-0 left-0 right-0 z-40 transition-all duration-300
        ${isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-sm' : 'bg-white'}
      `}>
                <div className="flex items-center justify-between px-4 h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="relative">
                            <div className="w-9 h-9 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                <CurrencyDollarIcon className="w-5 h-5 text-white" />
                            </div>
                            <div className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-green-500 rounded-full border-2 border-white" />
                        </div>
                        <span className="text-lg font-bold bg-gradient-to-r from-blue-600 to-indigo-600 bg-clip-text text-transparent">
                            FinanceAI
                        </span>
                    </Link>

                    <div className="flex items-center gap-2">
                        {/* Notification Bell */}
                        <button className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors">
                            <BellIcon className="w-5 h-5 text-gray-600" />
                            <span className="absolute top-1 right-1 w-2 h-2 bg-red-500 rounded-full" />
                        </button>

                        {/* Menu Button */}
                        <button
                            onClick={() => setIsOpen(!isOpen)}
                            className="relative p-2 hover:bg-gray-100 rounded-xl transition-colors"
                            aria-label="Toggle menu"
                        >
                            {isOpen ? (
                                <XMarkIcon className="w-6 h-6 text-gray-600" />
                            ) : (
                                <Bars3Icon className="w-6 h-6 text-gray-600" />
                            )}
                        </button>
                    </div>
                </div>
            </div>

            {/* Mobile Navigation Drawer */}
            <div className={`
        lg:hidden fixed inset-0 z-30 transition-all duration-300
        ${isOpen ? 'visible' : 'invisible'}
      `}>
                {/* Backdrop */}
                <div
                    className={`
            absolute inset-0 bg-black/50 transition-opacity duration-300
            ${isOpen ? 'opacity-100' : 'opacity-0'}
          `}
                    onClick={() => setIsOpen(false)}
                />

                {/* Drawer */}
                <div className={`
          absolute inset-y-0 right-0 w-80 max-w-[90vw] bg-white shadow-2xl transform transition-transform duration-300
          ${isOpen ? 'translate-x-0' : 'translate-x-full'}
        `}>
                    <div className="flex flex-col h-full">
                        {/* Drawer Header */}
                        <div className="p-6 border-b border-gray-100">
                            <div className="flex items-center gap-3">
                                <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-indigo-600 rounded-xl flex items-center justify-center shadow-lg">
                                    <span className="text-xl font-bold text-white">AC</span>
                                </div>
                                <div>
                                    <h3 className="font-semibold text-gray-900">Alex Chen</h3>
                                    <p className="text-sm text-gray-500">alex@example.com</p>
                                </div>
                            </div>
                        </div>

                        {/* Navigation Links */}
                        <nav className="flex-1 p-6">
                            <div className="space-y-2">
                                {navItems.map((item) => {
                                    const active = isActive(item.href)
                                    return (
                                        <Link
                                            key={item.name}
                                            href={item.href}
                                            className={`
                        flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200
                        ${active
                                                    ? `bg-gradient-to-r ${item.color === 'blue' ? 'from-blue-50 to-indigo-50' :
                                                        item.color === 'green' ? 'from-green-50 to-emerald-50' :
                                                            item.color === 'purple' ? 'from-purple-50 to-pink-50' :
                                                                'from-orange-50 to-amber-50'} text-gray-900`
                                                    : 'text-gray-600 hover:bg-gray-50'
                                                }
                      `}
                                        >
                                            <item.icon className={`w-5 h-5 ${active ? getIconColor(item, true) : 'text-gray-400'
                                                }`} />
                                            <span className="flex-1 font-medium">{item.name}</span>
                                            {active && (
                                                <div className={`w-1.5 h-1.5 rounded-full ${item.color === 'blue' ? 'bg-blue-600' :
                                                        item.color === 'green' ? 'bg-green-600' :
                                                            item.color === 'purple' ? 'bg-purple-600' :
                                                                'bg-orange-600'
                                                    }`} />
                                            )}
                                        </Link>
                                    )
                                })}
                            </div>

                            {/* Divider */}
                            <div className="my-6 border-t border-gray-100" />

                            {/* Additional Options */}
                            <div className="space-y-2">
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-gray-600 hover:bg-gray-50 rounded-xl transition-colors">
                                    <Cog6ToothIcon className="w-5 h-5 text-gray-400" />
                                    <span className="font-medium">Settings</span>
                                </button>
                                <button className="w-full flex items-center gap-3 px-4 py-3 text-red-600 hover:bg-red-50 rounded-xl transition-colors">
                                    <ArrowRightOnRectangleIcon className="w-5 h-5" />
                                    <span className="font-medium">Sign Out</span>
                                </button>
                            </div>
                        </nav>

                        {/* Version Info */}
                        <div className="p-6 border-t border-gray-100">
                            <p className="text-xs text-gray-400 text-center">
                                Version 2.0.0 • © 2024 FinanceAI
                            </p>
                        </div>
                    </div>
                </div>
            </div>

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-xl border-t border-gray-200/80 shadow-lg">
                <div className="flex justify-around items-center h-16 px-2">
                    {navItems.map((item) => {
                        const active = isActive(item.href)
                        return (
                            <Link
                                key={item.name}
                                href={item.href}
                                className={`
                  relative flex flex-col items-center justify-center flex-1 py-1 rounded-xl transition-all duration-200
                  ${active ? 'text-blue-600' : 'text-gray-500 hover:text-gray-900'}
                `}
                            >
                                <item.icon className={`w-5 h-5 transition-transform duration-200 ${active ? 'scale-110' : ''}`} />
                                <span className="text-[10px] font-medium mt-1">{item.name}</span>

                                {/* Active Indicator */}
                                {active && (
                                    <div className="absolute -top-0.5 left-1/2 transform -translate-x-1/2 w-1 h-1 bg-blue-600 rounded-full" />
                                )}
                            </Link>
                        )
                    })}
                </div>
            </nav>

            {/* Spacer for fixed header and bottom nav on mobile */}
            <div className="lg:hidden h-16" />
            <div className="lg:hidden h-16" />
        </>
    )
}