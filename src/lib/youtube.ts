import type { YouTubeVideo, VideoPlaylist } from '@/types'

const YOUTUBE_API_KEY = process.env.YOUTUBE_API_KEY
const YOUTUBE_CHANNEL_ID = process.env.YOUTUBE_CHANNEL_ID || 'UCxYr6HKCyh_YrPUlmJJH_UA' // Example channel

// Mock data for development when API key is not available
const mockVideos: YouTubeVideo[] = [
  {
    id: 'dQw4w9WgXcQ',
    title: 'Введение в Rust для блокчейн-разработки',
    description: 'Основы языка Rust для создания высокопроизводительных блокчейн-приложений',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    publishedAt: '2024-01-15T10:00:00Z',
    duration: 'PT15M30S',
    viewCount: 12500,
    likeCount: 890,
    playlistId: 'rust-blockchain'
  },
  {
    id: 'jNQXAC9IVRw',
    title: 'Solidity Smart Contracts: Best Practices',
    description: 'Лучшие практики разработки смарт-контрактов на Solidity',
    thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    publishedAt: '2024-01-20T14:30:00Z',
    duration: 'PT22M45S',
    viewCount: 8750,
    likeCount: 654,
    playlistId: 'solidity-tutorial'
  },
  {
    id: 'M7lc1UVf-VE',
    title: 'DeFi Architecture: От идеи до реализации',
    description: 'Полный цикл разработки DeFi протокола: архитектура, безопасность, аудит',
    thumbnailUrl: 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg',
    publishedAt: '2024-02-01T16:15:00Z',
    duration: 'PT35M12S',
    viewCount: 15600,
    likeCount: 1230,
    playlistId: 'defi-development'
  },
  {
    id: 'gCWVlDmOB-o',
    title: 'Go для блокчейн: Building Backend Services',
    description: 'Создание бэкенд сервисов для блокчейн приложений на Go',
    thumbnailUrl: 'https://i.ytimg.com/vi/gCWVlDmOB-o/maxresdefault.jpg',
    publishedAt: '2024-02-10T12:00:00Z',
    duration: 'PT28M20S',
    viewCount: 9800,
    likeCount: 745,
    playlistId: 'golang-blockchain'
  }
]

const mockPlaylists: VideoPlaylist[] = [
  {
    id: 'rust-blockchain',
    title: 'Rust для блокчейна',
    description: 'Изучаем Rust для разработки высокопроизводительных блокчейн-приложений',
    thumbnailUrl: 'https://i.ytimg.com/vi/dQw4w9WgXcQ/maxresdefault.jpg',
    videoCount: 12,
    videos: mockVideos.filter(v => v.playlistId === 'rust-blockchain')
  },
  {
    id: 'solidity-tutorial',
    title: 'Solidity Tutorial',
    description: 'Полный курс по разработке смарт-контрактов на Solidity',
    thumbnailUrl: 'https://i.ytimg.com/vi/jNQXAC9IVRw/maxresdefault.jpg',
    videoCount: 18,
    videos: mockVideos.filter(v => v.playlistId === 'solidity-tutorial')
  },
  {
    id: 'defi-development',
    title: 'DeFi Разработка',
    description: 'Создание DeFi протоколов от концепции до production',
    thumbnailUrl: 'https://i.ytimg.com/vi/M7lc1UVf-VE/maxresdefault.jpg',
    videoCount: 8,
    videos: mockVideos.filter(v => v.playlistId === 'defi-development')
  },
  {
    id: 'golang-blockchain',
    title: 'Go + Blockchain',
    description: 'Backend разработка для блокчейн приложений на Go',
    thumbnailUrl: 'https://i.ytimg.com/vi/gCWVlDmOB-o/maxresdefault.jpg',
    videoCount: 10,
    videos: mockVideos.filter(v => v.playlistId === 'golang-blockchain')
  }
]

export async function getChannelVideos(maxResults: number = 20): Promise<YouTubeVideo[]> {
  // Return mock data if no API key
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not found, using mock data')
    return mockVideos
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/search?` +
      `key=${YOUTUBE_API_KEY}&` +
      `channelId=${YOUTUBE_CHANNEL_ID}&` +
      `part=snippet&` +
      `order=date&` +
      `maxResults=${maxResults}&` +
      `type=video`
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.items.map((item: any) => ({
      id: item.id.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      duration: 'PT0S', // Would need additional API call to get duration
      viewCount: 0, // Would need additional API call to get view count
      likeCount: 0
    }))
  } catch (error) {
    console.error('Error fetching YouTube videos:', error)
    return mockVideos
  }
}

export async function getVideoPlaylists(): Promise<VideoPlaylist[]> {
  // Return mock data if no API key
  if (!YOUTUBE_API_KEY) {
    console.warn('YouTube API key not found, using mock data')
    return mockPlaylists
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlists?` +
      `key=${YOUTUBE_API_KEY}&` +
      `channelId=${YOUTUBE_CHANNEL_ID}&` +
      `part=snippet,contentDetails&` +
      `maxResults=50`
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.items.map((item: any) => ({
      id: item.id,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      videoCount: item.contentDetails.itemCount,
      videos: [] // Would need additional API call to get videos
    }))
  } catch (error) {
    console.error('Error fetching YouTube playlists:', error)
    return mockPlaylists
  }
}

export async function getPlaylistVideos(playlistId: string): Promise<YouTubeVideo[]> {
  // Return mock data if no API key
  if (!YOUTUBE_API_KEY) {
    return mockVideos.filter(v => v.playlistId === playlistId)
  }

  try {
    const response = await fetch(
      `https://www.googleapis.com/youtube/v3/playlistItems?` +
      `key=${YOUTUBE_API_KEY}&` +
      `playlistId=${playlistId}&` +
      `part=snippet&` +
      `maxResults=50`
    )

    if (!response.ok) {
      throw new Error(`YouTube API error: ${response.status}`)
    }

    const data = await response.json()
    
    return data.items.map((item: any) => ({
      id: item.snippet.resourceId.videoId,
      title: item.snippet.title,
      description: item.snippet.description,
      thumbnailUrl: item.snippet.thumbnails.high?.url || item.snippet.thumbnails.default.url,
      publishedAt: item.snippet.publishedAt,
      duration: 'PT0S',
      viewCount: 0,
      likeCount: 0,
      playlistId
    }))
  } catch (error) {
    console.error('Error fetching playlist videos:', error)
    return mockVideos.filter(v => v.playlistId === playlistId)
  }
}

// Utility function to format duration
export function formatDuration(duration: string): string {
  const match = duration.match(/PT(\\d+H)?(\\d+M)?(\\d+S)?/)
  if (!match) return '0:00'
  
  const hours = (match[1] || '').replace('H', '')
  const minutes = (match[2] || '').replace('M', '')
  const seconds = (match[3] || '').replace('S', '')
  
  if (hours) {
    return `${hours}:${minutes.padStart(2, '0')}:${seconds.padStart(2, '0')}`
  }
  
  return `${minutes || '0'}:${seconds.padStart(2, '0')}`
}

// Utility function to format view count
export function formatViewCount(count: number): string {
  if (count >= 1000000) {
    return `${(count / 1000000).toFixed(1)}M просмотров`
  }
  if (count >= 1000) {
    return `${(count / 1000).toFixed(1)}K просмотров`
  }
  return `${count} просмотров`
}