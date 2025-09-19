import { Metadata } from 'next'
import InsightsPage from '@/components/blog/InsightsPage'
import { getAllPosts, getCategories, getContentTypes, getDifficultyLevels } from '@/lib/blog'
import { serviceRegistry } from '@/lib/serviceRegistry'

export const metadata: Metadata = {
  title: 'Insights & Updates | VolkovChain - Blockchain Development Knowledge Hub',
  description: 'Expert insights on blockchain development, comprehensive tutorials, real-world case studies, and industry analysis. Learn from experienced Web3 professionals and advance your blockchain career with strategic content linked to our development services.',
  keywords: [
    'blockchain insights',
    'web3 tutorials', 
    'smart contract development',
    'defi development guides',
    'blockchain consulting',
    'rust blockchain programming',
    'solidity tutorials',
    'blockchain career advice',
    'web3 development services',
    'blockchain education'
  ],
  openGraph: {
    title: 'Insights & Updates | VolkovChain - Expert Blockchain Knowledge Hub',
    description: 'Comprehensive blockchain development insights, tutorials, and case studies. From beginner guides to advanced techniques, discover content strategically designed to accelerate your Web3 journey.',
    type: 'website',
    url: 'https://volkovchain.dev/insights',
    siteName: 'VolkovChain',
    images: [
      {
        url: '/images/insights-og.jpg',
        width: 1200,
        height: 630,
        alt: 'VolkovChain Insights & Updates - Blockchain Development Knowledge Hub'
      }
    ]
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights & Updates | VolkovChain - Expert Blockchain Knowledge',
    description: 'Expert blockchain development insights, tutorials, and industry analysis. Learn from experienced Web3 professionals.',
    images: ['/images/insights-twitter.jpg']
  },
  alternates: {
    canonical: 'https://volkovchain.dev/insights'
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  }
}

export default function Insights() {
  const posts = getAllPosts()
  const categories = getCategories()
  const contentTypes = getContentTypes()
  const difficultyLevels = getDifficultyLevels()
  const services = serviceRegistry.getServiceCategories().flatMap(cat => cat.services)

  return (
    <InsightsPage 
      initialPosts={posts} 
      categories={categories}
      contentTypes={contentTypes}
      difficultyLevels={difficultyLevels}
      services={services}
    />
  )
}