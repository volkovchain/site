import NextImage, { ImageProps as NextImageProps } from 'next/image'
import { useState } from 'react'

interface OptimizedImageProps extends Omit<NextImageProps, 'src'> {
  src: string
  alt: string
  fallback?: string
  loading?: 'lazy' | 'eager'
  priority?: boolean
  quality?: number
}

export function OptimizedImage({
  src,
  alt,
  fallback = '/images/placeholder.jpg',
  loading = 'lazy',
  priority = false,
  quality = 75,
  className,
  ...props
}: OptimizedImageProps) {
  const [error, setError] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  const handleError = () => {
    setError(true)
    setIsLoading(false)
  }

  const handleLoad = () => {
    setIsLoading(false)
  }

  return (
    <div className={`relative overflow-hidden ${className}`}>
      {isLoading && (
        <div className="absolute inset-0 bg-gray-200 dark:bg-gray-700 animate-pulse flex items-center justify-center">
          <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
          </svg>
        </div>
      )}
      
      <NextImage
        src={error ? fallback : src}
        alt={alt}
        loading={loading}
        priority={priority}
        quality={quality}
        onError={handleError}
        onLoad={handleLoad}
        className={`transition-opacity duration-300 ${
          isLoading ? 'opacity-0' : 'opacity-100'
        }`}
        {...props}
      />
    </div>
  )
}

// Preset configurations for common use cases
export function HeroImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      priority
      quality={90}
      sizes="100vw"
    />
  )
}

export function BlogCoverImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      quality={80}
      sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
    />
  )
}

export function ThumbnailImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      quality={60}
      sizes="(max-width: 768px) 50vw, 25vw"
    />
  )
}

export function AvatarImage(props: OptimizedImageProps) {
  return (
    <OptimizedImage
      {...props}
      quality={70}
      sizes="(max-width: 768px) 10vw, 5vw"
    />
  )
}