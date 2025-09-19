'use client'

import { getCLS, getFID, getFCP, getLCP, getTTFB, Metric } from 'web-vitals'
import { useCallback } from 'react'
import React from 'react'

export interface ConversionTrackingData {
  postId: string
  serviceId: string
  conversionType: 'cta_click' | 'service_view' | 'inquiry_submitted'
  source: 'inline' | 'sidebar' | 'footer' | 'header'
}

export interface AnalyticsConfig {
  enabled: boolean
  debug: boolean
  apiEndpoint: string
}

const defaultConfig: AnalyticsConfig = {
  enabled: true,
  debug: process.env.NODE_ENV === 'development',
  apiEndpoint: '/api/analytics/blog-conversion'
}

export function useAnalytics(config: Partial<AnalyticsConfig> = {}) {
  const finalConfig = { ...defaultConfig, ...config }

  const trackConversion = useCallback(async (data: ConversionTrackingData) => {
    if (!finalConfig.enabled) {
      if (finalConfig.debug) {
        console.log('[Analytics] Tracking disabled, would track:', data)
      }
      return
    }

    try {
      const response = await fetch(finalConfig.apiEndpoint, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...data,
          timestamp: new Date().toISOString()
        })
      })

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`)
      }

      const result = await response.json()
      
      if (finalConfig.debug) {
        console.log('[Analytics] Conversion tracked:', result)
      }

      return result
    } catch (error) {
      console.error('[Analytics] Failed to track conversion:', error)
      
      // Optionally store failed events for retry
      if (typeof window !== 'undefined') {
        const failedEvents = JSON.parse(localStorage.getItem('failedAnalyticsEvents') || '[]')
        failedEvents.push({ ...data, timestamp: new Date().toISOString() })
        localStorage.setItem('failedAnalyticsEvents', JSON.stringify(failedEvents.slice(-10))) // Keep last 10
      }
    }
  }, [finalConfig])

  const trackCTAClick = useCallback((postId: string, serviceId: string, source: ConversionTrackingData['source']) => {
    return trackConversion({
      postId,
      serviceId,
      conversionType: 'cta_click',
      source
    })
  }, [trackConversion])

  const trackServiceView = useCallback((postId: string, serviceId: string, source: ConversionTrackingData['source']) => {
    return trackConversion({
      postId,
      serviceId,
      conversionType: 'service_view',
      source
    })
  }, [trackConversion])

  const trackInquirySubmitted = useCallback((postId: string, serviceId: string, source: ConversionTrackingData['source']) => {
    return trackConversion({
      postId,
      serviceId,
      conversionType: 'inquiry_submitted',
      source
    })
  }, [trackConversion])

  const retryFailedEvents = useCallback(async () => {
    if (typeof window === 'undefined') return

    const failedEvents = JSON.parse(localStorage.getItem('failedAnalyticsEvents') || '[]')
    if (failedEvents.length === 0) return

    const successfulRetries: number[] = []

    for (let i = 0; i < failedEvents.length; i++) {
      try {
        await trackConversion(failedEvents[i])
        successfulRetries.push(i)
      } catch (error) {
        console.error('[Analytics] Retry failed for event:', failedEvents[i], error)
      }
    }

    // Remove successful retries
    if (successfulRetries.length > 0) {
      const remainingEvents = failedEvents.filter((_: any, index: number) => !successfulRetries.includes(index))
      localStorage.setItem('failedAnalyticsEvents', JSON.stringify(remainingEvents))
    }
  }, [trackConversion])

  return {
    trackConversion,
    trackCTAClick,
    trackServiceView,
    trackInquirySubmitted,
    retryFailedEvents,
    isEnabled: finalConfig.enabled,
    isDebugMode: finalConfig.debug
  }
}

// Higher-order component for automatic tracking
export function withAnalytics<T extends Record<string, any>>(
  Component: React.ComponentType<T>,
  defaultTrackingData?: Partial<ConversionTrackingData>
) {
  return function AnalyticsWrapper(props: T) {
    const analytics = useAnalytics()

    const trackingProps = {
      ...props,
      onAnalyticsTrack: (data: Partial<ConversionTrackingData>) => {
        const fullData = { ...defaultTrackingData, ...data } as ConversionTrackingData
        analytics.trackConversion(fullData)
      }
    }

    return React.createElement(Component, trackingProps)
  }
}

// React hook for automatic page view tracking
export function usePageAnalytics(postId?: string) {
  const analytics = useAnalytics()

  // Track page views (could be extended)
  useCallback(() => {
    if (postId && typeof window !== 'undefined') {
      // Could track page views here if needed
      if (analytics.isDebugMode) {
        console.log('[Analytics] Page view:', postId)
      }
    }
  }, [postId, analytics])

  return analytics
}

// Analytics configuration
const ANALYTICS_CONFIG = {
  gaId: process.env.NEXT_PUBLIC_GOOGLE_ANALYTICS_ID,
  vercelAnalytics: process.env.NEXT_PUBLIC_VERCEL_ANALYTICS_ID,
  enableDebug: process.env.NODE_ENV === 'development'
}

// Google Analytics 4 integration
declare global {
  interface Window {
    gtag: (...args: any[]) => void
    dataLayer: any[]
  }
}

export function initGoogleAnalytics() {
  if (!ANALYTICS_CONFIG.gaId || typeof window === 'undefined') return

  // Load Google Analytics script
  const script = document.createElement('script')
  script.async = true
  script.src = `https://www.googletagmanager.com/gtag/js?id=${ANALYTICS_CONFIG.gaId}`
  document.head.appendChild(script)

  // Initialize dataLayer and gtag function
  window.dataLayer = window.dataLayer || []
  window.gtag = function gtag() {
    window.dataLayer.push(arguments)
  }

  window.gtag('js', new Date())
  window.gtag('config', ANALYTICS_CONFIG.gaId, {
    page_title: document.title,
    page_location: window.location.href,
    custom_map: {
      custom_dimension_1: 'user_engagement'
    }
  })

  if (ANALYTICS_CONFIG.enableDebug) {
    console.log('📊 Google Analytics initialized')
  }
}

