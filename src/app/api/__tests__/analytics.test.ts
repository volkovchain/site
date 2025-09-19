import { describe, it, expect, vi, beforeEach } from 'vitest'
import { NextRequest } from 'next/server'
import { POST } from '../analytics/web-vitals/route'

describe('Analytics API Routes', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Mock console.log to avoid output during tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
  })

  describe('Web Vitals API', () => {
    it('processes web vitals data successfully', async () => {
      const mockMetrics = {
        name: 'LCP',
        value: 1500,
        id: 'test-id',
        delta: 100
      }

      const request = new NextRequest('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        body: JSON.stringify(mockMetrics),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('handles invalid JSON data', async () => {
      const request = new NextRequest('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
    })

    it('logs metrics data correctly', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      const mockMetrics = {
        name: 'FCP',
        value: 800,
        id: 'test-fcp-id'
      }

      const request = new NextRequest('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        body: JSON.stringify(mockMetrics),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await POST(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Web Vitals:',
        expect.objectContaining({
          name: 'FCP',
          value: 800,
          id: 'test-fcp-id'
        })
      )
    })

    it('includes request metadata in logs', async () => {
      const consoleSpy = vi.spyOn(console, 'log')
      const mockMetrics = { name: 'CLS', value: 0.1, id: 'test-cls' }

      const request = new NextRequest('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        body: JSON.stringify(mockMetrics),
        headers: {
          'Content-Type': 'application/json',
          'User-Agent': 'test-browser'
        }
      })

      await POST(request)

      expect(consoleSpy).toHaveBeenCalledWith(
        'Web Vitals:',
        expect.objectContaining({
          url: '/api/analytics/web-vitals',
          timestamp: expect.any(String)
        })
      )
    })
  })

  describe('Error Handling', () => {
    it('handles fetch errors gracefully', async () => {
      // Mock fetch to throw an error
      global.fetch = vi.fn().mockRejectedValue(new Error('Network error'))
      
      const mockMetrics = { name: 'LCP', value: 2000, id: 'test' }
      const request = new NextRequest('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        body: JSON.stringify(mockMetrics)
      })

      const response = await POST(request)
      const data = await response.json()

      // Should still succeed even if external webhook fails
      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('returns error for malformed requests', async () => {
      const request = new NextRequest('http://localhost:3000/api/analytics/web-vitals', {
        method: 'POST',
        body: null as any
      })

      const response = await POST(request)
      expect(response.status).toBe(500)
    })
  })
})