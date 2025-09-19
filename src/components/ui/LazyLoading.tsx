import React, { lazy, Suspense, ComponentType } from 'react'

interface LazyWrapperProps {
  fallback?: React.ReactNode
}

export function createLazyComponent<T extends ComponentType<any>>(
  importFunc: () => Promise<{ default: T }>,
  fallback?: React.ReactNode
): React.ComponentType<React.ComponentProps<T>> {
  const LazyComponent = lazy(importFunc)
  
  return function LazyWrapper(props: React.ComponentProps<T>) {
    return (
      <Suspense fallback={fallback || <ComponentSkeleton />}>
        <LazyComponent {...props} />
      </Suspense>
    )
  }
}

// Default loading skeleton
function ComponentSkeleton() {
  return (
    <div className="animate-pulse">
      <div className="bg-gray-300 dark:bg-gray-700 rounded-lg h-48 w-full"></div>
    </div>
  )
}

// Specific loading components for different contexts
export function PeriodicTableSkeleton() {
  return (
    <div className="h-screen w-full bg-gray-100 dark:bg-gray-800 animate-pulse flex items-center justify-center">
      <div className="text-center">
        <div className="w-16 h-16 bg-gray-300 dark:bg-gray-700 rounded-full mx-auto mb-4"></div>
        <div className="w-32 h-4 bg-gray-300 dark:bg-gray-700 rounded mx-auto mb-2"></div>
        <div className="w-24 h-3 bg-gray-300 dark:bg-gray-700 rounded mx-auto"></div>
      </div>
    </div>
  )
}

export function BlogCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg border border-gray-200 dark:border-gray-700 p-6 animate-pulse">
      <div className="flex items-center justify-between mb-3">
        <div className="w-20 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="w-3/4 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
      <div className="w-1/2 h-6 bg-gray-300 dark:bg-gray-700 rounded mb-4"></div>
      
      <div className="space-y-2 mb-4">
        <div className="w-full h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-5/6 h-4 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
      
      <div className="flex items-center justify-between mb-4">
        <div className="flex space-x-3">
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
      
      <div className="flex space-x-2">
        <div className="w-12 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
        <div className="w-16 h-5 bg-gray-300 dark:bg-gray-700 rounded"></div>
      </div>
    </div>
  )
}

export function VideoCardSkeleton() {
  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-md overflow-hidden animate-pulse">
      <div className="aspect-video bg-gray-300 dark:bg-gray-700"></div>
      <div className="p-4">
        <div className="w-3/4 h-5 bg-gray-300 dark:bg-gray-700 rounded mb-2"></div>
        <div className="w-1/2 h-5 bg-gray-300 dark:bg-gray-700 rounded mb-3"></div>
        <div className="space-y-2">
          <div className="w-full h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-4/5 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="w-16 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
          <div className="w-12 h-3 bg-gray-300 dark:bg-gray-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

// Intersection Observer based lazy loading hook
export function useLazyLoad(options?: IntersectionObserverInit) {
  const [ref, setRef] = React.useState<Element | null>(null)
  const [isVisible, setIsVisible] = React.useState(false)

  React.useEffect(() => {
    if (!ref) return

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true)
          observer.disconnect()
        }
      },
      {
        threshold: 0.1,
        ...options,
      }
    )

    observer.observe(ref)

    return () => observer.disconnect()
  }, [ref, options])

  return [setRef, isVisible] as const
}

// Image lazy loading component
interface LazyImageProps extends React.ImgHTMLAttributes<HTMLImageElement> {
  src: string
  alt: string
  placeholder?: string
}

export function LazyImage({ src, alt, placeholder, className, ...props }: LazyImageProps) {
  const [setRef, isVisible] = useLazyLoad()
  const [loaded, setLoaded] = React.useState(false)

  return (
    <div ref={setRef} className={className}>
      {isVisible && (
        <img
          src={src}
          alt={alt}
          onLoad={() => setLoaded(true)}
          className={`transition-opacity duration-300 ${
            loaded ? 'opacity-100' : 'opacity-0'
          }`}
          {...props}
        />
      )}
      {(!isVisible || !loaded) && (
        <div className="bg-gray-300 dark:bg-gray-700 animate-pulse w-full h-full flex items-center justify-center">
          {placeholder || (
            <svg className="w-8 h-8 text-gray-400" fill="currentColor" viewBox="0 0 20 20">
              <path fillRule="evenodd" d="M4 3a2 2 0 00-2 2v10a2 2 0 002 2h12a2 2 0 002-2V5a2 2 0 00-2-2H4zm12 12H4l4-8 3 6 2-4 3 6z" clipRule="evenodd" />
            </svg>
          )}
        </div>
      )}
    </div>
  )
}