// app/page.js
'use client'

import { useState, useEffect } from 'react'
import Link from 'next/link'
import {
  ArrowTrendingUpIcon,
  ShieldCheckIcon,
  ChartPieIcon,
  BanknotesIcon,
  UserGroupIcon,
  ClockIcon,
  CheckCircleIcon,
  ArrowRightIcon,
  SparklesIcon,
  DevicePhoneMobileIcon,
  CpuChipIcon
} from '@heroicons/react/24/outline'

export default function Home() {
  const [isVisible, setIsVisible] = useState({})

  useEffect(() => {
    // Simple animation on scroll
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) {
            setIsVisible(prev => ({ ...prev, [entry.target.id]: true }))
          }
        })
      },
      { threshold: 0.1 }
    )

    document.querySelectorAll('[data-animate]').forEach(el => observer.observe(el))
    return () => observer.disconnect()
  }, [])

  const formatXAF = (amount) => {
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'XAF',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('XAF', 'FCFA')
  }

  return (
    <div className="min-h-screen">
      {/* Hero Section - Mobile First */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-600 overflow-hidden">
        {/* Animated Background */}
        <div className="absolute inset-0 opacity-20">
          <svg className="absolute inset-0 w-full h-full" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg" preserveAspectRatio="xMidYMid slice">
            <defs>
              <pattern id="grid" width="60" height="60" patternUnits="userSpaceOnUse">
                <g fill="none" fillRule="evenodd">
                  <g fill="#ffffff" fillOpacity="0.1">
                    <path d="M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z"/>
                  </g>
                </g>
              </pattern>
            </defs>
            <rect width="100%" height="100%" fill="url(#grid)" />
          </svg>
          <div className="absolute top-0 -left-4 w-72 h-72 bg-purple-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob" />
          <div className="absolute top-0 -right-4 w-72 h-72 bg-yellow-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl opacity-70 animate-blob animation-delay-4000" />
        </div>

        {/* Content */}
        <div className="relative px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-7xl mx-auto">
            {/* Mobile View */}
            <div className="lg:hidden text-center">
              <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                <SparklesIcon className="w-4 h-4 text-yellow-300 mr-2" />
                <span className="text-sm text-white font-medium">AI-Powered Finance</span>
              </div>

              <h1 className="text-4xl font-bold text-white mb-4">
                Smart Money,
                <span className="block text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                  Smarter Decisions
                </span>
              </h1>

              <p className="text-base text-blue-100 mb-8 max-w-md mx-auto">
                Let AI handle your finances while you focus on what matters.
                Track expenses, get insights, and achieve your financial goals.
              </p>

              {/* Mobile CTA Buttons */}
              <div className="flex flex-col gap-3 mb-8">
                <Link
                  href="/register"
                  className="w-full py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center justify-center gap-2"
                >
                  Get Started Free
                  <ArrowRightIcon className="w-4 h-4" />
                </Link>
                <Link
                  href="/login"
                  className="w-full py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-blue-500/30 transition-all"
                >
                  Sign In
                </Link>
              </div>

              {/* Mobile Stats */}
              <div className="grid grid-cols-3 gap-2">
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-xl font-bold text-white">89%</div>
                  <div className="text-xs text-blue-200">Accuracy</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-xl font-bold text-white">24/7</div>
                  <div className="text-xs text-blue-200">Monitoring</div>
                </div>
                <div className="bg-white/10 backdrop-blur-sm rounded-xl p-3">
                  <div className="text-xl font-bold text-white">10k+</div>
                  <div className="text-xs text-blue-200">Users</div>
                </div>
              </div>
            </div>

            {/* Desktop View */}
            <div className="hidden lg:flex items-center gap-12">
              <div className="flex-1">
                <div className="inline-flex items-center bg-white/20 backdrop-blur-sm rounded-full px-4 py-2 mb-6">
                  <SparklesIcon className="w-4 h-4 text-yellow-300 mr-2" />
                  <span className="text-sm text-white font-medium">AI-Powered Personal Finance</span>
                </div>

                <h1 className="text-5xl xl:text-6xl font-bold text-white mb-6">
                  Smart Money,
                  <br />
                  <span className="text-transparent bg-clip-text bg-gradient-to-r from-yellow-200 to-pink-200">
                    Smarter Decisions
                  </span>
                </h1>

                <p className="text-xl text-blue-100 mb-8 max-w-lg">
                  Let AI handle your finances while you focus on what matters.
                  Track expenses, get insights, and achieve your financial goals.
                </p>

                <div className="flex gap-4 mb-8">
                  <Link
                    href="/register"
                    className="px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg flex items-center gap-2 group"
                  >
                    Get Started Free
                    <ArrowRightIcon className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                  </Link>
                  <Link
                    href="/login"
                    className="px-8 py-4 bg-blue-500/20 backdrop-blur-sm text-white rounded-xl font-semibold border border-white/20 hover:bg-blue-500/30 transition-all"
                  >
                    Sign In
                  </Link>
                </div>

                <div className="flex gap-6">
                  <div>
                    <div className="text-2xl font-bold text-white">89%</div>
                    <div className="text-sm text-blue-200">Categorization Accuracy</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">10k+</div>
                    <div className="text-sm text-blue-200">Active Users</div>
                  </div>
                  <div>
                    <div className="text-2xl font-bold text-white">{formatXAF(25000000)}</div>
                    <div className="text-sm text-blue-200">Tracked</div>
                  </div>
                </div>
              </div>

              {/* Desktop Preview Card */}
              <div className="flex-1">
                <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                  <div className="flex items-center gap-3 mb-4">
                    <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
                      <BanknotesIcon className="w-5 h-5 text-white" />
                    </div>
                    <div>
                      <div className="text-sm text-blue-200">Total Balance</div>
                      <div className="text-2xl font-bold text-white">{formatXAF(2845000)}</div>
                    </div>
                  </div>
                  <div className="space-y-3">
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Monthly Income</span>
                      <span className="text-white font-semibold">+{formatXAF(620000)}</span>
                    </div>
                    <div className="flex justify-between text-sm">
                      <span className="text-blue-200">Monthly Expenses</span>
                      <span className="text-white font-semibold">-{formatXAF(384000)}</span>
                    </div>
                    <div className="h-2 bg-white/20 rounded-full overflow-hidden">
                      <div className="h-full w-3/4 bg-gradient-to-r from-green-400 to-emerald-500 rounded-full" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Wave Divider */}
        <div className="absolute bottom-0 left-0 right-0">
          <svg className="w-full h-12 fill-current text-gray-50" viewBox="0 0 1200 120" preserveAspectRatio="none">
            <path d="M321.39,56.44c58-10.79,114.16-30.13,172-41.86,82.39-16.72,168.19-17.73,250.45-.39C823.78,31,906.67,72,985.66,92.83c70.05,18.48,146.53,26.09,214.34,3V0H0V27.35A600.21,600.21,0,0,0,321.39,56.44Z" />
          </svg>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8 lg:mb-12" data-animate="features">
            <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 mb-3">
              Why Choose FinanceAI?
            </h2>
            <p className="text-gray-600 max-w-2xl mx-auto text-sm lg:text-base">
              Experience the power of AI in managing your personal finances
            </p>
          </div>

          {/* Mobile Features - Horizontal Scroll */}
          <div className="lg:hidden">
            <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
              <FeatureCard
                icon={<CpuChipIcon className="w-6 h-6" />}
                title="AI-Powered"
                description="89% accuracy in categorizing expenses automatically"
                color="purple"
              />
              <FeatureCard
                icon={<ShieldCheckIcon className="w-6 h-6" />}
                title="Bank-Level Security"
                description="Your data is encrypted and protected"
                color="blue"
              />
              <FeatureCard
                icon={<ChartPieIcon className="w-6 h-6" />}
                title="Smart Analytics"
                description="Real-time insights into spending patterns"
                color="green"
              />
              <FeatureCard
                icon={<DevicePhoneMobileIcon className="w-6 h-6" />}
                title="Mobile First"
                description="Manage finances on the go"
                color="orange"
              />
            </div>
          </div>

          {/* Desktop Features - Grid */}
          <div className="hidden lg:grid lg:grid-cols-3 gap-6">
            <FeatureCard
              icon={<CpuChipIcon className="w-8 h-8" />}
              title="AI-Powered Insights"
              description="89% accuracy in categorizing your expenses automatically"
              stats="2.5k+ transactions analyzed"
              color="purple"
              expanded
            />
            <FeatureCard
              icon={<ShieldCheckIcon className="w-8 h-8" />}
              title="Bank-Level Security"
              description="Your data is encrypted and protected with advanced security"
              stats="100% data protection"
              color="blue"
              expanded
            />
            <FeatureCard
              icon={<ChartPieIcon className="w-8 h-8" />}
              title="Smart Analytics"
              description="Real-time insights into your spending patterns"
              stats="Save 33% more"
              color="green"
              expanded
            />
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8">
            How It Works
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <StepCard
              number="1"
              title="Connect Accounts"
              description="Link your bank accounts and credit cards securely"
              icon="🔗"
            />
            <StepCard
              number="2"
              title="AI Categorization"
              description="Our AI automatically categorizes your transactions"
              icon="🤖"
            />
            <StepCard
              number="3"
              title="Get Insights"
              description="Receive personalized insights and recommendations"
              icon="📊"
            />
          </div>
        </div>
      </section>

      {/* Testimonials */}
      {/* <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gray-50">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-2xl lg:text-3xl font-bold text-gray-900 text-center mb-8">
            What Our Users Say
          </h2>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <TestimonialCard
              quote="This app transformed how I manage my money. The AI categorization is incredibly accurate!"
              author="Marie K."
              role="Freelancer"
              rating={5}
            />
            <TestimonialCard
              quote="I've saved over 200,000 FCFA in three months just by following the insights."
              author="Jean P."
              role="Software Engineer"
              rating={5}
            />
            <TestimonialCard
              quote="Finally a finance app that understands my spending habits. Highly recommended!"
              author="Sarah M."
              role="Small Business Owner"
              rating={5}
            />
          </div>
        </div>
      </section> */}

      {/* CTA Section */}
      <section className="py-12 px-4 sm:px-6 lg:px-8 bg-gradient-to-br from-blue-600 to-indigo-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-2xl lg:text-3xl font-bold text-white mb-4">
            Ready to Take Control of Your Finances?
          </h2>
          <p className="text-blue-100 mb-8 text-sm lg:text-base">
            Join thousands of users who are already saving money with FinanceAI
          </p>
          <Link
            href="/register"
            className="inline-flex items-center gap-2 px-8 py-4 bg-white text-blue-600 rounded-xl font-semibold hover:bg-gray-100 transition-all shadow-lg"
          >
            Get Started Free
            <ArrowRightIcon className="w-4 h-4" />
          </Link>
        </div>
      </section>
    </div>
  )
}

