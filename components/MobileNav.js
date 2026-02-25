// components/MobileNav.js
'use client'

import { useState } from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import {
    HomeIcon,
    CreditCardIcon,
    ChartBarIcon,
    UserIcon,
    Bars3Icon,
    XMarkIcon,
    CurrencyDollarIcon
} from '@heroicons/react/24/outline'

export default function MobileNav() {
    const [isOpen, setIsOpen] = useState(false)
    const pathname = usePathname()

    const navItems = [
        { name: 'Dashboard', href: '/dashboard', icon: HomeIcon },
        { name: 'Transactions', href: '/transactions', icon: CreditCardIcon },
        { name: 'Analytics', href: '/analytics', icon: ChartBarIcon },
        { name: 'Profile', href: '/profile', icon: UserIcon },
    ]

    const isActive = (path) => pathname === path

    return (
        <>
            {/* Desktop Sidebar */}
            <aside className="hidden lg:fixed lg:inset-y-0 lg:flex lg:w-72 lg:flex-col">
                <div className="flex grow flex-col gap-y-5 overflow-y-auto bg-white border-r border-gray-200 px-6 pb-4">
                    <div className="flex h-16 shrink-0 items-center">
                        <Link href="/" className="flex items-center space-x-2">
                            <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                                <CurrencyDollarIcon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                                FinanceAI
                            </span>
                        </Link>
                    </div>

                    <nav className="flex flex-1 flex-col">
                        <ul className="flex flex-1 flex-col gap-y-7">
                            <li>
                                <ul className="-mx-2 space-y-1">
                                    {navItems.map((item) => (
                                        <li key={item.name}>
                                            <Link
                                                href={item.href}
                                                className={`
                          group flex gap-x-3 rounded-xl p-3 text-sm font-semibold leading-6 transition-all duration-200
                          ${isActive(item.href)
                                                        ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                                                        : 'text-gray-700 hover:text-blue-600 hover:bg-gray-50'
                                                    }
                        `}
                                            >
                                                <item.icon className={`h-6 w-6 shrink-0 transition-colors duration-200 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400 group-hover:text-blue-600'
                                                    }`} />
                                                {item.name}
                                            </Link>
                                        </li>
                                    ))}
                                </ul>
                            </li>
                        </ul>
                    </nav>
                </div>
            </aside>

            {/* Mobile Top Bar */}
            <div className="lg:hidden bg-white border-b border-gray-200 sticky top-0 z-30">
                <div className="flex items-center justify-between px-4 h-16">
                    <Link href="/" className="flex items-center space-x-2">
                        <div className="w-8 h-8 bg-gradient-to-r from-blue-600 to-blue-400 rounded-lg flex items-center justify-center">
                            <CurrencyDollarIcon className="w-5 h-5 text-white" />
                        </div>
                        <span className="text-xl font-bold bg-gradient-to-r from-blue-600 to-blue-400 bg-clip-text text-transparent">
                            FinanceAI
                        </span>
                    </Link>

                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="p-2 rounded-lg hover:bg-gray-100 transition-colors"
                    >
                        {isOpen ? (
                            <XMarkIcon className="w-6 h-6 text-gray-600" />
                        ) : (
                            <Bars3Icon className="w-6 h-6 text-gray-600" />
                        )}
                    </button>
                </div>
            </div>

            {/* Mobile Navigation Menu */}
            {isOpen && (
                <div className="lg:hidden fixed inset-0 z-20 bg-black bg-opacity-50" onClick={() => setIsOpen(false)}>
                    <div className="fixed inset-y-0 right-0 w-64 bg-white shadow-xl" onClick={e => e.stopPropagation()}>
                        <div className="p-6">
                            <nav className="space-y-2">
                                {navItems.map((item) => (
                                    <Link
                                        key={item.name}
                                        href={item.href}
                                        onClick={() => setIsOpen(false)}
                                        className={`
                      flex items-center space-x-3 px-4 py-3 rounded-xl text-sm font-medium transition-all duration-200
                      ${isActive(item.href)
                                                ? 'bg-gradient-to-r from-blue-50 to-indigo-50 text-blue-600'
                                                : 'text-gray-700 hover:bg-gray-50'
                                            }
                    `}
                                    >
                                        <item.icon className={`w-5 h-5 ${isActive(item.href) ? 'text-blue-600' : 'text-gray-400'}`} />
                                        <span>{item.name}</span>
                                    </Link>
                                ))}
                            </nav>
                        </div>
                    </div>
                </div>
            )}

            {/* Mobile Bottom Navigation */}
            <nav className="lg:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-30">
                <div className="flex justify-around items-center h-16">
                    {navItems.map((item) => (
                        <Link
                            key={item.name}
                            href={item.href}
                            className={`
                flex flex-col items-center justify-center space-y-1 px-3 py-2 rounded-xl transition-all duration-200
                ${isActive(item.href) ? 'text-blue-600' : 'text-gray-600 hover:text-blue-600'}
              `}
                        >
                            <item.icon className="w-5 h-5" />
                            <span className="text-xs font-medium">{item.name}</span>
                        </Link>
                    ))}
                </div>
            </nav>
        </>
    )
}