import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const metrics = await request.json()
    
    // Log web vitals for monitoring
    console.log('Web Vitals:', {
      name: metrics.name,
      value: metrics.value,
      id: metrics.id,
      url: request.nextUrl.pathname,
      timestamp: new Date().toISOString()
    })

    // In production, you might want to:
    // 1. Store metrics in a database
    // 2. Send to analytics service (DataDog, New Relic, etc.)
    // 3. Alert on poor performance

    // Example: Send to external analytics service
    if (process.env.ANALYTICS_WEBHOOK_URL) {
      await fetch(process.env.ANALYTICS_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...metrics,
          url: request.nextUrl.pathname,
          userAgent: request.headers.get('user-agent'),
          timestamp: new Date().toISOString()
        })
      }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing web vitals:', error)
    return NextResponse.json(
      { error: 'Failed to process metrics' },
      { status: 500 }
    )
  }
}

export async function GET() {
  return NextResponse.json(
    { error: 'Method not allowed' },
    { status: 405 }
  )
}