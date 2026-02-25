// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import MobileNav from '@/components/MobileNav'

const inter = Inter({
  subsets: ['latin'],
  display: 'swap',
  variable: '--font-inter',
})

export const metadata = {
  title: 'FinanceAI - Smart Money Management',
  description: 'AI-powered personal finance tracking and insights for smarter financial decisions',
  keywords: 'finance, AI, money management, budgeting, expenses, savings',
  authors: [{ name: 'FinanceAI' }],
  viewport: 'width=device-width, initial-scale=1, maximum-scale=1',
  themeColor: '#3B82F6',
}


export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <MobileNav />
        <main className="lg:ml-72 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}