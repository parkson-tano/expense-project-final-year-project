// app/analytics/page.js
'use client'

import { useState, useEffect } from 'react'
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
import { useTransactions } from '@/hooks/useTransactions'
import { useCategories } from '@/hooks/useCategories'
import { useBudgets } from '@/hooks/useBudgets'
import Link from 'next/link'

export default function Analytics() {
  const [timeframe, setTimeframe] = useState('monthly')
  const { transactions, summary } = useTransactions()
  const { categories } = useCategories()
  const { budgets } = useBudgets()

  const [analyticsData, setAnalyticsData] = useState({
    categoryStats: [],
    monthlyData: [],
    totalExpenses: 0,
    totalIncome: 0,
    avgTransaction: 0,
    largestCategory: { name: 'None', amount: 0 },
    savingsRate: 0,
    insights: []
  })

  const { categoryStats, monthlyData, totalExpenses, totalIncome, avgTransaction, largestCategory, savingsRate, insights } = analyticsData

  const formatXAF = (amount) => {
    if (!amount && amount !== 0) return '0 FCFA'
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('XAF', 'FCFA')
  }

  const formatCompact = (amount) => {
    if (amount >= 1000000) {
      return (amount / 1000000).toFixed(1) + 'M'
    } else if (amount >= 1000) {
      return (amount / 1000).toFixed(0) + 'k'
    }
    return amount.toString()
  }

  useEffect(() => {
    const transactionsArray = transactions || []
    const stats = {}
    const monthly = {}
    let income = 0
    let expenses = 0
    let largestCategoryState = { name: 'None', amount: 0 }
    let savingsRateState = 0
    let statsArray = []
    let monthlyArray = []
    const newInsights = []

    transactionsArray.forEach(t => {
      const amount = Number(t.amount) || 0

      // Track income/expense totals
      if (t.type === 'income') {
        income += amount
      } else {
        expenses += amount

        // Category statistics (only for expenses)
        const categoryId = t.category
        const category = categories.find(c => c.id === categoryId) || t.category_details || { name: 'Uncategorized', color: 'gray', icon: '📦' }
        const catName = category.name

        if (!stats[catName]) {
          stats[catName] = {
            name: catName,
            total: 0,
            count: 0,
            color: category.color || 'gray',
            icon: category.icon || '📦',
            categoryId
          }
        }
        stats[catName].total += amount
        stats[catName].count++
      }

      // Monthly data
      if (t.date) {
        const date = new Date(t.date)
        const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
        const monthName = date.toLocaleDateString('en-US', { month: 'short' })

        if (!monthly[monthKey]) {
          monthly[monthKey] = {
            month: monthName,
            fullMonth: date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' }),
            income: 0,
            expenses: 0,
            savings: 0
          }
        }

        if (t.type === 'income') {
          monthly[monthKey].income += amount
        } else {
          monthly[monthKey].expenses += amount
        }
        monthly[monthKey].savings = monthly[monthKey].income - monthly[monthKey].expenses
      }
    })

    // Sort and prepare category stats
    statsArray = Object.values(stats).sort((a, b) => b.total - a.target)

    // Set largest category
    if (statsArray.length > 0) {
      largestCategoryState = {
        name: statsArray[0].name,
        amount: statsArray[0].total
      }
    }

    // Sort monthly data chronologically
    monthlyArray = Object.values(monthly).slice(-6)

    // Calculate totals and savings rate
    savingsRateState = income > 0 ? Math.round(((income - expenses) / income) * 100) : 0

    // Generate insights
    statsArray.forEach(cat => {
      if (cat.total > expenses * 0.3) {
        newInsights.push({
          type: 'warning',
          title: 'High Spending Alert',
          message: `${cat.name} represents ${Math.round((cat.total / expenses) * 100)}% of your expenses`,
          impact: `${formatXAF(cat.total)} this month`,
          action: 'Review transactions',
          icon: '⚠️'
        })
      }
    })

    // Check savings rate
    if (savingsRateState < 20) {
      newInsights.push({
        type: 'warning',
        title: 'Low Savings Rate',
        message: `You're saving only ${savingsRateState}% of your income`,
        impact: `Target: 20% or more`,
        action: 'See tips',
        icon: '📉'
      })
    } else if (savingsRateState > 30) {
      newInsights.push({
        type: 'success',
        title: 'Great Savings!',
        message: `You're saving ${savingsRateState}% of your income`,
        impact: 'Above average!',
        action: 'Keep it up',
        icon: '🎯'
      })
    }

    // Check month-over-month change
    if (monthlyArray.length >= 2) {
      const lastMonth = monthlyArray[monthlyArray.length - 1]
      const prevMonth = monthlyArray[monthlyArray.length - 2]

      if (lastMonth && prevMonth) {
        const expenseChange = ((lastMonth.expenses - prevMonth.expenses) / prevMonth.expenses) * 100
        if (expenseChange > 10) {
          newInsights.push({
            type: 'warning',
            title: 'Spending Increase',
            message: `Your expenses increased by ${Math.round(expenseChange)}% from last month`,
            impact: `${formatXAF(lastMonth.expenses - prevMonth.expenses)} more`,
            action: 'Review',
            icon: '📈'
          })
        } else if (expenseChange < -5) {
          newInsights.push({
            type: 'success',
            title: 'Spending Decrease',
            message: `Great job! Your expenses decreased by ${Math.abs(Math.round(expenseChange))}%`,
            impact: `Saved ${formatXAF(prevMonth.expenses - lastMonth.expenses)}`,
            action: 'Celebrate',
            icon: '🎉'
          })
        }
      }
    }

    // Update all state at once at the end
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setAnalyticsData({
      categoryStats: statsArray,
      monthlyData: monthlyArray,
      totalExpenses: expenses,
      totalIncome: income,
      avgTransaction: transactionsArray.length > 0 ? (income + expenses) / transactionsArray.length : 0,
      largestCategory: largestCategoryState,
      savingsRate: savingsRateState,
      insights: newInsights.slice(0, 3)
    })
  }, [transactions, categories])

  // Budget recommendations
  const getBudgetRecommendations = () => {
    const recommendations = []

    categoryStats.slice(0, 3).forEach(cat => {
      const recommended = Math.round(cat.total * 0.9) // Suggest 10% reduction
      recommendations.push({
        category: cat.name,
        current: cat.total,
        recommended,
        color: cat.color || 'purple'
      })
    })

    return recommendations
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
          value={formatXAF(totalIncome - totalExpenses)}
          change={totalIncome > 0 ? `${Math.round(((totalIncome - totalExpenses) / totalIncome) * 100)}%` : '0%'}
          trend={(totalIncome - totalExpenses) > 0 ? 'up' : 'down'}
          subtitle="of total income"
          icon={BanknotesIcon}
          gradient="from-green-500 to-emerald-500"
        />
        <MetricCard
          title="Avg Monthly Spend"
          value={formatXAF(Math.round(totalExpenses / (monthlyData.length || 1)))}
          change={monthlyData.length >= 2 ?
            `${Math.round(((monthlyData[monthlyData.length - 1]?.expenses - monthlyData[monthlyData.length - 2]?.expenses) / (monthlyData[monthlyData.length - 2]?.expenses || 1)) * 100)}%` :
            '0%'}
          trend="neutral"
          subtitle="vs previous month"
          icon={ChartBarIcon}
          gradient="from-blue-500 to-indigo-500"
        />
        <MetricCard
          title="Largest Category"
          value={largestCategory.name}
          subtitle={formatXAF(largestCategory.amount) + '/month'}
          icon={HomeIcon}
          gradient="from-purple-500 to-pink-500"
          isCategory
        />
        <MetricCard
          title="Savings Rate"
          value={`${savingsRate}%`}
          change={savingsRate > 20 ? '+Good' : '-Low'}
          trend={savingsRate > 20 ? 'up' : 'down'}
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
                <Link href="/categories" className="text-sm text-blue-600 hover:text-blue-700 font-medium flex items-center gap-1">
                  <span>View all</span>
                  <span>→</span>
                </Link>
              </div>
            </div>

            {/* Category Summary Cards - Easy to scan */}
            <div className="p-6 grid grid-cols-1 md:grid-cols-2 gap-4">
              {categoryStats.slice(0, 4).map((cat, index) => {
                const colors = {
                  blue: { bg: 'from-blue-50 to-blue-100/50', border: 'border-blue-200/50', icon: 'bg-blue-500', text: 'text-blue-600' },
                  green: { bg: 'from-emerald-50 to-emerald-100/50', border: 'border-emerald-200/50', icon: 'bg-emerald-500', text: 'text-emerald-600' },
                  amber: { bg: 'from-amber-50 to-amber-100/50', border: 'border-amber-200/50', icon: 'bg-amber-500', text: 'text-amber-600' },
                  purple: { bg: 'from-purple-50 to-purple-100/50', border: 'border-purple-200/50', icon: 'bg-purple-500', text: 'text-purple-600' },
                  gray: { bg: 'from-gray-50 to-gray-100/50', border: 'border-gray-200/50', icon: 'bg-gray-500', text: 'text-gray-600' },
                }
                const colorStyle = colors[cat.color] || colors.gray
                const percentage = totalExpenses > 0 ? Math.round((cat.total / totalExpenses) * 100) : 0

                return (
                  <div key={cat.name} className={`bg-gradient-to-br ${colorStyle.bg} rounded-xl p-4 border ${colorStyle.border}`}>
                    <div className="flex items-start justify-between mb-3">
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 ${colorStyle.icon} rounded-lg flex items-center justify-center shadow-sm`}>
                          <span className="text-white text-lg">{cat.icon}</span>
                        </div>
                        <div>
                          <h3 className="font-semibold text-gray-900">{cat.name}</h3>
                          <p className={`text-xs ${colorStyle.text} font-medium`}>{percentage}% of spending</p>
                        </div>
                      </div>
                      <span className="text-gray-600 text-sm font-medium">
                        {cat.count} txns
                      </span>
                    </div>
                    <div className="flex items-end justify-between">
                      <div>
                        <p className="text-sm text-gray-500">Total spent</p>
                        <p className="text-xl font-bold text-gray-900">{formatCompact(cat.total)} FCFA</p>
                      </div>
                    </div>
                    {/* Simple progress bar */}
                    <div className="mt-3">
                      <div className="h-2 bg-gray-200 rounded-full overflow-hidden">
                        <div className={`h-full ${colorStyle.icon} rounded-full`} style={{ width: `${percentage}%` }} />
                      </div>
                    </div>
                  </div>
                )
              })}
            </div>

            {/* Quick comparison table */}
            {categoryStats.length > 0 && (
              <div className="border-t border-gray-100 bg-gray-50/50 p-4">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Quick comparison</h3>
                <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs">
                  {categoryStats.slice(0, 5).map((cat) => (
                    <div key={cat.name} className="text-center p-2 bg-white rounded-lg">
                      <p className="text-gray-500">{cat.name}</p>
                      <p className="font-bold text-gray-900">{formatCompact(cat.total)}</p>
                      <p className="text-gray-600">{Math.round((cat.total / totalExpenses) * 100)}%</p>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* Simple Spending Pattern Card - Static for now, could be enhanced with time-based data */}
          <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">When you spend most</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
                  <span className="text-sm text-gray-600">Morning (6am-12pm)</span>
                </div>
                <div className="flex items-center gap-4">
                  <span className="text-sm font-semibold text-gray-900">{formatXAF(totalExpenses * 0.22)}</span>
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
                  <span className="text-sm font-semibold text-gray-900">{formatXAF(totalExpenses * 0.32)}</span>
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
                  <span className="text-sm font-semibold text-gray-900">{formatXAF(totalExpenses * 0.46)}</span>
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

        {/* Right Column - Insights & Recommendations */}
        <div className="space-y-6">
          {/* AI Insights Card */}
          <div className="bg-gradient-to-br from-indigo-600 to-purple-600 rounded-2xl shadow-lg overflow-hidden">
            <div className="p-6 text-white">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold">Smart Insights</h2>
                <span className="px-3 py-1 bg-white/20 rounded-full text-xs font-medium">
                  {insights.length} new
                </span>
              </div>

              <div className="space-y-4">
                {insights.length > 0 ? (
                  insights.map((insight, idx) => (
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
                  ))
                ) : (
                  <div className="bg-white/10 backdrop-blur-sm rounded-xl p-6 text-center">
                    <p className="text-white/80">Add more transactions to get insights</p>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Budget Recommendations */}
          {categoryStats.length > 0 && (
            <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6">
              <h2 className="text-lg font-semibold text-gray-900 mb-4">Budget Recommendations</h2>
              <div className="space-y-4">
                {getBudgetRecommendations().map((rec) => (
                  <RecommendationCard
                    key={rec.category}
                    category={rec.category}
                    current={rec.current}
                    recommended={rec.recommended}
                    color={rec.color}
                  />
                ))}
              </div>
            </div>
          )}

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4">
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Top Day</p>
              <p className="text-lg font-bold text-gray-900">Friday</p>
              <p className="text-xs text-gray-500 mt-1">Highest spending</p>
            </div>
            <div className="bg-gray-50 rounded-xl p-4">
              <p className="text-sm text-gray-600 mb-1">Avg Transaction</p>
              <p className="text-lg font-bold text-gray-900">{formatXAF(avgTransaction)}</p>
              <p className="text-xs text-gray-500 mt-1">Across all categories</p>
            </div>
          </div>
        </div>
      </div>

      {/* Monthly Comparison Table */}
      {monthlyData.length > 0 && (
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
                {monthlyData.map((month, idx) => (
                  <tr key={idx} className="hover:bg-gray-50 transition-colors">
                    <td className="px-6 py-4 font-medium text-gray-900">{month.month}</td>
                    <td className="px-6 py-4 text-green-600 font-medium">{formatXAF(month.income)}</td>
                    <td className="px-6 py-4 text-red-600 font-medium">{formatXAF(month.expenses)}</td>
                    <td className="px-6 py-4 font-medium text-gray-900">{formatXAF(month.savings)}</td>
                    <td className="px-6 py-4">
                      <span className={`px-3 py-1 rounded-full text-sm font-medium ${month.income > 0
                          ? month.savings / month.income > 0.3
                            ? 'bg-green-100 text-green-700'
                            : month.savings / month.income > 0.1
                              ? 'bg-yellow-100 text-yellow-700'
                              : 'bg-red-100 text-red-700'
                          : 'bg-gray-100 text-gray-700'
                        }`}>
                        {month.income > 0 ? Math.round((month.savings / month.income) * 100) : 0}%
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
      )}
    </div>
  )
}

// Metric Card Component
function MetricCard({ title, value, change, trend, subtitle, icon: Icon, gradient, isCategory }) {
  const getTrendColor = () => {
    if (trend === 'up') return 'bg-green-100 text-green-700'
    if (trend === 'down') return 'bg-red-100 text-red-700'
    return 'bg-gray-100 text-gray-700'
  }

  return (
    <div className="bg-white rounded-2xl border border-gray-100 shadow-sm p-6 hover:shadow-lg transition-all duration-300 group">
      <div className="flex items-start justify-between mb-4">
        <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${gradient} flex items-center justify-center group-hover:scale-110 transition-transform duration-300`}>
          <Icon className="w-6 h-6 text-white" />
        </div>
        {!isCategory && change && (
          <span className={`text-sm font-medium px-2 py-1 rounded-lg ${getTrendColor()}`}>
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
    amber: 'from-amber-500 to-orange-600',
    blue: 'from-blue-500 to-indigo-600',
    red: 'from-red-500 to-pink-600',
    gray: 'from-gray-500 to-gray-600'
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
          className={`h-full bg-gradient-to-r ${colors[color] || colors.gray} rounded-full`}
          style={{ width: `${(recommended / current) * 100}%` }}
        />
      </div>
      <p className="text-sm text-green-600 font-medium">
        Potential savings: {formatXAF(savings)} ({percentage}%)
      </p>
    </div>
  )
}