// Event tracking
export function trackEvent(eventName: string, properties?: Record<string, any>) {
  if (typeof window === 'undefined') return

  // Google Analytics
  if (window.gtag && ANALYTICS_CONFIG.gaId) {
    window.gtag('event', eventName, {
      event_category: properties?.category || 'engagement',
      event_label: properties?.label,
      value: properties?.value,
      ...properties
    })
  }

  // Custom analytics (can be extended)
  if (ANALYTICS_CONFIG.enableDebug) {
    console.log('📈 Event tracked:', eventName, properties)
  }
}

// Page view tracking
export function trackPageView(url: string, title?: string) {
  if (typeof window === 'undefined') return

  if (window.gtag && ANALYTICS_CONFIG.gaId) {
    window.gtag('config', ANALYTICS_CONFIG.gaId, {
      page_path: url,
      page_title: title || document.title
    })
  }

  if (ANALYTICS_CONFIG.enableDebug) {
    console.log('📄 Page view tracked:', url, title)
  }
}

// Conversion tracking
export function trackConversion(conversionName: string, value?: number) {
  if (typeof window === 'undefined') return

  trackEvent('conversion', {
    category: 'conversion',
    label: conversionName,
    value: value
  })

  if (ANALYTICS_CONFIG.enableDebug) {
    console.log('💰 Conversion tracked:', conversionName, value)
  }
}

// User engagement tracking
export function trackUserEngagement() {
  if (typeof window === 'undefined') return

  let startTime = Date.now()
  let isActive = true

  const trackEngagement = () => {
    if (isActive) {
      const timeSpent = Math.round((Date.now() - startTime) / 1000)
      trackEvent('user_engagement', {
        engagement_time_msec: timeSpent * 1000
      })
    }
  }

  // Track engagement on visibility change
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      isActive = false
      trackEngagement()
    } else {
      isActive = true
      startTime = Date.now()
    }
  })

  // Track engagement on beforeunload
  window.addEventListener('beforeunload', trackEngagement)

  // Track engagement every 30 seconds
  setInterval(() => {
    if (isActive) {
      trackEngagement()
      startTime = Date.now()
    }
  }, 30000)
}

