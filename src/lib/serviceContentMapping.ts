import { serviceRegistry } from './serviceRegistry'
import { getAllPosts, getPostsByService } from './blog'
import type { 
  Service, 
  ServiceContentStrategy, 
  ContentPost,
  ConversionGoal,
  CTABlock,
  ServiceCTA 
} from '@/types'
import type { BlogPostMetadata } from './blog'

/**
 * Service-Content Mapping Utilities
 * Manages relationships between services and content for strategic lead generation
 */

// Enhanced service content strategies with detailed mapping
export const serviceContentStrategies: Record<string, ServiceContentStrategy> = {
  'rust-blockchain-course': {
    serviceId: 'rust-blockchain-course',
    contentTypes: ['tutorial', 'blog', 'case-study'],
    keywords: [
      'rust programming',
      'blockchain development',
      'rust blockchain',
      'systems programming',
      'memory safety',
      'performance optimization',
      'substrate framework',
      'polkadot development'
    ],
    ctaStrategies: ['consultation_booking', 'service_inquiry']
  },
  'solidity-masterclass': {
    serviceId: 'solidity-masterclass',
    contentTypes: ['tutorial', 'blog', 'case-study'],
    keywords: [
      'solidity',
      'smart contracts',
      'ethereum development',
      'defi protocols',
      'contract security',
      'gas optimization',
      'openzeppelin',
      'ethereum virtual machine'
    ],
    ctaStrategies: ['consultation_booking', 'service_inquiry']
  },
  'custom-blockchain-dev': {
    serviceId: 'custom-blockchain-dev',
    contentTypes: ['case-study', 'blog', 'opinion'],
    keywords: [
      'custom blockchain',
      'consensus mechanisms',
      'blockchain architecture',
      'enterprise blockchain',
      'private blockchain',
      'tokenomics',
      'blockchain scalability',
      'distributed systems'
    ],
    ctaStrategies: ['project_inquiry', 'consultation_booking']
  },
  'defi-protocol-dev': {
    serviceId: 'defi-protocol-dev',
    contentTypes: ['tutorial', 'case-study', 'blog'],
    keywords: [
      'defi development',
      'automated market makers',
      'yield farming',
      'liquidity mining',
      'governance tokens',
      'flash loans',
      'composability',
      'protocol security'
    ],
    ctaStrategies: ['project_inquiry', 'consultation_booking']
  },
  'smart-contract-audit': {
    serviceId: 'smart-contract-audit',
    contentTypes: ['blog', 'tutorial', 'case-study'],
    keywords: [
      'smart contract security',
      'security audit',
      'vulnerability assessment',
      'code review',
      'reentrancy attacks',
      'integer overflow',
      'access control',
      'formal verification'
    ],
    ctaStrategies: ['service_inquiry', 'consultation_booking']
  },
  'basic-consultation': {
    serviceId: 'basic-consultation',
    contentTypes: ['blog', 'opinion', 'news'],
    keywords: [
      'blockchain consulting',
      'technology selection',
      'architecture design',
      'blockchain strategy',
      'web3 adoption',
      'technical roadmap',
      'blockchain integration',
      'feasibility analysis'
    ],
    ctaStrategies: ['consultation_booking']
  },
  'technical-blog-writing': {
    serviceId: 'technical-blog-writing',
    contentTypes: ['blog', 'tutorial'],
    keywords: [
      'technical writing',
      'developer documentation',
      'api documentation',
      'technical content',
      'blockchain education',
      'content strategy',
      'technical marketing',
      'developer relations'
    ],
    ctaStrategies: ['service_inquiry', 'consultation_booking']
  }
}

/**
 * Content Performance Analytics
 */
export interface ContentAnalytics {
  totalPosts: number
  postsPerService: Record<string, number>
  contentTypeDistribution: Record<string, number>
  difficultyDistribution: Record<string, number>
  serviceEngagement: ServiceEngagementMetrics[]
  contentGaps: ContentGap[]
  recommendedContent: ContentRecommendation[]
}

export interface ServiceEngagementMetrics {
  serviceId: string
  serviceName: string
  relatedPostsCount: number
  averageReadingTime: number
  estimatedConversionValue: number
  contentTypes: string[]
  keywordCoverage: number
}

export interface ContentGap {
  serviceId: string
  gapType: 'content_type' | 'difficulty' | 'keyword' | 'frequency'
  description: string
  priority: 'high' | 'medium' | 'low'
  suggestedAction: string
}

