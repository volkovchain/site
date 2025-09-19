import { NextRequest, NextResponse } from 'next/server'
import { 
  getAllPosts, 
  getPostsByCategory, 
  getPostsByService, 
  getPostsByType,
  getPostsByDifficulty,
  searchPostsWithServices,
  paginatePosts 
} from '@/lib/blog'
import { serviceRegistry } from '@/lib/serviceRegistry'
import type { BlogPostMetadata } from '@/lib/blog'

export interface BlogListRequest {
  page?: number
  limit?: number
  category?: string
  serviceId?: string
  type?: 'blog' | 'news' | 'tutorial' | 'case-study' | 'opinion'
  difficulty?: 'Beginner' | 'Intermediate' | 'Advanced'
  search?: string
  featured?: boolean
}

export interface ServiceEngagementStats {
  serviceId: string
  relatedPostsCount: number
  averageReadingTime: number
  totalViews: number
}

export interface BlogListResponse {
  posts: BlogPostMetadata[]
  pagination: {
    currentPage: number
    totalPages: number
    totalPosts: number
    hasNextPage: boolean
    hasPrevPage: boolean
  }
  serviceStats: ServiceEngagementStats[]
  availableFilters: {
    categories: string[]
    services: Array<{ id: string; name: string }>
    contentTypes: string[]
    difficultyLevels: string[]
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const page = parseInt(searchParams.get('page') || '1')
    const limit = parseInt(searchParams.get('limit') || '10')
    const category = searchParams.get('category')
    const serviceId = searchParams.get('serviceId')
    const type = searchParams.get('type') as BlogListRequest['type']
    const difficulty = searchParams.get('difficulty') as BlogListRequest['difficulty']
    const search = searchParams.get('search')
    const featured = searchParams.get('featured') === 'true'

    let posts: BlogPostMetadata[] = []

    // Apply filters
    if (search) {
      posts = searchPostsWithServices(search)
    } else if (serviceId) {
      posts = getPostsByService(serviceId)
    } else if (category) {
      posts = getPostsByCategory(category)
    } else if (type) {
      posts = getPostsByType(type)
    } else if (difficulty) {
      posts = getPostsByDifficulty(difficulty)
    } else {
      posts = getAllPosts()
    }

    // Filter by featured if requested
    if (featured) {
      posts = posts.filter(post => post.featured)
    }

    // Apply additional filters if needed
    if (type && !search && !serviceId) {
      posts = posts.filter(post => post.type === type)
    }
    
    if (difficulty && !search && !serviceId) {
      posts = posts.filter(post => post.difficulty === difficulty)
    }

    // Paginate results
    const paginationData = paginatePosts(posts, page, limit)

    // Generate service engagement stats
    const serviceStats: ServiceEngagementStats[] = generateServiceStats(posts)

    // Get available filter options
    const availableFilters = {
      categories: getUniqueCategories(getAllPosts()),
      services: getAvailableServices(),
      contentTypes: ['blog', 'news', 'tutorial', 'case-study', 'opinion'],
      difficultyLevels: ['Beginner', 'Intermediate', 'Advanced']
    }

    const response: BlogListResponse = {
      posts: paginationData.posts,
      pagination: {
        currentPage: paginationData.currentPage,
        totalPages: paginationData.totalPages,
        totalPosts: posts.length,
        hasNextPage: paginationData.hasNextPage,
        hasPrevPage: paginationData.hasPrevPage
      },
      serviceStats,
      availableFilters
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error in blog API:', error)
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    )
  }
}

function generateServiceStats(posts: BlogPostMetadata[]): ServiceEngagementStats[] {
  const serviceMap = new Map<string, ServiceEngagementStats>()
  
  posts.forEach(post => {
    const services = [
      ...(post.targetedServices || []),
      ...(post.primaryService ? [post.primaryService] : [])
    ]
    
    services.forEach(serviceId => {
      if (!serviceMap.has(serviceId)) {
        serviceMap.set(serviceId, {
          serviceId,
          relatedPostsCount: 0,
          averageReadingTime: 0,
          totalViews: 0
        })
      }
      
      const stats = serviceMap.get(serviceId)!
      stats.relatedPostsCount += 1
      stats.totalViews += 0 // Will be implemented with actual view tracking
      
      // Calculate average reading time (simplified)
      const readingMinutes = parseInt(post.readingTime.replace(/\D/g, '')) || 5
      stats.averageReadingTime = (stats.averageReadingTime + readingMinutes) / stats.relatedPostsCount
    })
  })
  
  return Array.from(serviceMap.values())
}

function getUniqueCategories(posts: BlogPostMetadata[]): string[] {
  const categories = posts.map(post => post.category)
  return Array.from(new Set(categories))
}

function getAvailableServices(): Array<{ id: string; name: string }> {
  const allServices = serviceRegistry.getServiceCategories()
    .flatMap(category => category.services)
  
  return allServices.map(service => ({
    id: service.serviceId,
    name: service.name.en
  }))
}