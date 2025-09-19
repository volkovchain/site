import React from 'react'
import { createLazyComponent, PeriodicTableSkeleton, BlogCardSkeleton, VideoCardSkeleton } from '@/components/ui/LazyLoading'

// Lazy load heavy 3D components
export const LazyPeriodicTable3D = createLazyComponent(
  () => import('@/components/periodic-table/PeriodicTable3D'),
  React.createElement(PeriodicTableSkeleton)
)

// Lazy load blog components
export const LazyBlogPage = createLazyComponent(
  () => import('@/components/blog/BlogPage'),
  React.createElement('div', 
    { className: "grid md:grid-cols-2 lg:grid-cols-3 gap-8" },
    Array.from({ length: 6 }).map((_, i) => 
      React.createElement(BlogCardSkeleton, { key: i })
    )
  )
)

// Lazy load video components
export const LazyVideoCard = createLazyComponent(
  () => import('@/components/videos/VideoCard'),
  React.createElement(VideoCardSkeleton)
)

// Lazy load consultation components
export const LazyServiceCard = createLazyComponent(
  () => import('@/components/consulting/ServiceCard')
)

// Lazy load MDX components for blog posts
export const LazyMDXContent = createLazyComponent(
  () => import('@/components/blog/BlogPost')
)

// Export all lazy components
export * from '@/components/ui/LazyLoading'