export interface ContentRecommendation {
  serviceId: string
  contentType: string
  suggestedTitle: string
  targetKeywords: string[]
  difficulty: string
  estimatedImpact: 'high' | 'medium' | 'low'
  reasoning: string
}

/**
 * Get comprehensive content analytics
 */
export function getContentAnalytics(): ContentAnalytics {
  const allPosts = getAllPosts()
  const services = serviceRegistry.getServiceCategories().flatMap(cat => cat.services)
  
  // Basic statistics
  const totalPosts = allPosts.length
  const postsPerService: Record<string, number> = {}
  const contentTypeDistribution: Record<string, number> = {}
  const difficultyDistribution: Record<string, number> = {}
  
  // Calculate distributions
  allPosts.forEach(post => {
    // Content type distribution
    const type = post.type || 'blog'
    contentTypeDistribution[type] = (contentTypeDistribution[type] || 0) + 1
    
    // Difficulty distribution
    const difficulty = post.difficulty || 'Intermediate'
    difficultyDistribution[difficulty] = (difficultyDistribution[difficulty] || 0) + 1
    
    // Service post counts
    const relatedServices = [
      ...(post.targetedServices || []),
      ...(post.primaryService ? [post.primaryService] : [])
    ]
    relatedServices.forEach(serviceId => {
      postsPerService[serviceId] = (postsPerService[serviceId] || 0) + 1
    })
  })
  
  // Service engagement metrics
  const serviceEngagement = services.map(service => 
    calculateServiceEngagement(service, allPosts)
  )
  
  // Content gaps analysis
  const contentGaps = identifyContentGaps(services, allPosts)
  
  // Content recommendations
  const recommendedContent = generateContentRecommendations(services, allPosts)
  
  return {
    totalPosts,
    postsPerService,
    contentTypeDistribution,
    difficultyDistribution,
    serviceEngagement,
    contentGaps,
    recommendedContent
  }
}

/**
 * Calculate service engagement metrics
 */
