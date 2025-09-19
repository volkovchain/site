import { NextRequest, NextResponse } from 'next/server'

export async function POST(request: NextRequest) {
  try {
    const errorData = await request.json()
    
    // Log errors for monitoring
    console.error('Client Error:', {
      message: errorData.message,
      stack: errorData.stack,
      context: errorData.context,
      url: errorData.url,
      userAgent: errorData.userAgent,
      timestamp: errorData.timestamp
    })

    // In production, you might want to:
    // 1. Store errors in a database
    // 2. Send to error tracking service (Sentry, Bugsnag, etc.)
    // 3. Alert on critical errors
    // 4. Group similar errors

    // Example: Send to external error tracking service
    if (process.env.ERROR_TRACKING_WEBHOOK_URL) {
      await fetch(process.env.ERROR_TRACKING_WEBHOOK_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...errorData,
          environment: process.env.NODE_ENV,
          version: process.env.npm_package_version
        })
      }).catch(console.error)
    }

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Error processing error report:', error)
    return NextResponse.json(
      { error: 'Failed to process error report' },
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