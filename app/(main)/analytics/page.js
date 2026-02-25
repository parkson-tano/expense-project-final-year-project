// app/analytics/page.js
'use client'

import { useState } from 'react'
import {
  ChartBarIcon,
  CalendarIcon,
  ArrowTrendingUpIcon,
  ArrowTrendingDownIcon,
  BanknotesIcon,
  ShoppingBagIcon,
  HomeIcon,
  TruckIcon,
  FilmIcon,
  BoltIcon,
  DocumentTextIcon,
  ChevronDownIcon,
  EllipsisHorizontalIcon
} from '@heroicons/react/24/outline'

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('monthly')
  const [selectedCategory, setSelectedCategory] = useState('all')

  const monthlyData = [
    { month: 'Jan', income: 520000, expenses: 245000, savings: 275000 },
    { month: 'Feb', income: 520000, expenses: 280000, savings: 240000 },
    { month: 'Mar', income: 540000, expenses: 320000, savings: 220000 },
    { month: 'Apr', income: 520000, expenses: 290000, savings: 230000 },
    { month: 'May', income: 520000, expenses: 345000, savings: 175000 },
    { month: 'Jun', income: 550000, expenses: 310000, savings: 240000 },
  ]

  const categoryTrends = [
    {
      category: 'Housing',
      average: 350000,
      trend: '+2.3%',
      direction: 'up',
      icon: HomeIcon,
      color: 'from-blue-500 to-blue-600',
      bgColor: 'bg-blue-50',
      textColor: 'text-blue-600',
      data: [320000, 335000, 342000, 350000, 348000, 355000]
    },
    {
      category: 'Groceries',
      average: 185000,
      trend: '-5.2%',
      direction: 'down',
      icon: ShoppingBagIcon,
      color: 'from-emerald-500 to-emerald-600',
      bgColor: 'bg-emerald-50',
      textColor: 'text-emerald-600',
      data: [195000, 190000, 188000, 185000, 182000, 178000]
    },
    {
      category: 'Transportation',
      average: 125000,
      trend: '+8.1%',
      direction: 'up',
      icon: TruckIcon,
      color: 'from-amber-500 to-amber-600',
      bgColor: 'bg-amber-50',
      textColor: 'text-amber-600',
      data: [115000, 118000, 122000, 125000, 130000, 135000]
    },
    {
      category: 'Entertainment',
      average: 95000,
      trend: '+12.4%',
      direction: 'up',
      icon: FilmIcon,
      color: 'from-purple-500 to-purple-600',
      bgColor: 'bg-purple-50',
      textColor: 'text-purple-600',
      data: [85000, 88000, 92000, 95000, 102000, 108000]
    },
    {
      category: 'Utilities',
      average: 85000,
      trend: '-3.2%',
      direction: 'down',
      icon: BoltIcon,
      color: 'from-orange-500 to-orange-600',
      bgColor: 'bg-orange-50',
      textColor: 'text-orange-600',
      data: [88000, 87000, 86000, 85000, 84000, 83000]
    },
  ]

  const insights = [
    {
      type: 'warning',
      title: 'Unusual spending detected',
      message: 'Entertainment expenses are 12.4% above your monthly average',
      impact: '+12,400 XAF this month',
      action: 'Review transactions',
      icon: '⚠️'
    },
    {
      type: 'success',
      title: 'Great job!',
      message: 'You reduced grocery spending by 5.2% compared to last month',
      impact: 'Saved 9,750 XAF',
      action: 'See breakdown',
      icon: '🎯'
    },
    {
      type: 'info',
      title: 'Savings opportunity',
      message: 'You could save 25,000 XAF monthly by optimizing transportation',
      impact: '300,000 XAF yearly',
      action: 'Learn how',
      icon: '💡'
    },
  ]

  const formatXAF = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('XAF', 'FCFA')
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header Section */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">Financial Analytics</h1>
          <p className="text-gray-500 mt-1">Deep insights into your spending patterns</p>
        </div>

        {/* Timeframe Selector */}
        <div className="flex items-center gap-2 p-1 bg-gray-100 rounded-2xl">
          {['weekly', 'monthly', 'yearly'].map((period) => (
            <button
              key={period}
              onClick={() => setTimeframe(period)}
              className={`
                px-4 py-2 rounded-xl text-sm font-medium capitalize transition-all duration-200
                ${timeframe === period
                  ? 'bg-white text-blue-600 shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
                }
              `}
            >
              {period}
            </button>
          ))}
        </div>
      </div>

      {/* Key Metrics Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <MetricCard
          title="Total Savings"
          value={formatXAF(1380000)}
          change="+8.2%"
          trend="up"
          subtitle="vs last 6 months"
          icon={BanknotesIcon}
          gradient="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Avg Monthly Spend"
          value={formatXAF(315000)}
          change="-2.1%"
          trend="down"
          subtitle="vs previous period"
          icon={ChartBarIcon}
          gradient="from-blue-500 to-indigo-500"
        />
        <MetricCard
          title="Largest Category"
          value="Housing"
          subtitle={formatXAF(350000) + '/month'}
          icon={HomeIcon}
          gradient="from-purple-500 to-pink-500"
          isCategory
        />
        <MetricCard
          title="Savings Rate"
          value="38%"
          change="+3.2%"
          trend="up"
          subtitle="of total income"
          icon={ArrowTrendingUpIcon}
          gradient="from-amber-500 to-orange-500"
        />
      </div>

      {/* Main Analytics Grid */}
      <div className="grid lg:grid-cols-3 gap-6">
        {/* Left Column - Category Analysis */}
        <div className="lg:col-span-2 space-y-6">
          {/* Category Overview Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-gray-900">Where your money goes</h2>
                  <p className="text-sm text-gray-500 mt-1">Monthly spending breakdown by category</p>
                </div>
                <button className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <span>View all</span>
                  <span>→</span>
                </button>
              </div>
            </div>

            {/* Category Summary Cards - Easy to scan */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {/* Housing - Highest expense */}
              <div className="bg-gradient-to-br from-blue-50 to-blue-100/50 rounded-xl p-4 border border-blue-200/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-blue-500 rounded-lg flex items-center justify-center shadow-sm">
                      <HomeIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Housing</h3>
                      <p className="text-xs text-blue-600 font-medium">34% of spending</p>
                    </div>
                  </div>
                  <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                    +2.3%
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly average</p>
                    <p className="text-xl font-bold text-gray-900">350,000 FCFA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">vs last month</p>
                    <p className="text-sm font-medium text-gray-700">+8,000 FCFA</p>
                  </div>
                </div>
                {/* Simple progress bar */}
                <div className="mt-3">
                  <div className="h-2 bg-blue-200 rounded-full overflow-hidden">
                    <div className="h-full bg-blue-600 rounded-full" style={{ width: '34%' }} />
                  </div>
                </div>
              </div>

              {/* Groceries - Decreasing trend */}
              <div className="bg-gradient-to-br from-emerald-50 to-emerald-100/50 rounded-xl p-4 border border-emerald-200/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-emerald-500 rounded-lg flex items-center justify-center shadow-sm">
                      <ShoppingBagIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Groceries</h3>
                      <p className="text-xs text-emerald-600 font-medium">18% of spending</p>
                    </div>
                  </div>
                  <span className="text-green-600 text-sm font-medium flex items-center gap-1">
                    <ArrowTrendingDownIcon className="w-3 h-3" />
                    -5.2%
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly average</p>
                    <p className="text-xl font-bold text-gray-900">185,000 FCFA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">saved this month</p>
                    <p className="text-sm font-medium text-green-600">+9,750 FCFA</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 bg-emerald-200 rounded-full overflow-hidden">
                    <div className="h-full bg-emerald-600 rounded-full" style={{ width: '18%' }} />
                  </div>
                </div>
              </div>

              {/* Transportation - Needs attention */}
              <div className="bg-gradient-to-br from-amber-50 to-amber-100/50 rounded-xl p-4 border border-amber-200/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-amber-500 rounded-lg flex items-center justify-center shadow-sm">
                      <TruckIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Transportation</h3>
                      <p className="text-xs text-amber-600 font-medium">12% of spending</p>
                    </div>
                  </div>
                  <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                    +8.1%
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly average</p>
                    <p className="text-xl font-bold text-gray-900">125,000 FCFA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">over budget</p>
                    <p className="text-sm font-medium text-amber-600">+15,000 FCFA</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 bg-amber-200 rounded-full overflow-hidden">
                    <div className="h-full bg-amber-600 rounded-full" style={{ width: '12%' }} />
                  </div>
                </div>
              </div>

              {/* Entertainment - Rising trend */}
              <div className="bg-gradient-to-br from-purple-50 to-purple-100/50 rounded-xl p-4 border border-purple-200/50">
                <div className="flex items-start justify-between mb-3">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-purple-500 rounded-lg flex items-center justify-center shadow-sm">
                      <FilmIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">Entertainment</h3>
                      <p className="text-xs text-purple-600 font-medium">9% of spending</p>
                    </div>
                  </div>
                  <span className="text-red-600 text-sm font-medium flex items-center gap-1">
                    <ArrowTrendingUpIcon className="w-3 h-3" />
                    +12.4%
                  </span>
                </div>
                <div className="flex items-end justify-between">
                  <div>
                    <p className="text-sm text-gray-500">Monthly average</p>
                    <p className="text-xl font-bold text-gray-900">95,000 FCFA</p>
                  </div>
                  <div className="text-right">
                    <p className="text-xs text-gray-500">vs last month</p>
                    <p className="text-sm font-medium text-purple-600">+10,500 FCFA</p>
                  </div>
                </div>
                <div className="mt-3">
                  <div className="h-2 bg-purple-200 rounded-full overflow-hidden">
                    <div className="h-full bg-purple-600 rounded-full" style={{ width: '9%' }} />
                  </div>
                </div>
              </div>
            </div>

            {/* Quick comparison table */}
            <div className="border-t border-gray-100 bg-gray-50/50 p-4">
              <h3 className="text-sm font-medium text-gray-700 mb-3">Quick comparison</h3>
              <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-gray-500">Housing</p>
                  <p className="font-bold text-gray-900">350k</p>
                  <p className="text-red-600">↑2.3%</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-gray-500">Groceries</p>
                  <p className="font-bold text-gray-900">185k</p>
                  <p className="text-green-600">↓5.2%</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-gray-500">Transport</p>
                  <p className="font-bold text-gray-900">125k</p>
                  <p className="text-red-600">↑8.1%</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-gray-500">Entertain</p>
                  <p className="font-bold text-gray-900">95k</p>
                  <p className="text-red-600">↑12%</p>
                </div>
                <div className="text-center p-2 bg-white rounded-lg">
                  <p className="text-gray-500">Utilities</p>
                  <p className="font-bold text-gray-900">85k</p>
                  <p className="text-green-600">↓3.2%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Simple Spending Pattern Card */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">When you spend most</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Morning (6am-12pm)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">85,000 FCFA</span>
                  <span className="text-xs text-gray-500 w-12 text-right">22%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-blue-500 rounded-full" style={{ width: '22%' }} />
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-amber-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Afternoon (12pm-6pm)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">124,000 FCFA</span>
                  <span className="text-xs text-gray-500 w-12 text-right">32%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-amber-500 rounded-full" style={{ width: '32%' }} />
              </div>

              <div className="flex items-center justify-between mt-3">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Evening (6pm-12am)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">178,000 FCFA</span>
                  <span className="text-xs text-gray-500 w-12 text-right">46%</span>
                </div>
              </div>
              <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
                <div className="h-full bg-purple-500 rounded-full" style={{ width: '46%' }} />
              </div>
            </div>

            {/* Simple insight */}
            <div className="mt-4 p-3 bg-blue-50 rounded-lg">
              <p className="text-sm text-blue-800">
                <span className="font-semibold">💡 Insight:</span> You spend most in the evenings. Consider setting an evening spending limit.
              </p>
            </div>
          </div>
        </div>

        {/* Right Column - AI Insights & Recommendations */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">AI Insights</h2>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  Live
                </span>
              </div>

              <div className="space-y-4">
                {insights.map((insight, idx) => (
                  <div
                    key={idx}
                    className="bg-white/10 backdrop-blur-sm rounded-xl p-4 hover:bg-white/20 transition-colors cursor-pointer"
                  >
                    <div className="flex items-start gap-3">
                      <span className="text-2xl">{insight.icon}</span>
                      <div className="flex-1">
                        <h3 className="font-semibold mb-1">{insight.title}</h3>
                        <p className="text-sm text-white/80 mb-2">{insight.message}</p>
                        <p className="text-sm font-medium text-white/90 mb-3">{insight.impact}</p>
                        <button className="text-sm bg-white/20 px-3 py-1.5 rounded-lg hover:bg-white/30 transition-colors">
                          {insight.action}
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Budget Recommendations */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Recommendations</h2>
            <div className="space-y-4">
              <RecommendationCard
                category="Entertainment"
                current={95000}
                recommended={80000}
                color="purple"
              />
              <RecommendationCard
                category="Groceries"
                current={185000}
                recommended={170000}
                color="green"
              />
              <RecommendationCard
                category="Transportation"
                current={125000}
                recommended={100000}
                color="amber"
              />
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Top Day</p>
              <p className="text-lg font-bold text-gray-900">Friday</p>
              <p className="text-xs text-gray-500 mt-1">Highest spending</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
              <p className="text-lg font-bold text-gray-900">{formatXAF(12500)}</p>
              <p className="text-xs text-gray-500 mt-1">Across all categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Comparison Table */}
      <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden">
        <div className="p-6 border-b border-gray-100">
          <h2 className="text-lg font-semibold text-gray-900">Monthly Performance</h2>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Month</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Income</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Expenses</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Savings</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Efficiency</th>
                <th className="px-6 py-4 text-left text-sm font-semibold text-gray-600">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {monthlyData.map((month) => (
                <tr key={month.month} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 font-medium text-gray-900">{month.month}</td>
                  <td className="px-6 py-4 text-green-600 font-medium">{formatXAF(month.income)}</td>
                  <td className="px-6 py-4 text-red-600 font-medium">{formatXAF(month.expenses)}</td>
                  <td className="px-6 py-4 font-medium text-gray-900">{formatXAF(month.savings)}</td>
                  <td className="px-6 py-4">
                    <span className="px-3 py-1 bg-green-100 text-green-700 rounded-full text-sm font-medium">
                      {Math.round((month.savings / month.income) * 100)}%
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <button className="p-2 hover:bg-gray-100 rounded-lg transition-colors">
                      <EllipsisHorizontalIcon className="w-5 h-5 text-gray-500" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, change, trend, subtitle, icon: Icon, gradient, isCategory }) {
  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {!isCategory && change && (
          <span className={`text-sm font-medium px-2 py-1 rounded-lg ${trend === 'up' ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'
            }`}>
            {change}
          </span>
        )}
      </div>
      <h3 className="text-sm text-gray-500 mb-1">{title}</h3>
      <p className="text-2xl font-bold text-gray-900 mb-1">{value}</p>
      {subtitle && <p className="text-sm text-gray-500">{subtitle}</p>}
    </div>
  )
}

// Recommendation Card Component
function RecommendationCard({ category, current, recommended, color }) {
  const colors = {
    purple: 'from-purple-500 to-purple-600',
    green: 'from-green-500 to-emerald-600',
    amber: 'from-amber-500 to-orange-600'
  }

  const formatXAF = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
    }).format(amount).replace('XAF', 'FCFA')
  }

  const savings = current - recommended
  const percentage = Math.round((savings / current) * 100)

  return (
    <div className="space-y-3">
      <div className="flex justify-between items-center">
        <span className="font-medium text-gray-900">{category}</span>
        <span className="text-sm text-gray-500">
          {formatXAF(current)} → {formatXAF(recommended)}
        </span>
      </div>
      <div className="h-2 bg-gray-100 rounded-full overflow-hidden">
        <div
          className={`h-full bg-gradient-to-r ${colors[color]} rounded-full`}
          style={{ width: `${(recommended / current) * 100}%` }}
        />
      </div>
      <p className="text-sm text-green-600 font-medium">
        Potential savings: {formatXAF(savings)} ({percentage}%)
      </p>
    </div>
  )
}