// Web Vitals tracking
export function trackWebVitals() {
  if (typeof window === 'undefined') return

  const sendToAnalytics = (metric: Metric) => {
    const body = JSON.stringify(metric)
    
    // Send to Google Analytics
    trackEvent('web_vital', {
      event_category: 'Web Vitals',
      event_label: metric.name,
      value: Math.round(metric.name === 'CLS' ? metric.value * 1000 : metric.value),
      non_interaction: true
    })

    // Send to custom analytics endpoint
    if (navigator.sendBeacon) {
      navigator.sendBeacon('/api/analytics/web-vitals', body)
    } else {
      fetch('/api/analytics/web-vitals', {
        body,
        method: 'POST',
        keepalive: true
      }).catch(() => {
        // Analytics failure shouldn't affect user experience
      })
    }

    if (ANALYTICS_CONFIG.enableDebug) {
      console.log('🔬 Web Vital:', metric.name, metric.value)
    }
  }

  getCLS(sendToAnalytics)
  getFID(sendToAnalytics)
  getFCP(sendToAnalytics)
  getLCP(sendToAnalytics)
  getTTFB(sendToAnalytics)
}

// Error tracking
export function trackError(error: Error, context?: string) {
  if (typeof window === 'undefined') return

  trackEvent('exception', {
    description: error.message,
    fatal: false,
    error_context: context,
    stack_trace: error.stack?.substring(0, 500) // Limit stack trace length
  })

  // Send to error reporting service
  if (navigator.sendBeacon) {
    navigator.sendBeacon('/api/analytics/errors', JSON.stringify({
      message: error.message,
      stack: error.stack,
      context,
      url: window.location.href,
      userAgent: navigator.userAgent,
      timestamp: new Date().toISOString()
    }))
  }

  if (ANALYTICS_CONFIG.enableDebug) {
    console.error('🚨 Error tracked:', error.message, context)
  }
}

// Custom event tracking for VolkovChain specific actions
export const VolkovChainAnalytics = {
  // Periodic table interactions
  trackElementView: (elementName: string) => {
    trackEvent('element_view', {
      category: 'periodic_table',
      label: elementName
    })
  },

  trackElementInteraction: (elementName: string, action: string) => {
    trackEvent('element_interaction', {
      category: 'periodic_table',
      label: `${elementName}_${action}`
    })
  },

  trackSearch: (query: string, context: string) => {
    trackEvent('search', {
      category: context,
      label: query,
      search_term: query
    })
  },

  // Blog interactions
  trackBlogRead: (slug: string, readTime: number) => {
    trackEvent('blog_read', {
      category: 'blog',
      label: slug,
      value: readTime
    })
  },

  trackBlogShare: (slug: string, platform: string) => {
    trackEvent('blog_share', {
      category: 'blog',
      label: `${slug}_${platform}`
    })
  },

  // Consultation tracking
  trackConsultationInterest: (packageType: string) => {
    trackEvent('consultation_interest', {
      category: 'consulting',
      label: packageType
    })
  },

  trackConsultationBooking: (packageType: string, value: number) => {
    trackConversion('consultation_booking', value)
    trackEvent('consultation_booking', {
      category: 'consulting',
      label: packageType,
      value
    })
  },

  // Video interactions
  trackVideoPlay: (videoId: string, title: string) => {
    trackEvent('video_play', {
      category: 'video',
      label: `${videoId}_${title}`,
      video_title: title
    })
  },

  // 3D interactions
  track3DPerformance: (fps: number, renderTime: number) => {
    trackEvent('3d_performance', {
      category: 'performance',
      label: '3d_render',
      fps,
      render_time: renderTime
    })
  }
}

// Initialize analytics
export function initAnalytics() {
  if (typeof window === 'undefined') return

  // Initialize Google Analytics
  initGoogleAnalytics()

  // Track web vitals
  trackWebVitals()

  // Track user engagement
  trackUserEngagement()

  // Set up error tracking
  window.addEventListener('error', (event) => {
    trackError(event.error, 'global_error_handler')
  })

  window.addEventListener('unhandledrejection', (event) => {
    trackError(new Error(event.reason), 'unhandled_promise_rejection')
  })

  if (ANALYTICS_CONFIG.enableDebug) {
    console.log('📊 Analytics initialized')
  }
}

export default {
  initAnalytics,
  trackEvent,
  trackPageView,
  trackConversion,
  trackError,
  trackWebVitals,
  VolkovChainAnalytics
}