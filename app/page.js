// app/page.js
import Link from 'next/link'
import { ArrowTrendingUpIcon, ShieldCheckIcon, ChartPieIcon } from '@heroicons/react/24/outline'

export default function Home() {
  return (
    <div className="space-y-12 pb-12">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-br from-blue-600 via-blue-500 to-indigo-600 rounded-3xl -mx-4 sm:mx-0 p-8 sm:p-12 text-white">
        <div className="absolute inset-0 bg-grid-white/[0.1] bg-[length:50px_50px]" />
        <div className="relative max-w-3xl mx-auto text-center">
          <h1 className="text-4xl sm:text-5xl md:text-6xl font-bold mb-6 leading-tight">
            Smart Money,
            <br />
            <span className="bg-clip-text text-transparent bg-gradient-to-r from-yellow-200 to-pink-200">
              Smarter Decisions
            </span>
          </h1>
          <p className="text-lg sm:text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
            Let AI handle your finances while you focus on what matters.
            Track expenses, get insights, and achieve your financial goals.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/register"
              className="inline-flex items-center justify-center px-8 py-4 bg-white text-blue-600 rounded-2xl font-semibold hover:bg-gray-100 transform hover:scale-105 transition-all duration-200 shadow-lg"
            >
              Get Started Free
            </Link>
            <Link
              href="/login"
              className="inline-flex items-center justify-center px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-2xl font-semibold border border-white/20 hover:bg-blue-500/30 transform hover:scale-105 transition-all duration-200"
            >
              Sign In
            </Link>
          </div>
        </div>
      </div>

      {/* Features Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <FeatureCard
          icon={<ChartPieIcon className="w-8 h-8" />}
          title="AI-Powered Insights"
          description="89% accuracy in categorizing your expenses automatically"
          gradient="from-purple-500 to-pink-500"
          stats="2.5k+ transactions analyzed"
        />
        <FeatureCard
          icon={<ShieldCheckIcon className="w-8 h-8" />}
          title="Bank-Level Security"
          description="Your data is encrypted and protected with advanced security"
          gradient="from-blue-500 to-cyan-500"
          stats="100% data protection"
        />
        <FeatureCard
          icon={<ArrowTrendingUpIcon className="w-8 h-8" />}
          title="Smart Analytics"
          description="Real-time insights into your spending patterns"
          gradient="from-green-500 to-emerald-500"
          stats="Save 33% more"
        />
      </div>

      {/* Quick Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <StatCard value="89%" label="Accuracy" />
        <StatCard value="24/7" label="Monitoring" />
        <StatCard value="10k+" label="Users" />
        <StatCard value="$2M+" label="Tracked" />
      </div>
    </div>
  )
}

function FeatureCard({ icon, title, description, gradient, stats }) {
  return (
    <div className="group relative bg-white p-8 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className={`w-14 h-14 bg-gradient-to-br ${gradient} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-xl font-bold mb-2">{title}</h3>
      <p className="text-gray-600 mb-4">{description}</p>
      <div className="text-sm font-semibold text-gray-900">{stats}</div>
    </div>
  )
}

function StatCard({ value, label }) {
  return (
    <div className="bg-white p-6 rounded-2xl shadow-sm border border-gray-100 text-center">
      <div className="text-2xl font-bold text-gray-900">{value}</div>
      <div className="text-sm text-gray-600">{label}</div>
    </div>
  )
}