// Feature Card Component
function FeatureCard({ icon, title, description, stats, color, expanded }) {
  const colors = {
    purple: 'from-purple-500 to-pink-500',
    blue: 'from-blue-500 to-cyan-500',
    green: 'from-green-500 to-emerald-500',
    orange: 'from-orange-500 to-red-500'
  }

  if (!expanded) {
    return (
      <div className="flex-none w-64 bg-white rounded-xl p-4 shadow-sm border border-gray-100">
        <div className={`w-10 h-10 bg-gradient-to-br ${colors[color]} rounded-lg flex items-center justify-center text-white mb-3`}>
          {icon}
        </div>
        <h3 className="font-semibold text-gray-900 mb-1">{title}</h3>
        <p className="text-xs text-gray-600">{description}</p>
      </div>
    )
  }

  return (
    <div className="group bg-white p-6 rounded-2xl shadow-sm hover:shadow-xl transition-all duration-300 border border-gray-100">
      <div className={`w-12 h-12 bg-gradient-to-br ${colors[color]} rounded-xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform duration-300`}>
        {icon}
      </div>
      <h3 className="text-lg font-bold mb-2">{title}</h3>
      <p className="text-gray-600 text-sm mb-4">{description}</p>
      <div className="text-sm font-semibold text-gray-900">{stats}</div>
    </div>
  )
}

// Step Card Component
function StepCard({ number, title, description, icon }) {
  return (
    <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm text-center">
      <div className="relative inline-block">
        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-indigo-500 rounded-2xl flex items-center justify-center text-3xl text-white mb-4 mx-auto">
          {icon}
        </div>
        <div className="absolute -top-2 -right-2 w-6 h-6 bg-gray-900 text-white rounded-full flex items-center justify-center text-xs font-bold">
          {number}
        </div>
      </div>
      <h3 className="font-semibold text-gray-900 mb-2">{title}</h3>
      <p className="text-sm text-gray-600">{description}</p>
    </div>
  )
}

// // Testimonial Card Component
// function TestimonialCard({ quote, author, role, rating }) {
//   return (
//     <div className="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm">
//       <div className="flex gap-1 mb-4">
//         {[...Array(rating)].map((_, i) => (
//           <span key={i} className="text-yellow-400">★</span>
//         ))}
//       </div>
//       <p className="text-gray-700 text-sm mb-4">"{quote}"</p>
//       <div>
//         <p className="font-semibold text-gray-900">{author}</p>
//         <p className="text-xs text-gray-500">{role}</p>
//       </div>
//     </div>
//   )
// }