function calculateServiceEngagement(
  service: Service, 
  allPosts: BlogPostMetadata[]
): ServiceEngagementMetrics {
  const relatedPosts = allPosts.filter(post =>
    (post.targetedServices?.includes(service.serviceId)) ||
    post.primaryService === service.serviceId
  )
  
  const strategy = serviceContentStrategies[service.serviceId]
  const contentTypes = [...new Set(relatedPosts.map(p => p.type || 'blog'))]
  
  // Calculate keyword coverage
  let keywordCoverage = 0
  if (strategy) {
    const coveredKeywords = strategy.keywords.filter(keyword =>
      relatedPosts.some(post =>
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.description.toLowerCase().includes(keyword.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      )
    )
    keywordCoverage = (coveredKeywords.length / strategy.keywords.length) * 100
  }
  
  // Calculate average reading time
  const totalReadingTime = relatedPosts.reduce((sum, post) => {
    const minutes = parseInt(post.readingTime.replace(/\D/g, '')) || 5
    return sum + minutes
  }, 0)
  const averageReadingTime = relatedPosts.length > 0 ? totalReadingTime / relatedPosts.length : 0
  
  // Estimate conversion value based on service price and post count
  const estimatedConversionValue = relatedPosts.length * service.priceRange.min * 0.02 // 2% conversion rate estimate
  
  return {
    serviceId: service.serviceId,
    serviceName: service.name.en,
    relatedPostsCount: relatedPosts.length,
    averageReadingTime,
    estimatedConversionValue,
    contentTypes,
    keywordCoverage
  }
}

/**
 * Identify content gaps for strategic planning
 */
function identifyContentGaps(
  services: Service[], 
  allPosts: BlogPostMetadata[]
): ContentGap[] {
  const gaps: ContentGap[] = []
  
  services.forEach(service => {
    const strategy = serviceContentStrategies[service.serviceId]
    if (!strategy) return
    
    const relatedPosts = allPosts.filter(post =>
      (post.targetedServices?.includes(service.serviceId)) ||
      post.primaryService === service.serviceId
    )
    
    // Check content type gaps
    strategy.contentTypes.forEach(contentType => {
      const hasContentType = relatedPosts.some(post => post.type === contentType)
      if (!hasContentType) {
        gaps.push({
          serviceId: service.serviceId,
          gapType: 'content_type',
          description: `Missing ${contentType} content for ${service.name.en}`,
          priority: 'high',
          suggestedAction: `Create ${contentType} content targeting ${service.name.en}`
        })
      }
    })
    
    // Check difficulty level gaps
    const difficultyLevels = ['Beginner', 'Intermediate', 'Advanced']
    difficultyLevels.forEach(level => {
      const hasLevel = relatedPosts.some(post => post.difficulty === level)
      if (!hasLevel && relatedPosts.length > 0) {
        gaps.push({
          serviceId: service.serviceId,
          gapType: 'difficulty',
          description: `Missing ${level} level content for ${service.name.en}`,
          priority: 'medium',
          suggestedAction: `Create ${level} level content for ${service.name.en}`
        })
      }
    })
    
    // Check keyword coverage gaps
    const uncoveredKeywords = strategy.keywords.filter(keyword =>
      !relatedPosts.some(post =>
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.description.toLowerCase().includes(keyword.toLowerCase()) ||
        post.tags.some(tag => tag.toLowerCase().includes(keyword.toLowerCase()))
      )
    )
    
    if (uncoveredKeywords.length > strategy.keywords.length * 0.5) {
      gaps.push({
        serviceId: service.serviceId,
        gapType: 'keyword',
        description: `Low keyword coverage for ${service.name.en} (${uncoveredKeywords.length}/${strategy.keywords.length} keywords missing)`,
        priority: 'high',
        suggestedAction: `Create content targeting: ${uncoveredKeywords.slice(0, 3).join(', ')}`
      })
    }
    
    // Check posting frequency
    if (relatedPosts.length === 0) {
      gaps.push({
        serviceId: service.serviceId,
        gapType: 'frequency',
        description: `No content exists for ${service.name.en}`,
        priority: 'high',
        suggestedAction: `Create foundational content series for ${service.name.en}`
      })
    }
  })
  
  return gaps.sort((a, b) => {
    const priorityOrder = { high: 3, medium: 2, low: 1 }
    return priorityOrder[b.priority] - priorityOrder[a.priority]
  })
}

/**
 * Generate content recommendations based on gaps and opportunities
 */
function generateContentRecommendations(
  services: Service[], 
  allPosts: BlogPostMetadata[]
): ContentRecommendation[] {
  const recommendations: ContentRecommendation[] = []
  
  services.forEach(service => {
    const strategy = serviceContentStrategies[service.serviceId]
    if (!strategy) return
    
    const relatedPosts = allPosts.filter(post =>
      (post.targetedServices?.includes(service.serviceId)) ||
      post.primaryService === service.serviceId
    )
    
    // Generate recommendations based on missing content types
    strategy.contentTypes.forEach(contentType => {
      const hasContentType = relatedPosts.some(post => post.type === contentType)
      if (!hasContentType) {
        const recommendation = generateContentRecommendation(service, contentType, strategy)
        if (recommendation) {
          recommendations.push(recommendation)
        }
      }
    })
    
    // Generate recommendations for popular keywords not yet covered
    const uncoveredKeywords = strategy.keywords.filter(keyword =>
      !relatedPosts.some(post =>
        post.title.toLowerCase().includes(keyword.toLowerCase()) ||
        post.description.toLowerCase().includes(keyword.toLowerCase())
      )
    )
    
    if (uncoveredKeywords.length > 0) {
      const topKeyword = uncoveredKeywords[0]
      const recommendation = generateKeywordRecommendation(service, topKeyword, strategy)
      if (recommendation) {
        recommendations.push(recommendation)
      }
    }
  })
  
  return recommendations.slice(0, 10) // Limit to top 10 recommendations
}

/**
 * Generate content recommendation for a specific content type
 */
function generateContentRecommendation(
  service: Service,
  contentType: string,
  strategy: ServiceContentStrategy
): ContentRecommendation | null {
  const titleTemplates = {
    tutorial: [
      `Complete ${service.name.en} Tutorial: Step-by-Step Guide`,
      `How to Get Started with ${service.name.en}`,
      `${service.name.en} Tutorial: From Beginner to Expert`
    ],
    'case-study': [
      `${service.name.en} Success Story: Real Project Implementation`,
      `Case Study: How We Built a ${service.name.en} Solution`,
      `Real-World ${service.name.en} Implementation: Lessons Learned`
    ],
    opinion: [
      `The Future of ${service.name.en}: Industry Perspective`,
      `Why ${service.name.en} is Critical for Your Business`,
      `${service.name.en} Trends and Predictions for 2024`
    ],
    blog: [
      `Understanding ${service.name.en}: A Comprehensive Guide`,
      `${service.name.en} Best Practices and Common Pitfalls`,
      `Getting the Most Out of ${service.name.en}`
    ],
    news: [
      `Latest Developments in ${service.name.en}`,
      `${service.name.en} Industry Updates and Insights`,
      `Breaking: New Innovations in ${service.name.en}`
    ]
  }
  
  const templates = titleTemplates[contentType as keyof typeof titleTemplates]
  if (!templates) return null
  
  const suggestedTitle = templates[0] // Use first template
  const targetKeywords = strategy.keywords.slice(0, 3)
  
  return {
    serviceId: service.serviceId,
    contentType,
    suggestedTitle,
    targetKeywords,
    difficulty: 'Intermediate',
    estimatedImpact: 'high',
    reasoning: `Missing ${contentType} content for ${service.name.en} service`
  }
}

/**
 * Generate keyword-based content recommendation
 */
function generateKeywordRecommendation(
  service: Service,
  keyword: string,
  strategy: ServiceContentStrategy
): ContentRecommendation {
  const capitalizedKeyword = keyword.charAt(0).toUpperCase() + keyword.slice(1)
  
  return {
    serviceId: service.serviceId,
    contentType: 'blog',
    suggestedTitle: `Mastering ${capitalizedKeyword}: A Comprehensive Guide`,
    targetKeywords: [keyword, ...strategy.keywords.slice(0, 2)],
    difficulty: 'Intermediate',
    estimatedImpact: 'medium',
    reasoning: `High-value keyword "${keyword}" not covered in existing content`
  }
}

/**
 * Get service recommendations for a specific blog post
 */
export function getServiceRecommendationsForPost(post: BlogPostMetadata): ServiceCTA[] {
  const recommendations: ServiceCTA[] = []
  const services = serviceRegistry.getServiceCategories().flatMap(cat => cat.services)
  
  // Find services that match post content
  services.forEach(service => {
    const strategy = serviceContentStrategies[service.serviceId]
    if (!strategy) return
    
    // Calculate relevance score
    let relevanceScore = 0
    
    // Check content type match
    if (strategy.contentTypes.includes(post.type || 'blog')) {
      relevanceScore += 3
    }
    
    // Check keyword matches
    const postText = `${post.title} ${post.description} ${post.tags.join(' ')}`.toLowerCase()
    const keywordMatches = strategy.keywords.filter(keyword =>
      postText.includes(keyword.toLowerCase())
    ).length
    relevanceScore += keywordMatches * 2
    
    // Check if already targeted
    if (post.targetedServices?.includes(service.serviceId) || post.primaryService === service.serviceId) {
      relevanceScore += 5
    }
    
    // Create recommendation if relevant
    if (relevanceScore > 2) {
      const ctaText = generateCTAText(service, post.type || 'blog', strategy.ctaStrategies[0])
      const ctaUrl = `/services#${service.serviceId}`
      
      recommendations.push({
        id: `rec-${post.slug}-${service.serviceId}`,
        serviceId: service.serviceId,
        service,
        ctaText,
        ctaUrl,
        priority: relevanceScore > 5 ? 1 : 2,
        placement: relevanceScore > 5 ? 'sidebar' : 'footer',
        trackingId: `post_${post.slug}_service_${service.serviceId}`
      })
    }
  })
  
  return recommendations
    .sort((a, b) => b.priority - a.priority)
    .slice(0, 3) // Limit to top 3 recommendations
}

/**
 * Generate contextual CTA text based on service and content
 */
function generateCTAText(service: Service, contentType: string, ctaStrategy: string): string {
  const serviceName = service.name.en
  
  const templates = {
    consultation_booking: [
      `Book ${serviceName} Consultation`,
      `Get Expert ${serviceName} Advice`,
      `Schedule ${serviceName} Strategy Call`
    ],
    service_inquiry: [
      `Learn About ${serviceName}`,
      `Explore ${serviceName} Options`,
      `Get ${serviceName} Information`
    ],
    project_inquiry: [
      `Start ${serviceName} Project`,
      `Begin Your ${serviceName} Journey`,
      `Launch ${serviceName} Initiative`
    ]
  }
  
  const ctaTemplates = templates[ctaStrategy as keyof typeof templates] || templates.service_inquiry
  return ctaTemplates[0]
}

/**
 * Export all strategies for external use
 */
export function getAllServiceContentStrategies(): Record<string, ServiceContentStrategy> {
  return serviceContentStrategies
}

/**
 * Get strategy for specific service
 */
export function getServiceContentStrategy(serviceId: string): ServiceContentStrategy | undefined {
  return serviceContentStrategies[serviceId]
}