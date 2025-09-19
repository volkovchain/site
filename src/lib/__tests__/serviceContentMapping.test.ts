import { describe, it, expect } from 'vitest'
import { 
  getContentAnalytics,
  getServiceRecommendationsForPost,
  getAllServiceContentStrategies
} from '@/lib/serviceContentMapping'
import type { BlogPostMetadata } from '@/lib/blog'

describe('Service Content Mapping', () => {
  const mockPost: BlogPostMetadata = {
    slug: 'test-post',
    title: 'Rust Blockchain Development',
    description: 'Learn blockchain development with Rust',
    publishedAt: '2024-01-15',
    author: 'Test Author',
    category: 'Education',
    tags: ['rust', 'blockchain'],
    readingTime: '5 min read',
    featured: false,
    type: 'tutorial',
    difficulty: 'Beginner'
  }

  it('should return all service content strategies', () => {
    const strategies = getAllServiceContentStrategies()
    
    expect(strategies).toBeDefined()
    expect(Object.keys(strategies)).toContain('rust-blockchain-course')
    expect(Object.keys(strategies)).toContain('solidity-masterclass')
  })

  it('should generate service recommendations for a post', () => {
    const recommendations = getServiceRecommendationsForPost(mockPost)
    
    expect(recommendations).toBeInstanceOf(Array)
    expect(recommendations.length).toBeGreaterThanOrEqual(0)
    
    if (recommendations.length > 0) {
      expect(recommendations[0]).toMatchObject({
        id: expect.any(String),
        serviceId: expect.any(String),
        ctaText: expect.any(String),
        ctaUrl: expect.any(String),
        priority: expect.any(Number)
      })
    }
  })

  it('should calculate content analytics', () => {
    const analytics = getContentAnalytics()
    
    expect(analytics).toMatchObject({
      totalPosts: expect.any(Number),
      postsPerService: expect.any(Object),
      contentTypeDistribution: expect.any(Object),
      difficultyDistribution: expect.any(Object),
      serviceEngagement: expect.any(Array),
      contentGaps: expect.any(Array),
      recommendedContent: expect.any(Array)
    })
  })
})