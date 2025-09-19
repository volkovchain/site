import type { Metadata } from 'next'

export const metadata: Metadata = {
  title: 'VolkovChain - Principal Blockchain Developer | Rust, Solidity, DeFi',
  description: 'Экспертные консультации по блокчейн-разработке. Интерактивная таблица криптовалют. Обучение Rust, Solidity, DeFi архитектуре. 8+ лет опыта, $500M+ TVL проектов.',
  keywords: [
    'блокчейн разработчик',
    'blockchain developer',
    'rust программист',
    'solidity эксперт',
    'defi архитектор',
    'смарт контракты',
    'блокчейн консультант',
    'криптовалюты',
    'web3 разработка',
    'ethereum разработка',
    'блокчейн обучение'
  ],
  authors: [{ name: 'VolkovChain', url: 'https://volkovchain.dev' }],
  creator: 'VolkovChain',
  publisher: 'VolkovChain',
  formatDetection: {
    email: false,
    address: false,
    telephone: false,
  },
  metadataBase: new URL(process.env.NEXT_PUBLIC_SITE_URL || 'https://volkovchain.dev'),
  alternates: {
    canonical: '/',
    languages: {
      'ru-RU': '/ru',
      'en-US': '/en',
    },
  },
  openGraph: {
    title: 'VolkovChain - Principal Blockchain Developer',
    description: 'Интерактивная таблица криптовалют и экспертные консультации по блокчейн-разработке',
    url: 'https://volkovchain.dev',
    siteName: 'VolkovChain',
    images: [
      {
        url: '/og-image.jpg',
        width: 1200,
        height: 630,
        alt: 'VolkovChain - Blockchain Developer',
      },
    ],
    locale: 'ru_RU',
    type: 'website',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'VolkovChain - Principal Blockchain Developer',
    description: 'Интерактивная таблица криптовалют и экспертные консультации по блокчейн-разработке',
    images: ['/twitter-image.jpg'],
    creator: '@volkovchain',
  },
  robots: {
    index: true,
    follow: true,
    nocache: false,
    googleBot: {
      index: true,
      follow: true,
      noimageindex: false,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  verification: {
    google: 'your-google-verification-code',
    yandex: 'your-yandex-verification-code',
  },
  category: 'technology',
  classification: 'business',
  referrer: 'origin-when-cross-origin',
}