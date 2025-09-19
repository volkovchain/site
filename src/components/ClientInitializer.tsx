'use client'

import { useEffect } from 'react'
import { initPerformanceMonitoring } from '@/lib/performance'
import { initAnalytics } from '@/lib/analytics'

export function ClientInitializer() {
  useEffect(() => {
    // Initialize performance monitoring
    initPerformanceMonitoring()
    
    // Initialize analytics
    initAnalytics()
  }, [])

  return null
}