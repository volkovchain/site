import { Metadata } from 'next'
import InsightsPage from '@/components/blog/InsightsPage'
import { getAllPosts, getCategories, getContentTypes, getDifficultyLevels } from '@/lib/blog'
import { serviceRegistry } from '@/lib/serviceRegistry'

export const metadata: Metadata = {
  title: 'Insights & Updates | VolkovChain - Blockchain Development Knowledge Hub',
  description: 'Expert insights on blockchain development, tutorials, case studies, and industry updates. Learn from real-world experiences building decentralized applications and advance your Web3 career.',
  keywords: ['blockchain insights', 'web3 tutorials', 'smart contract guides', 'defi development', 'blockchain consulting', 'technical analysis', 'industry updates'],
  openGraph: {
    title: 'Insights & Updates | VolkovChain - Blockchain Development Knowledge Hub',
    description: 'Expert insights on blockchain development, tutorials, case studies, and industry updates from experienced Web3 professionals.',
    type: 'website',
    url: 'https://volkovchain.dev/insights',
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Insights & Updates | VolkovChain - Expert Blockchain Knowledge',
    description: 'Expert insights on blockchain development, tutorials, case studies, and industry updates from experienced Web3 professionals.',
  },
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