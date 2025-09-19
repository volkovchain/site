import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'

export interface ConversionTrackingRequest {
  postId: string
  serviceId: string
  conversionType: 'cta_click' | 'service_view' | 'inquiry_submitted'
  source: 'inline' | 'sidebar' | 'footer' | 'header'
  userAgent?: string
  referrer?: string
  timestamp?: Date
}

export interface ConversionEvent {
  id: string
  postId: string
  serviceId: string
  conversionType: string
  source: string
  timestamp: Date
  userAgent?: string
  referrer?: string
  sessionId?: string
  conversionValue?: number
}

export async function POST(request: NextRequest) {
  try {
    const data: ConversionTrackingRequest = await request.json()
    
    // Validate required fields
    if (!data.postId || !data.serviceId || !data.conversionType || !data.source) {
      return NextResponse.json(
        { error: 'Missing required fields: postId, serviceId, conversionType, source' },
        { status: 400 }
      )
    }

    // Get client information
    const userAgent = request.headers.get('user-agent') || ''
    const referrer = request.headers.get('referer') || ''
    const clientIP = request.headers.get('x-forwarded-for') || request.headers.get('x-real-ip') || ''
    
    // Create conversion event
    const conversionEvent: ConversionEvent = {
      id: generateEventId(),
      postId: data.postId,
      serviceId: data.serviceId,
      conversionType: data.conversionType,
      source: data.source,
      timestamp: new Date(),
      userAgent,
      referrer,
      sessionId: generateSessionId(clientIP, userAgent),
      conversionValue: estimateConversionValue(data.conversionType, data.serviceId)
    }

    // Store in database
    const { db } = await connectToDatabase()
    await db.collection('blog_conversions').insertOne(conversionEvent)

    // Update post analytics
    await updatePostAnalytics(db, data.postId, data.conversionType)

    // Update service analytics
    await updateServiceAnalytics(db, data.serviceId, data.conversionType)

    return NextResponse.json({ 
      success: true, 
      eventId: conversionEvent.id,
      message: 'Conversion tracked successfully'
    })
  } catch (error) {
    console.error('Error tracking conversion:', error)
    return NextResponse.json(
      { error: 'Failed to track conversion' },
      { status: 500 }
    )
  }
}

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const postId = searchParams.get('postId')
    const serviceId = searchParams.get('serviceId')
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')

    const { db } = await connectToDatabase()
    
    // Build query
    const query: any = {}
    if (postId) query.postId = postId
    if (serviceId) query.serviceId = serviceId
    if (startDate || endDate) {
      query.timestamp = {}
      if (startDate) query.timestamp.$gte = new Date(startDate)
      if (endDate) query.timestamp.$lte = new Date(endDate)
    }

    // Get conversion events
    const events = await db.collection('blog_conversions')
      .find(query)
      .sort({ timestamp: -1 })
      .limit(100)
      .toArray()

    // Calculate summary statistics
    const summary = {
      totalEvents: events.length,
      conversionTypes: getConversionTypeBreakdown(events),
      sourceBreakdown: getSourceBreakdown(events),
      totalValue: events.reduce((sum, event) => sum + (event.conversionValue || 0), 0)
    }

    return NextResponse.json({
      events: events.map(event => ({
        ...event,
        id: event._id.toString()
      })),
      summary
    })
  } catch (error) {
    console.error('Error fetching conversion data:', error)
    return NextResponse.json(
      { error: 'Failed to fetch conversion data' },
      { status: 500 }
    )
  }
}

function generateEventId(): string {
  return `conv_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`
}

function generateSessionId(ip: string, userAgent: string): string {
  const hash = Buffer.from(`${ip}_${userAgent}_${new Date().toDateString()}`).toString('base64')
  return hash.substring(0, 16)
}

function estimateConversionValue(conversionType: string, serviceId: string): number {
  const baseValues = {
    'cta_click': 5,
    'service_view': 15,
    'inquiry_submitted': 100
  }
  
  const serviceMultipliers: Record<string, number> = {
    'custom-blockchain-dev': 10,
    'defi-protocol-dev': 8,
    'smart-contract-audit': 3,
    'rust-blockchain-course': 2,
    'solidity-masterclass': 2,
    'basic-consultation': 1,
    'technical-blog-writing': 1.5
  }
  
  const baseValue = baseValues[conversionType as keyof typeof baseValues] || 1
  const multiplier = serviceMultipliers[serviceId] || 1
  
  return baseValue * multiplier
}

async function updatePostAnalytics(db: any, postId: string, conversionType: string) {
  const updateQuery = {
    $inc: {
      [`conversions.${conversionType}`]: 1,
      'conversions.total': 1
    },
    $set: {
      lastConversion: new Date()
    }
  }
  
  await db.collection('post_analytics').updateOne(
    { postId },
    updateQuery,
    { upsert: true }
  )
}

async function updateServiceAnalytics(db: any, serviceId: string, conversionType: string) {
  const updateQuery = {
    $inc: {
      [`conversions.${conversionType}`]: 1,
      'conversions.total': 1
    },
    $set: {
      lastConversion: new Date()
    }
  }
  
  await db.collection('service_analytics').updateOne(
    { serviceId },
    updateQuery,
    { upsert: true }
  )
}

function getConversionTypeBreakdown(events: ConversionEvent[]) {
  const breakdown: Record<string, number> = {}
  events.forEach(event => {
    breakdown[event.conversionType] = (breakdown[event.conversionType] || 0) + 1
  })
  return breakdown
}

function getSourceBreakdown(events: ConversionEvent[]) {
  const breakdown: Record<string, number> = {}
  events.forEach(event => {
    breakdown[event.source] = (breakdown[event.source] || 0) + 1
  })
  return breakdown
}