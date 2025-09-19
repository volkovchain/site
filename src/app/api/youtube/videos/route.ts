import { NextRequest, NextResponse } from 'next/server'
import { getChannelVideos } from '@/lib/youtube'

export async function GET(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url)
    const maxResults = parseInt(searchParams.get('maxResults') || '20')
    
    const videos = await getChannelVideos(maxResults)
    
    return NextResponse.json(videos)
  } catch (error) {
    console.error('YouTube API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch videos' },
      { status: 500 }
    )
  }
}