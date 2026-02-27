// app/layout.js
import { Inter } from 'next/font/google'
import './globals.css'
import { AuthProvider } from '@/context/AuthContext'
import Navbar from '@/components/Navbar'

const inter = Inter({ subsets: ['latin'] })

export const metadata = {
  title: 'Finance Manager',
  description: 'Track your income and expenses easily',
}

export default function RootLayout({ children }) {
  return (
    <html lang="en" className="h-full">
      <body className={`${inter.className} bg-gray-50 h-full`}>
        <AuthProvider>
          <div className="flex h-full">
            <Navbar />
            <main className="flex-1 overflow-auto lg:ml-72">
              <div className="max-w-8xl mx-auto px-4 sm:px-6 lg:px-8 py-16 lg:py-6">
                {children}
              </div>
            </main>
          </div>
        </AuthProvider>
      </body>
    </html>
  )
}