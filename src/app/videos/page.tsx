'use client'

import React, { useState, useEffect } from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { VideoCard } from '@/components/videos/VideoCard'
import { PlaylistCard } from '@/components/videos/PlaylistCard'
import { Button } from '@/components/ui/Button'
import { Input } from '@/components/ui/Input'
import { getChannelVideos, getVideoPlaylists } from '@/lib/youtube'
import type { YouTubeVideo, VideoPlaylist } from '@/types'
import { 
  MagnifyingGlassIcon,
  FilmIcon,
  PlayIcon
} from '@heroicons/react/24/outline'

export default function VideosPage() {
  const { language } = useAppStore()
  const [videos, setVideos] = useState<YouTubeVideo[]>([])
  const [playlists, setPlaylists] = useState<VideoPlaylist[]>([])
  const [searchQuery, setSearchQuery] = useState('')
  const [activeTab, setActiveTab] = useState<'videos' | 'playlists'>('videos')
  const [loading, setLoading] = useState(true)

  // Load videos and playlists
  useEffect(() => {
    const loadContent = async () => {
      try {
        const [videosData, playlistsData] = await Promise.all([
          getChannelVideos(20),
          getVideoPlaylists()
        ])
        setVideos(videosData)
        setPlaylists(playlistsData)
      } catch (error) {
        console.error('Error loading videos:', error)
      } finally {
        setLoading(false)
      }
    }

    loadContent()
  }, [])

  // Filter videos and playlists based on search
  const filteredVideos = videos.filter(video => 
    video.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    video.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  const filteredPlaylists = playlists.filter(playlist => 
    playlist.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
    playlist.description.toLowerCase().includes(searchQuery.toLowerCase())
  )

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  return (
    <div className="min-h-screen py-8">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-8">
          <h1 className="text-4xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ru' ? 'Видео курсы' : 'Video Courses'}
          </h1>
          <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
            {language === 'ru' 
              ? 'Образовательные материалы по блокчейн-разработке, DeFi и смарт-контрактам'
              : 'Educational content on blockchain development, DeFi, and smart contracts'
            }
          </p>
        </div>

        {/* Search and Tabs */}
        <div className="mb-8">
          {/* Search */}
          <div className="max-w-md mx-auto mb-6">
            <div className="relative">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
              <input
                type="text"
                placeholder={language === 'ru' ? 'Поиск видео...' : 'Search videos...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary focus:border-transparent"
              />
            </div>
          </div>

          {/* Tabs */}
          <div className="flex justify-center space-x-1 bg-gray-100 dark:bg-gray-800 p-1 rounded-lg max-w-xs mx-auto">
            <Button
              variant={activeTab === 'videos' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('videos')}
              className="flex items-center space-x-2 flex-1"
            >
              <PlayIcon className="h-4 w-4" />
              <span>{language === 'ru' ? 'Видео' : 'Videos'}</span>
              <span className="bg-white/20 text-xs px-1 rounded">{filteredVideos.length}</span>
            </Button>
            <Button
              variant={activeTab === 'playlists' ? 'primary' : 'ghost'}
              size="sm"
              onClick={() => setActiveTab('playlists')}
              className="flex items-center space-x-2 flex-1"
            >
              <FilmIcon className="h-4 w-4" />
              <span>{language === 'ru' ? 'Плейлисты' : 'Playlists'}</span>
              <span className="bg-white/20 text-xs px-1 rounded">{filteredPlaylists.length}</span>
            </Button>
          </div>
        </div>

        {/* Content */}
        {activeTab === 'videos' ? (
          // Videos Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredVideos.map((video, index) => (
              <VideoCard key={video.id} video={video} />
            ))}
          </div>
        ) : (
          // Playlists Grid
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredPlaylists.map((playlist, index) => (
              <PlaylistCard key={playlist.id} playlist={playlist} />
            ))}
          </div>
        )}

        {/* Empty State */}
        {((activeTab === 'videos' && filteredVideos.length === 0) ||
          (activeTab === 'playlists' && filteredPlaylists.length === 0)) && (
          <div className="text-center py-12">
            <div className="text-gray-400 mb-4">
              {activeTab === 'videos' ? (
                <PlayIcon className="h-16 w-16 mx-auto" />
              ) : (
                <FilmIcon className="h-16 w-16 mx-auto" />
              )}
            </div>
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ru' ? 'Ничего не найдено' : 'Nothing found'}
            </h3>
            <p className="text-gray-600 dark:text-gray-400">
              {language === 'ru' 
                ? 'Попробуйте изменить поисковый запрос'
                : 'Try adjusting your search query'
              }
            </p>
          </div>
        )}

        {/* Call to Action */}
        <div className="text-center mt-12 py-8 bg-gray-50 dark:bg-gray-800 rounded-lg">
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
            {language === 'ru' ? 'Хотите персональное обучение?' : 'Want personalized training?'}
          </h3>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            {language === 'ru' 
              ? 'Закажите индивидуальную консультацию по блокчейн-разработке'
              : 'Book a personal blockchain development consultation'
            }
          </p>
          <Button size="lg">
            {language === 'ru' ? 'Записаться на консультацию' : 'Book Consultation'}
          </Button>
        </div>
      </div>
    </div>
  )
}