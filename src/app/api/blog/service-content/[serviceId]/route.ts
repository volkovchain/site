import { NextRequest, NextResponse } from 'next/server'
import { getPostsByService, getAllServiceContentStrategies } from '@/lib/blog'
import { serviceRegistry } from '@/lib/serviceRegistry'
import type { Service, ServiceContentStrategy } from '@/types'
import type { BlogPostMetadata } from '@/lib/blog'

export interface ContentStrategy {
  strategy: ServiceContentStrategy
  recommendedTopics: string[]
  contentGaps: string[]
  performanceMetrics: {
    totalPosts: number
    averageEngagement: number
    conversionRate: number
  }
}

export interface ConversionMetrics {
  totalViews: number
  serviceInquiries: number
  conversionRate: number
  revenueAttribution: number
}

export interface ServiceContentResponse {
  service: Service
  relatedPosts: BlogPostMetadata[]
  contentStrategy: ContentStrategy
  conversionMetrics: ConversionMetrics
}

export async function GET(
  request: NextRequest,
  { params }: { params: { serviceId: string } }
) {
  try {
    const { serviceId } = params
    
    if (!serviceId) {
      return NextResponse.json(
        { error: 'Service ID parameter is required' },
        { status: 400 }
      )
    }

    // Get the service details
    const service = serviceRegistry.getServiceById(serviceId)
    
    if (!service) {
      return NextResponse.json(
        { error: 'Service not found' },
        { status: 404 }
      )
    }

    // Get related posts
    const relatedPosts = getPostsByService(serviceId)
    
    // Get content strategy
    const strategies = getAllServiceContentStrategies()
    const serviceStrategy = strategies[serviceId]
    
    if (!serviceStrategy) {
      return NextResponse.json(
        { error: 'Content strategy not found for this service' },
        { status: 404 }
      )
    }

    // Generate content recommendations
    const contentStrategy: ContentStrategy = {
      strategy: serviceStrategy,
      recommendedTopics: generateRecommendedTopics(serviceStrategy),
      contentGaps: identifyContentGaps(serviceStrategy, relatedPosts),
      performanceMetrics: {
        totalPosts: relatedPosts.length,
        averageEngagement: 0, // Will be implemented with analytics
        conversionRate: 0 // Will be implemented with analytics
      }
    }

    // Generate conversion metrics (mock data for now)
    const conversionMetrics: ConversionMetrics = {
      totalViews: relatedPosts.length * 1200, // Mock data
      serviceInquiries: Math.floor(relatedPosts.length * 0.05), // Mock 5% inquiry rate
      conversionRate: 0.05,
      revenueAttribution: service.priceRange.min * Math.floor(relatedPosts.length * 0.01)
    }

    const response: ServiceContentResponse = {
      service,
      relatedPosts,
      contentStrategy,
      conversionMetrics
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching service content:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateRecommendedTopics(strategy: ServiceContentStrategy): string[] {
  const baseTopics = strategy.keywords.map(keyword => {
    return [
      `Advanced ${keyword} Techniques`,
      `${keyword} Best Practices`,
      `Common ${keyword} Mistakes to Avoid`,
      `${keyword} Case Study`,
      `How to Get Started with ${keyword}`
    ]
  }).flat()

  // Add content type specific recommendations
  const typeBasedTopics = strategy.contentTypes.map(type => {
    switch (type) {
      case 'tutorial':
        return strategy.keywords.map(k => `Step-by-step ${k} Tutorial`)
      case 'case-study':
        return strategy.keywords.map(k => `Real-world ${k} Implementation`)
      case 'opinion':
        return strategy.keywords.map(k => `The Future of ${k}`)
      case 'news':
        return strategy.keywords.map(k => `Latest ${k} Developments`)
      default:
        return []
    }
  }).flat()

  return [...baseTopics, ...typeBasedTopics].slice(0, 10)
}

function identifyContentGaps(
  strategy: ServiceContentStrategy, 
  existingPosts: BlogPostMetadata[]
): string[] {
  const gaps: string[] = []
  
  // Check if all content types are covered
  strategy.contentTypes.forEach(contentType => {
    const hasContentType = existingPosts.some(post => post.type === contentType)
    if (!hasContentType) {
      gaps.push(`Missing ${contentType} content`)
    }
  })
  
  // Check keyword coverage
  strategy.keywords.forEach(keyword => {
    const hasKeywordContent = existingPosts.some(post =>
      post.title.toLowerCase().includes(keyword.toLowerCase()) ||
      post.description.toLowerCase().includes(keyword.toLowerCase()) ||
      post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
    )
    if (!hasKeywordContent) {
      gaps.push(`No content covering "${keyword}"`)
    }
  })
  
  // Check difficulty level coverage
  const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced']
  difficultyLevels.forEach(level => {
    const hasLevel = existingPosts.some(post => post.difficulty === level)
    if (!hasLevel) {
      gaps.push(`Missing ${level} level content`)
    }
  })
  
  return gaps
}