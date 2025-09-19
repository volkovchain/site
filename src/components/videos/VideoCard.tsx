'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { formatDuration, formatViewCount } from '@/lib/youtube'
import type { YouTubeVideo } from '@/types'
import { 
  PlayIcon,
  EyeIcon,
  CalendarIcon
} from '@heroicons/react/24/outline'

interface VideoCardProps {
  video: YouTubeVideo
  onClick?: () => void
}

export function VideoCard({ video, onClick }: VideoCardProps) {
  const handleClick = () => {
    if (onClick) {
      onClick()
    } else {
      // Open YouTube video in new tab
      window.open(`https://www.youtube.com/watch?v=${video.id}`, '_blank')
    }
  }

  const formatDate = (dateString: string) => {
    const date = new Date(dateString)
    return date.toLocaleDateString('ru-RU', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    })
  }

  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      onClick={handleClick}
      className="cursor-pointer"
    >
      <Card className="overflow-hidden group">
        {/* Thumbnail */}
        <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
          <Image
            src={video.thumbnailUrl}
            alt={video.title}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
          
          {/* Play overlay */}
          <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors flex items-center justify-center">
            <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
              <PlayIcon className="h-6 w-6 text-white ml-1" />
            </div>
          </div>
          
          {/* Duration badge */}
          {video.duration && video.duration !== 'PT0S' && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded">
              {formatDuration(video.duration)}
            </div>
          )}
        </div>

        {/* Content */}
        <div className="p-4">
          <h3 className="font-semibold text-gray-900 dark:text-white mb-2 line-clamp-2 group-hover:text-primary transition-colors">
            {video.title}
          </h3>
          
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2">
            {video.description}
          </p>
          
          {/* Stats */}
          <div className="flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <div className="flex items-center space-x-4">
              {video.viewCount > 0 && (
                <div className="flex items-center space-x-1">
                  <EyeIcon className="h-4 w-4" />
                  <span>{formatViewCount(video.viewCount)}</span>
                </div>
              )}
              
              <div className="flex items-center space-x-1">
                <CalendarIcon className="h-4 w-4" />
                <span>{formatDate(video.publishedAt)}</span>
              </div>
            </div>
            
            {video.likeCount && video.likeCount > 0 && (
              <div className="flex items-center space-x-1">
                <span>❤️</span>
                <span>{video.likeCount}</span>
              </div>
            )}
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Default export for lazy loading
export default VideoCard