import { NextRequest, NextResponse } from 'next/server'
import { serviceRegistry } from '@/lib/serviceRegistry'

/**
 * GET /api/services
 * Get all services with optional filtering
 */
export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    
    // Parse query parameters
    const category = searchParams.get('category')
    const search = searchParams.get('search')
    const language = (searchParams.get('language') as 'ru' | 'en') || 'en'
    const complexity = searchParams.get('complexity')
    const popular = searchParams.get('popular') === 'true'
    const minPrice = searchParams.get('minPrice')
    const maxPrice = searchParams.get('maxPrice')
    const tags = searchParams.get('tags')?.split(',').filter(Boolean) || []
    
    let services = serviceRegistry.getServiceCategories()
    
    // If specific category requested
    if (category) {
      const categoryServices = serviceRegistry.getServicesByCategory(category)
      return NextResponse.json({
        success: true,
        category,
        services: categoryServices,
        total: categoryServices.length
      })
    }
    
    // If search query provided
    if (search) {
      const searchResults = serviceRegistry.searchServices(search, language)
      return NextResponse.json({
        success: true,
        search,
        services: searchResults,
        total: searchResults.length
      })
    }
    
    // If popular services requested
    if (popular) {
      const popularServices = serviceRegistry.getPopularServices()
      return NextResponse.json({
        success: true,
        services: popularServices,
        total: popularServices.length
      })
    }
    
    // Apply filters
    const filters = {
      categories: category ? [category] : [],
      complexity: complexity ? [complexity] : [],
      priceRange: {
        min: minPrice ? parseInt(minPrice) : 0,
        max: maxPrice ? parseInt(maxPrice) : 0
      },
      tags
    }
    
    const filteredServices = serviceRegistry.filterServices(filters)
    
    // Return full catalog with categories
    return NextResponse.json({
      success: true,
      categories: services,
      services: filteredServices,
      total: filteredServices.length,
      filters: filters
    })
    
  } catch (error) {
    console.error('Services API error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to fetch services',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * POST /api/services
 * Add new service (admin only - future implementation)
 */
export async function POST(request: NextRequest) {
  // TODO: Implement service creation for admin panel
  return NextResponse.json(
    { error: 'Service creation not implemented', success: false },
    { status: 501 }
  )
}