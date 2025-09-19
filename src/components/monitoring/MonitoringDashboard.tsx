'use client'

import { useState, useEffect } from 'react'
import { ChartBarIcon, ExclamationTriangleIcon, CpuChipIcon, ClockIcon } from '@heroicons/react/24/outline'

interface Metric {
  name: string
  value: number
  threshold: number
  unit: string
  status: 'good' | 'warning' | 'poor'
}

interface SystemMetrics {
  webVitals: Metric[]
  performance: {
    memoryUsage: number
    loadTime: number
    fps: number
  }
  errors: {
    count: number
    lastError?: string
  }
}

export function MonitoringDashboard() {
  const [metrics, setMetrics] = useState<SystemMetrics | null>(null)
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    // Only show in development or for admin users
    const showDashboard = process.env.NODE_ENV === 'development' || 
                         localStorage.getItem('volkovchain-admin') === 'true'
    
    if (!showDashboard) return

    setIsVisible(true)
    
    const collectMetrics = () => {
      const webVitals: Metric[] = []
      
      // Collect performance metrics
      if ('memory' in performance) {
        const memory = (performance as any).memory
        const memoryUsage = memory.usedJSHeapSize / 1048576 // MB
        
        webVitals.push({
          name: 'Memory Usage',
          value: memoryUsage,
          threshold: 50,
          unit: 'MB',
          status: memoryUsage > 50 ? 'warning' : 'good'
        })
      }

      // Collect navigation timing
      const navigation = performance.getEntriesByType('navigation')[0] as PerformanceNavigationTiming
      if (navigation) {
        const loadTime = navigation.loadEventEnd - navigation.loadEventStart
        
        webVitals.push({
          name: 'Load Time',
          value: loadTime,
          threshold: 3000,
          unit: 'ms',
          status: loadTime > 3000 ? 'poor' : loadTime > 1000 ? 'warning' : 'good'
        })
      }

      setMetrics({
        webVitals,
        performance: {
          memoryUsage: webVitals.find(m => m.name === 'Memory Usage')?.value || 0,
          loadTime: webVitals.find(m => m.name === 'Load Time')?.value || 0,
          fps: 60 // Would be calculated from actual frame data
        },
        errors: {
          count: 0, // Would be tracked from error handlers
          lastError: undefined
        }
      })
    }

    collectMetrics()
    const interval = setInterval(collectMetrics, 5000)

    return () => clearInterval(interval)
  }, [])

  if (!isVisible || !metrics) return null

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'good': return 'text-green-600 bg-green-100'
      case 'warning': return 'text-yellow-600 bg-yellow-100'
      case 'poor': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  return (
    <div className="fixed bottom-4 right-4 z-50">
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 p-4 w-80">
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-sm font-medium text-gray-900 dark:text-white flex items-center">
            <ChartBarIcon className="w-4 h-4 mr-2" />
            Performance Monitor
          </h3>
          <button
            onClick={() => setIsVisible(false)}
            className="text-gray-400 hover:text-gray-600"
          >
            ×
          </button>
        </div>

        <div className="space-y-3">
          {/* Web Vitals */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Web Vitals</h4>
            <div className="space-y-1">
              {metrics.webVitals.map((metric) => (
                <div key={metric.name} className="flex items-center justify-between text-xs">
                  <span className="text-gray-600 dark:text-gray-400">{metric.name}</span>
                  <span className={`px-2 py-1 rounded ${getStatusColor(metric.status)}`}>
                    {metric.value.toFixed(1)}{metric.unit}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Performance Stats */}
          <div>
            <h4 className="text-xs font-medium text-gray-500 mb-2">Performance</h4>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div className="flex items-center">
                <CpuChipIcon className="w-3 h-3 mr-1 text-blue-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {metrics.performance.memoryUsage.toFixed(1)}MB
                </span>
              </div>
              <div className="flex items-center">
                <ClockIcon className="w-3 h-3 mr-1 text-green-500" />
                <span className="text-gray-600 dark:text-gray-400">
                  {metrics.performance.loadTime.toFixed(0)}ms
                </span>
              </div>
            </div>
          </div>

          {/* Error Count */}
          {metrics.errors.count > 0 && (
            <div>
              <h4 className="text-xs font-medium text-gray-500 mb-2">Errors</h4>
              <div className="flex items-center text-xs">
                <ExclamationTriangleIcon className="w-3 h-3 mr-1 text-red-500" />
                <span className="text-red-600">{metrics.errors.count} errors</span>
              </div>
            </div>
          )}
        </div>

        <div className="mt-3 pt-2 border-t border-gray-200 dark:border-gray-600">
          <div className="flex justify-between text-xs text-gray-500">
            <span>Last updated: {new Date().toLocaleTimeString()}</span>
            <button
              onClick={() => window.location.reload()}
              className="text-blue-500 hover:text-blue-600"
            >
              Refresh
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}