'use client'

import React from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import type { VideoPlaylist } from '@/types'
import { 
  PlayIcon,
  FilmIcon
} from '@heroicons/react/24/outline'

interface PlaylistCardProps {
  playlist: VideoPlaylist
}

export function PlaylistCard({ playlist }: PlaylistCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
    >
      <Link href={`/videos/playlist/${playlist.id}`}>
        <Card className="overflow-hidden cursor-pointer group">
          {/* Thumbnail */}
          <div className="relative aspect-video bg-gray-200 dark:bg-gray-700">
            <Image
              src={playlist.thumbnailUrl}
              alt={playlist.title}
              fill
              className="object-cover transition-transform duration-300 group-hover:scale-105"
              sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            />
            
            {/* Playlist overlay */}
            <div className="absolute inset-0 bg-black/20 group-hover:bg-black/30 transition-colors">
              <div className="absolute top-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded flex items-center space-x-1">
                <FilmIcon className="h-3 w-3" />
                <span>{playlist.videoCount}</span>
              </div>
              
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-red-600 rounded-full p-3 transform scale-90 group-hover:scale-100 transition-transform">
                  <PlayIcon className="h-6 w-6 text-white ml-1" />
                </div>
              </div>
            </div>
          </div>

          {/* Content */}
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 dark:text-white mb-2 group-hover:text-primary transition-colors">
              {playlist.title}
            </h3>
            
            <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
              {playlist.description}
            </p>
          </div>
        </Card>
      </Link>
    </motion.div>
  )
}