// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import MobileNav from '@/components/MobileNav'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'FinanceAI - Smart Money Management',
  description: 'AI-powered personal finance tracking and insights',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body className={`${inter.className} bg-gray-50`}>
        <MobileNav />
        <main className="lg:ml-72 min-h-screen pb-20 lg:pb-0">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
            {children}
          </div>
        </main>
      </body>
    </html>
  )
}