// Performance monitoring utilities for VolkovChain website

interface PerformanceMetrics {
  name: string
  startTime: number
  endTime?: number
  duration?: number
}

class PerformanceMonitor {
  private metrics: Map<string, PerformanceMetrics> = new Map()

  startMeasure(name: string): void {
    this.metrics.set(name, {
      name,
      startTime: performance.now()
    })
  }

  endMeasure(name: string): number | null {
    const metric = this.metrics.get(name)
    if (!metric) return null

    const endTime = performance.now()
    const duration = endTime - metric.startTime

    this.metrics.set(name, {
      ...metric,
      endTime,
      duration
    })

    // Log in development
    if (process.env.NODE_ENV === 'development') {
      console.log(`🚀 ${name}: ${duration.toFixed(2)}ms`)
    }

    return duration
  }

  getMetrics(): PerformanceMetrics[] {
    return Array.from(this.metrics.values())
  }

  reset(): void {
    this.metrics.clear()
  }
}

export const perfMonitor = new PerformanceMonitor()

// React hook for measuring component performance
export function usePerformanceMonitor(componentName: string) {
  React.useEffect(() => {
    perfMonitor.startMeasure(`${componentName}-mount`)
    
    return () => {
      perfMonitor.endMeasure(`${componentName}-mount`)
    }
  }, [componentName])

  const startMeasure = (operationName: string) => {
    perfMonitor.startMeasure(`${componentName}-${operationName}`)
  }

  const endMeasure = (operationName: string) => {
    return perfMonitor.endMeasure(`${componentName}-${operationName}`)
  }

  return { startMeasure, endMeasure }
}

// Web Vitals monitoring
export function measureWebVitals() {
  if (typeof window === 'undefined') return

  // Measure First Contentful Paint
  const observer = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    entries.forEach((entry) => {
      if (entry.entryType === 'paint' && entry.name === 'first-contentful-paint') {
        console.log('🎨 First Contentful Paint:', entry.startTime.toFixed(2) + 'ms')
      }
    })
  })

  observer.observe({ entryTypes: ['paint'] })

  // Measure Largest Contentful Paint
  const lcpObserver = new PerformanceObserver((list) => {
    const entries = list.getEntries()
    const lastEntry = entries[entries.length - 1]
    console.log('🖼️ Largest Contentful Paint:', lastEntry.startTime.toFixed(2) + 'ms')
  })

  lcpObserver.observe({ entryTypes: ['largest-contentful-paint'] })

  // Measure Cumulative Layout Shift
  let clsValue = 0
  const clsObserver = new PerformanceObserver((list) => {
    for (const entry of list.getEntries()) {
      // Type assertion for layout shift entries
      const layoutShiftEntry = entry as any
      if (!layoutShiftEntry.hadRecentInput) {
        clsValue += layoutShiftEntry.value
      }
    }
    console.log('📐 Cumulative Layout Shift:', clsValue.toFixed(4))
  })

  clsObserver.observe({ entryTypes: ['layout-shift'] })
}

// Resource loading optimization
export function preloadCriticalResources() {
  if (typeof window === 'undefined') return

  // Preload critical fonts
  const fonts = [
    '/fonts/inter-var.woff2'
  ]

  fonts.forEach(font => {
    const link = document.createElement('link')
    link.rel = 'preload'
    link.as = 'font'
    link.type = 'font/woff2'
    link.crossOrigin = 'anonymous'
    link.href = font
    document.head.appendChild(link)
  })

  // Prefetch next page resources
  const prefetchLinks = [
    '/periodic-table',
    '/blog',
    '/consulting'
  ]

  prefetchLinks.forEach(href => {
    const link = document.createElement('link')
    link.rel = 'prefetch'
    link.href = href
    document.head.appendChild(link)
  })
}

// Bundle size analyzer (development only - server side)
export function analyzeBundleSize() {
  // Only run on server side in development
  if (typeof window !== 'undefined' || process.env.NODE_ENV !== 'development') {
    return
  }

  // This should only be called from server-side code or build scripts
  console.log('📦 Bundle analyzer can be enabled via webpack config')
}

// Memory usage monitoring
export function monitorMemoryUsage() {
  if (typeof window === 'undefined' || !('memory' in performance)) return

  const memory = (performance as any).memory
  
  console.log('💾 Memory Usage:', {
    used: Math.round(memory.usedJSHeapSize / 1048576) + ' MB',
    total: Math.round(memory.totalJSHeapSize / 1048576) + ' MB',
    limit: Math.round(memory.jsHeapSizeLimit / 1048576) + ' MB'
  })
}

// Three.js specific optimizations
export function optimizeThreeJS() {
  return {
    // Renderer settings for better performance
    rendererConfig: {
      antialias: window.devicePixelRatio < 2,
      powerPreference: 'high-performance',
      alpha: true,
      stencil: false,
      depth: true,
    },
    
    // Camera settings
    cameraConfig: {
      fov: 75,
      near: 0.1,
      far: 1000,
    },
    
    // Shadow settings for mobile
    shadowConfig: {
      enabled: window.innerWidth > 768,
      type: 'PCFSoftShadowMap',
      autoUpdate: false,
    }
  }
}

// Initialize performance monitoring
export function initPerformanceMonitoring() {
  if (typeof window === 'undefined') return

  // Start measuring initial load
  perfMonitor.startMeasure('initial-load')
  
  window.addEventListener('load', () => {
    perfMonitor.endMeasure('initial-load')
    measureWebVitals()
    monitorMemoryUsage()
    preloadCriticalResources()
  })

  // Monitor route changes in Next.js
  if ('addEventListener' in window) {
    let navigationStart = performance.now()
    
    window.addEventListener('beforeunload', () => {
      navigationStart = performance.now()
    })
    
    window.addEventListener('load', () => {
      const navigationTime = performance.now() - navigationStart
      console.log('🧭 Navigation time:', navigationTime.toFixed(2) + 'ms')
    })
  }
}

import React from 'react'

export default {
  perfMonitor,
  usePerformanceMonitor,
  measureWebVitals,
  preloadCriticalResources,
  analyzeBundleSize,
  monitorMemoryUsage,
  optimizeThreeJS,
  initPerformanceMonitoring
}