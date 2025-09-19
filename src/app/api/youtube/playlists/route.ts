import { NextRequest, NextResponse } from 'next/server'
import { getVideoPlaylists } from '@/lib/youtube'

export async function GET(request: NextRequest) {
  try {
    const playlists = await getVideoPlaylists()
    
    return NextResponse.json(playlists)
  } catch (error) {
    console.error('YouTube playlists API error:', error)
    return NextResponse.json(
      { error: 'Failed to fetch playlists' },
      { status: 500 }
    )
  }
}