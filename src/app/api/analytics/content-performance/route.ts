import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { getAllPosts } from '@/lib/blog'
import { serviceRegistry } from '@/lib/serviceRegistry'
import { getContentAnalytics } from '@/lib/serviceContentMapping'

export interface PostConversionData {
  postId: string
  postTitle: string
  views: number
  conversions: number
  conversionRate: number
  revenueAttribution: number
  topConvertingService: string
}

export interface ServiceEngagementData {
  serviceId: string
  serviceName: string
  totalPosts: number
  totalConversions: number
  averageConversionRate: number
  revenueAttribution: number
}

export interface ConversionFunnelData {
  stage: string
  count: number
  conversionRate: number
}

export interface RevenueAttributionData {
  period: string
  totalRevenue: number
  blogAttribution: number
  attributionPercentage: number
}

export interface ContentPerformanceResponse {
  topConvertingPosts: PostConversionData[]
  serviceEngagement: ServiceEngagementData[]
  conversionFunnels: ConversionFunnelData[]
  revenueAttribution: RevenueAttributionData[]
  contentAnalytics: any
  summary: {
    totalPosts: number
    totalConversions: number
    averageConversionRate: number
    totalRevenueAttribution: number
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate') 
    const limit = parseInt(searchParams.get('limit') || '10')

    const { db } = await connectToDatabase()
    
    // Get all posts for reference
    const allPosts = getAllPosts()
    const services = serviceRegistry.getServiceCategories().flatMap(cat => cat.services)

    // Build date filter
    const dateFilter: any = {}
    if (startDate || endDate) {
      dateFilter.timestamp = {}
      if (startDate) dateFilter.timestamp.$gte = new Date(startDate)
      if (endDate) dateFilter.timestamp.$lte = new Date(endDate)
    }

    // Get conversion data
    const conversions = await db.collection('blog_conversions')
      .find(dateFilter)
      .toArray()

    // Get post analytics
    const postAnalytics = await db.collection('post_analytics')
      .find({})
      .toArray()

    // Get service analytics
    const serviceAnalytics = await db.collection('service_analytics')
      .find({})
      .toArray()

    // Calculate top converting posts
    const topConvertingPosts = calculateTopConvertingPosts(
      allPosts, 
      conversions, 
      postAnalytics, 
      limit
    )

    // Calculate service engagement
    const serviceEngagement = calculateServiceEngagement(
      services,
      conversions,
      serviceAnalytics,
      allPosts
    )

    // Calculate conversion funnels
    const conversionFunnels = calculateConversionFunnels(conversions)

    // Calculate revenue attribution
    const revenueAttribution = calculateRevenueAttribution(conversions, startDate, endDate)

    // Get content analytics
    const contentAnalytics = getContentAnalytics()

    // Calculate summary
    const summary = {
      totalPosts: allPosts.length,
      totalConversions: conversions.length,
      averageConversionRate: calculateAverageConversionRate(conversions, postAnalytics),
      totalRevenueAttribution: conversions.reduce((sum, conv) => sum + (conv.conversionValue || 0), 0)
    }

    const response: ContentPerformanceResponse = {
      topConvertingPosts,
      serviceEngagement,
      conversionFunnels,
      revenueAttribution,
      contentAnalytics,
      summary
    }

    return NextResponse.json(response)
  } catch (error) {
    console.error('Error fetching content performance:', error)
    return NextResponse.json(
      { error: 'Failed to fetch content performance data' },
      { status: 500 }
    )
  }
}

function calculateTopConvertingPosts(
  allPosts: any[],
  conversions: any[],
  postAnalytics: any[],
  limit: number
): PostConversionData[] {
  const postPerformance = new Map<string, PostConversionData>()

  // Initialize with all posts
  allPosts.forEach(post => {
    postPerformance.set(post.slug, {
      postId: post.slug,
      postTitle: post.title,
      views: 0,
      conversions: 0,
      conversionRate: 0,
      revenueAttribution: 0,
      topConvertingService: ''
    })
  })

  // Add analytics data
  postAnalytics.forEach(analytics => {
    if (postPerformance.has(analytics.postId)) {
      const data = postPerformance.get(analytics.postId)!
      data.views = analytics.views || 0
    }
  })

  // Add conversion data
  const postConversions = new Map<string, any[]>()
  conversions.forEach(conversion => {
    if (!postConversions.has(conversion.postId)) {
      postConversions.set(conversion.postId, [])
    }
    postConversions.get(conversion.postId)!.push(conversion)
  })

  // Calculate metrics
  postConversions.forEach((conversionList, postId) => {
    if (postPerformance.has(postId)) {
      const data = postPerformance.get(postId)!
      data.conversions = conversionList.length
      data.revenueAttribution = conversionList.reduce((sum, conv) => sum + (conv.conversionValue || 0), 0)
      
      // Calculate conversion rate
      if (data.views > 0) {
        data.conversionRate = (data.conversions / data.views) * 100
      }

      // Find top converting service
      const serviceConversions = new Map<string, number>()
      conversionList.forEach(conv => {
        serviceConversions.set(conv.serviceId, (serviceConversions.get(conv.serviceId) || 0) + 1)
      })
      
      if (serviceConversions.size > 0) {
        const topService = Array.from(serviceConversions.entries())
          .sort((a, b) => b[1] - a[1])[0][0]
        data.topConvertingService = topService
      }
    }
  })

  return Array.from(postPerformance.values())
    .sort((a, b) => b.conversionRate - a.conversionRate)
    .slice(0, limit)
}

