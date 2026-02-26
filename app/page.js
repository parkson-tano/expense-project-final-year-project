// app/page.js
'use client'

import Link from 'next/link'
import { useAuth } from '@/context/AuthContext'
import {
  CurrencyDollarIcon,
  ChartBarIcon,
  ShieldCheckIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const { user } = useAuth()

  const features = [
    {
      name: 'Track Expenses',
      description: 'Easily record and categorize your daily expenses',
      icon: CurrencyDollarIcon,
      color: 'blue'
    },
    {
      name: 'Monitor Income',
      description: 'Keep track of all your income sources',
      icon: ChartBarIcon,
      color: 'green'
    },
    {
      name: 'Secure & Private',
      description: 'Your financial data is encrypted and safe',
      icon: ShieldCheckIcon,
      color: 'purple'
    }
  ]

  return (
    <div className="space-y-16 pb-16">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-blue-600 to-indigo-700 rounded-3xl overflow-hidden">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:30px_30px]" />
        <div className="relative px-6 py-16 sm:px-12 sm:py-20 text-center">
          <h1 className="text-4xl sm:text-5xl font-bold text-white mb-6">
            Take Control of Your
            <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
              Finances Today
            </span>
          </h1>
          <p className="text-lg text-blue-100 mb-8 max-w-2xl mx-auto">
            A simple and secure way to track your income and expenses.
            Make better financial decisions with clear insights.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            {user ? (
              <Link
                href="/dashboard"
                className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition"
              >
                Go to Dashboard
                <ArrowRightIcon className="w-4 h-4" />
              </Link>
            ) : (
              <>
                <Link
                  href="/register"
                  className="inline-flex items-center gap-2 px-6 py-3 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition"
                >
                  Get Started
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="px-6 py-3 bg-blue-500/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-blue-500/30 transition"
                >
                  Sign In
                </Link>
              </>
            )}
          </div>
        </div>
      </div>

      {/* Features */}
      <div className="grid md:grid-cols-3 gap-6">
        {features.map((feature) => (
          <div
            key={feature.name}
            className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100"
          >
            <div className={`w-12 h-12 bg-${feature.color}-100 rounded-xl flex items-center justify-center mb-4`}>
              <feature.icon className={`w-6 h-6 text-${feature.color}-600`} />
            </div>
            <h3 className="text-lg font-semibold mb-2">{feature.name}</h3>
            <p className="text-gray-600 text-sm">{feature.description}</p>
          </div>
        ))}
      </div>

      {/* Stats */}
      <div className="bg-white rounded-2xl p-8 border border-gray-100">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
          <div>
            <div className="text-2xl font-bold text-gray-900">10k+</div>
            <div className="text-sm text-gray-600">Active Users</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">50k+</div>
            <div className="text-sm text-gray-600">Transactions</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">24/7</div>
            <div className="text-sm text-gray-600">Access</div>
          </div>
          <div>
            <div className="text-2xl font-bold text-gray-900">100%</div>
            <div className="text-sm text-gray-600">Secure</div>
          </div>
        </div>
      </div>
    </div>
  )
}