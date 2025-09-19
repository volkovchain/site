import { NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'

export async function GET() {
  try {
    // Check database connection
    await connectToDatabase()
    
    return NextResponse.json({
      status: 'healthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      services: {
        database: 'connected',
        nextjs: 'running'
      }
    })
  } catch (error) {
    return NextResponse.json({
      status: 'unhealthy',
      timestamp: new Date().toISOString(),
      environment: process.env.NODE_ENV,
      error: error instanceof Error ? error.message : 'Unknown error',
      services: {
        database: 'disconnected',
        nextjs: 'running'
      }
    }, { status: 503 })
  }
}