function calculateServiceEngagement(
  services: any[],
  conversions: any[],
  serviceAnalytics: any[],
  allPosts: any[]
): ServiceEngagementData[] {
  const serviceData = new Map<string, ServiceEngagementData>()

  // Initialize with all services
  services.forEach(service => {
    serviceData.set(service.serviceId, {
      serviceId: service.serviceId,
      serviceName: service.name.en,
      totalPosts: 0,
      totalConversions: 0,
      averageConversionRate: 0,
      revenueAttribution: 0
    })
  })

  // Count posts per service
  allPosts.forEach(post => {
    const relatedServices = [
      ...(post.targetedServices || []),
      ...(post.primaryService ? [post.primaryService] : [])
    ]
    
    relatedServices.forEach(serviceId => {
      if (serviceData.has(serviceId)) {
        serviceData.get(serviceId)!.totalPosts++
      }
    })
  })

  // Add conversion data
  const serviceConversions = new Map<string, any[]>()
  conversions.forEach(conversion => {
    if (!serviceConversions.has(conversion.serviceId)) {
      serviceConversions.set(conversion.serviceId, [])
    }
    serviceConversions.get(conversion.serviceId)!.push(conversion)
  })

  // Calculate metrics
  serviceConversions.forEach((conversionList, serviceId) => {
    if (serviceData.has(serviceId)) {
      const data = serviceData.get(serviceId)!
      data.totalConversions = conversionList.length
      data.revenueAttribution = conversionList.reduce((sum, conv) => sum + (conv.conversionValue || 0), 0)
      
      // Calculate average conversion rate (simplified)
      if (data.totalPosts > 0) {
        data.averageConversionRate = (data.totalConversions / (data.totalPosts * 100)) * 100 // Assume 100 avg views per post
      }
    }
  })

  return Array.from(serviceData.values())
    .sort((a, b) => b.totalConversions - a.totalConversions)
}

function calculateConversionFunnels(conversions: any[]): ConversionFunnelData[] {
  const funnelStages = ['cta_click', 'service_view', 'inquiry_submitted']
  const stageCounts = new Map<string, number>()

  // Count conversions by type
  conversions.forEach(conversion => {
    stageCounts.set(
      conversion.conversionType,
      (stageCounts.get(conversion.conversionType) || 0) + 1
    )
  })

  const totalConversions = conversions.length
  
  return funnelStages.map((stage, index) => {
    const count = stageCounts.get(stage) || 0
    const conversionRate = totalConversions > 0 ? (count / totalConversions) * 100 : 0
    
    return {
      stage: stage.replace('_', ' ').replace(/\b\w/g, l => l.toUpperCase()),
      count,
      conversionRate
    }
  })
}

function calculateRevenueAttribution(
  conversions: any[],
  startDate?: string | null,
  endDate?: string | null
): RevenueAttributionData[] {
  // Group conversions by month
  const monthlyData = new Map<string, number>()
  
  conversions.forEach(conversion => {
    const date = new Date(conversion.timestamp)
    const monthKey = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`
    
    monthlyData.set(
      monthKey,
      (monthlyData.get(monthKey) || 0) + (conversion.conversionValue || 0)
    )
  })

  return Array.from(monthlyData.entries()).map(([period, blogAttribution]) => ({
    period,
    totalRevenue: blogAttribution * 5, // Assume blog contributes 20% of total revenue
    blogAttribution,
    attributionPercentage: 20
  })).sort((a, b) => a.period.localeCompare(b.period))
}

function calculateAverageConversionRate(conversions: any[], postAnalytics: any[]): number {
  const totalViews = postAnalytics.reduce((sum, analytics) => sum + (analytics.views || 0), 0)
  const totalConversions = conversions.length
  
  return totalViews > 0 ? (totalConversions / totalViews) * 100 : 0
}