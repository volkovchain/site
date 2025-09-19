import { Metadata } from 'next'
import { getPostWithServices } from '@/lib/blog'
import type { PostWithServices } from '@/types'

/**
 * Generate enhanced metadata for individual blog posts with service integration
 */
export function generatePostMetadata(slug: string): Metadata {
  const post = getPostWithServices(slug)
  
  if (!post) {
    return {
      title: 'Post Not Found | VolkovChain',
      description: 'The requested blog post could not be found.',
    }
  }

  // Generate service-aware title and description
  const serviceContext = generateServiceContext(post)
  const enhancedTitle = `${post.title} | ${serviceContext} | VolkovChain`
  const enhancedDescription = generateEnhancedDescription(post)
  
  // Generate structured keywords
  const keywords = generateSEOKeywords(post)
  
  // Generate canonical URL
  const canonicalUrl = `https://volkovchain.dev/insights/${slug}`
  
  return {
    title: enhancedTitle,
    description: enhancedDescription,
    keywords: keywords,
    authors: [{ name: post.author }],
    openGraph: {
      title: post.title,
      description: post.excerpt,
      type: 'article',
      url: canonicalUrl,
      siteName: 'VolkovChain',
      publishedTime: post.publishedAt.toISOString(),
      modifiedTime: post.updatedAt.toISOString(),
      authors: [post.author],
      tags: [...post.tags, ...generateServiceTags(post)],
      images: post.featuredImage ? [
        {
          url: post.featuredImage,
          width: 1200,
          height: 630,
          alt: post.title
        }
      ] : [
        {
          url: '/images/default-blog-og.jpg',
          width: 1200, 
          height: 630,
          alt: post.title
        }
      ]
    },
    twitter: {
      card: 'summary_large_image',
      title: post.title,
      description: post.excerpt,
      images: post.featuredImage ? [post.featuredImage] : ['/images/default-blog-twitter.jpg']
    },
    alternates: {
      canonical: canonicalUrl
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
    },
    other: {
      'article:author': post.author,
      'article:published_time': post.publishedAt.toISOString(),
      'article:modified_time': post.updatedAt.toISOString(),
      'article:section': post.category,
      'article:tag': post.tags.join(','),
      'content:difficulty': post.difficulty,
      'content:type': post.type,
      'content:reading_time': post.readingTime.toString(),
      'service:primary': post.primaryService || '',
      'service:related': (post.targetedServices || []).join(',')
    }
  }
}

/**
 * Generate service context for title enhancement
 */
function generateServiceContext(post: PostWithServices): string {
  if (post.relatedServices.length === 0) {
    return 'Blockchain Development Insights'
  }
  
  const primaryService = post.relatedServices[0]
  const contextMap: Record<string, string> = {
    'rust-blockchain-course': 'Rust Blockchain Education',
    'solidity-masterclass': 'Smart Contract Development',
    'custom-blockchain-dev': 'Custom Blockchain Solutions',
    'defi-protocol-dev': 'DeFi Development',
    'smart-contract-audit': 'Blockchain Security',
    'basic-consultation': 'Blockchain Consulting',
    'technical-blog-writing': 'Technical Content'
  }
  
  return contextMap[primaryService.serviceId] || 'Blockchain Development'
}

/**
 * Generate enhanced description with service context
 */
function generateEnhancedDescription(post: PostWithServices): string {
  let description = post.excerpt
  
  // Add service context if available
  if (post.relatedServices.length > 0) {
    const serviceNames = post.relatedServices.map(s => s.name.en).slice(0, 2)
    description += ` Related to ${serviceNames.join(' and ')} services.`
  }
  
  // Add content type and difficulty context
  const contentTypeLabel = post.type.charAt(0).toUpperCase() + post.type.slice(1).replace('-', ' ')
  description += ` ${contentTypeLabel} content for ${post.difficulty.toLowerCase()} level.`
  
  // Add reading time
  description += ` ${post.readingTime} minutes read.`
  
  return description
}

/**
 * Generate comprehensive SEO keywords
 */
function generateSEOKeywords(post: PostWithServices): string[] {
  const keywords = [...post.tags]
  
  // Add content type keywords
  const contentTypeKeywords = {
    'tutorial': ['tutorial', 'guide', 'how-to', 'step-by-step'],
    'blog': ['insights', 'analysis', 'blog', 'article'],
    'case-study': ['case study', 'real-world', 'implementation', 'project'],
    'opinion': ['opinion', 'perspective', 'analysis', 'commentary'],
    'news': ['news', 'updates', 'latest', 'developments']
  }
  
  keywords.push(...(contentTypeKeywords[post.type] || []))
  
  // Add difficulty keywords
  keywords.push(post.difficulty.toLowerCase(), `${post.difficulty.toLowerCase()} level`)
  
  // Add service-related keywords
  post.relatedServices.forEach(service => {
    keywords.push(service.name.en.toLowerCase())
    keywords.push(...service.tags)
  })
  
  // Add general blockchain keywords
  keywords.push('blockchain', 'web3', 'cryptocurrency', 'decentralized')
  
  // Remove duplicates and return
  return [...new Set(keywords)]
}

/**
 * Generate service-related tags for Open Graph
 */
function generateServiceTags(post: PostWithServices): string[] {
  const tags: string[] = []
  
  post.relatedServices.forEach(service => {
    tags.push(service.name.en)
    tags.push(...service.tags.slice(0, 3)) // Limit service tags
  })
  
  return [...new Set(tags)]
}

/**
 * Generate JSON-LD structured data for blog posts
 */
export function generatePostStructuredData(post: PostWithServices) {
  const structuredData = {
    '@context': 'https://schema.org',
    '@type': 'BlogPosting',
    headline: post.title,
    description: post.excerpt,
    author: {
      '@type': 'Person',
      name: post.author,
      url: 'https://volkovchain.dev/about'
    },
    publisher: {
      '@type': 'Organization', 
      name: 'VolkovChain',
      url: 'https://volkovchain.dev',
      logo: {
        '@type': 'ImageObject',
        url: 'https://volkovchain.dev/logo.png'
      }
    },
    datePublished: post.publishedAt.toISOString(),
    dateModified: post.updatedAt.toISOString(),
    mainEntityOfPage: {
      '@type': 'WebPage',
      '@id': `https://volkovchain.dev/insights/${post.slug}`
    },
    image: post.featuredImage || 'https://volkovchain.dev/images/default-blog.jpg',
    keywords: post.tags.join(', '),
    articleSection: post.category,
    wordCount: post.content.split(' ').length,
    timeRequired: `PT${post.readingTime}M`,
    audience: {
      '@type': 'Audience',
      audienceType: `${post.difficulty} level developers`
    },
    about: post.relatedServices.map(service => ({
      '@type': 'Service',
      name: service.name.en,
      description: service.shortDescription.en,
      provider: {
        '@type': 'Organization',
        name: 'VolkovChain'
      }
    })),
    mentions: post.relatedServices.map(service => ({
      '@type': 'Service',
      name: service.name.en
    }))
  }
  
  return JSON.stringify(structuredData)
}