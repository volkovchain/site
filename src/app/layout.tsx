import type { Metadata } from 'next'
import { Inter } from 'next/font/google'
import { Navigation } from '@/components/layout/Navigation'
import { Footer } from '@/components/layout/Footer'
import { MonitoringDashboard } from '@/components/monitoring/MonitoringDashboard'
import { ClientInitializer } from '@/components/ClientInitializer'
import './globals.css'

const inter = Inter({ subsets: ['latin', 'cyrillic'], display: 'swap' })

export const metadata: Metadata = {
  title: 'VolkovChain - Principal Blockchain Developer',
  description: 'Personal website of Principal Blockchain Developer specializing in Rust, Solidity, and DeFi protocols. Interactive cryptocurrency periodic table and educational content.',
  keywords: 'blockchain, solidity, rust, defi, smart contracts, web3, cryptocurrency',
  authors: [{ name: 'VolkovChain' }],
  openGraph: {
    title: 'VolkovChain - Principal Blockchain Developer',
    description: 'Interactive cryptocurrency periodic table and blockchain development expertise',
    type: 'website',
    locale: 'ru_RU',
  },
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ru" className="dark">
      <head>
        {/* Performance hints */}
        <link rel="dns-prefetch" href="//fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className={inter.className}>
        <div className="min-h-screen bg-white dark:bg-dark text-gray-900 dark:text-white">
          <ClientInitializer />
          <Navigation />
          <main className="min-h-screen">
            {children}
          </main>
          <Footer />
          <MonitoringDashboard />
        </div>
      </body>
    </html>
  )
}