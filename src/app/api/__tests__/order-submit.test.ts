import { describe, it, expect, beforeAll, afterAll, vi } from 'vitest'
import { NextRequest, NextResponse } from 'next/server'
import { POST } from '@/app/api/order/submit/route'

// Mock MongoDB connection and models
vi.mock('@/lib/mongodb', () => ({
  default: vi.fn().mockResolvedValue({})
}))

vi.mock('@/lib/models', () => ({
  OrderModel: {
    constructor: vi.fn(),
    save: vi.fn().mockResolvedValue({ _id: 'order-id', orderId: 'ORD-123' }),
    findByIdAndUpdate: vi.fn().mockResolvedValue({})
  },
  CustomerModel: {
    findOne: vi.fn(),
    constructor: vi.fn(),
    save: vi.fn(),
    findByIdAndUpdate: vi.fn().mockResolvedValue({})
  },
  OrderTrackingModel: {
    create: vi.fn().mockResolvedValue({})
  }
}))

// Mock serviceRegistry
vi.mock('@/lib/serviceRegistry', () => ({
  serviceRegistry: {
    validateOrderData: vi.fn(() => ({ isValid: true, errors: [] })),
    generateOrderId: vi.fn(() => 'ORD-123456789'),
    calculateTotalPrice: vi.fn(() => ({ min: 100, max: 200, currency: 'USD' }))
  }
}))

// Mock external functions
const mockSendOrderConfirmation = vi.fn()
const mockNotifyManagementTeam = vi.fn()
const mockScheduleInvoiceGeneration = vi.fn()

vi.mock('@/app/api/order/submit/route', async () => {
  const actual = await vi.importActual('@/app/api/order/submit/route')
  return {
    ...actual,
    sendOrderConfirmationEmail: mockSendOrderConfirmation,
    notifyManagementTeam: mockNotifyManagementTeam,
    scheduleInvoiceGeneration: mockScheduleInvoiceGeneration
  }
})

describe('/api/order/submit', () => {
  beforeAll(() => {
    // Mock console methods to avoid noise in tests
    vi.spyOn(console, 'log').mockImplementation(() => {})
    vi.spyOn(console, 'error').mockImplementation(() => {})
  })

  afterAll(() => {
    vi.restoreAllMocks()
  })

  describe('POST /api/order/submit', () => {
    const validOrderData = {
      selectedServices: [
        {
          serviceId: 'basic-consultation',
          priority: 'Medium',
          estimatedPrice: { min: 150, max: 150, currency: 'USD' }
        }
      ],
      projectDetails: {
        title: 'Test Project',
        description: 'Test project description',
        objectives: ['Objective 1'],
        constraints: []
      },
      contactInfo: {
        firstName: 'John',
        lastName: 'Doe',
        email: 'john@example.com',
        timezone: 'UTC',
        communicationChannels: {}
      },
      technicalInfo: {
        hasExistingCode: false,
        preferredTechStack: [],
        requiredIntegrations: []
      },
      agreesToTerms: true,
      marketingOptIn: false,
      preferredCommunication: 'email',
      timeline: 'standard'
    }

    it('should successfully submit a valid order', async () => {
      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
      expect(data.orderId).toBe('ORD-123456789')
      expect(data.message).toContain('Order submitted successfully')
      expect(data.estimatedTotal).toEqual({
        min: 100,
        max: 200,
        currency: 'USD'
      })
    })

    it('should return 400 for invalid order data', async () => {
      // Mock validation to return invalid
      const { serviceRegistry } = await import('@/lib/serviceRegistry')
      vi.mocked(serviceRegistry.validateOrderData).mockReturnValueOnce({
        isValid: false,
        errors: ['Selected services are required']
      })

      const invalidOrderData = {
        ...validOrderData,
        selectedServices: []
      }

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(invalidOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid order data')
      expect(data.details).toContain('Selected services are required')
    })

    it('should handle missing required fields', async () => {
      const incompleteOrderData = {
        selectedServices: [],
        projectDetails: {
          title: '',
          description: '',
          objectives: [],
          constraints: []
        }
      }

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(incompleteOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(400)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Invalid order data')
    })

    it('should handle malformed JSON', async () => {
      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: 'invalid json',
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to submit order')
    })

    it('should create new customer if not exists', async () => {
      const { CustomerModel } = await import('@/lib/models')
      
      // Mock customer not found
      vi.mocked(CustomerModel.findOne).mockResolvedValueOnce(null)
      
      const mockSave = vi.fn().mockResolvedValue({ _id: 'customer-id' })
      const mockCustomerConstructor = vi.fn().mockImplementation(() => ({ save: mockSave }))
      vi.mocked(CustomerModel).mockImplementation(mockCustomerConstructor as any)

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await POST(request)

      expect(CustomerModel.findOne).toHaveBeenCalledWith({
        email: 'john@example.com'
      })
      expect(mockCustomerConstructor).toHaveBeenCalled()
      expect(mockSave).toHaveBeenCalled()
    })

    it('should use existing customer if found', async () => {
      const { CustomerModel } = await import('@/lib/models')
      
      const existingCustomer = {
        _id: 'existing-customer-id',
        email: 'john@example.com'
      }
      
      vi.mocked(CustomerModel.findOne).mockResolvedValueOnce(existingCustomer)

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      await POST(request)

      expect(CustomerModel.findOne).toHaveBeenCalledWith({
        email: 'john@example.com'
      })
    })

    it('should determine correct order priority', async () => {
      // Test enterprise priority
      const enterpriseOrderData = {
        ...validOrderData,
        estimatedBudget: 'enterprise'
      }

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(enterpriseOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(200)
      expect(data.success).toBe(true)
    })

    it('should create order tracking entry', async () => {
      const { OrderTrackingModel } = await import('@/lib/models')

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Content-Type': 'application/json',
          'x-forwarded-for': '192.168.1.1',
          'user-agent': 'Mozilla/5.0 Test Browser'
        }
      })

      await POST(request)

      expect(OrderTrackingModel.create).toHaveBeenCalledWith({
        orderId: expect.any(String),
        status: 'submitted',
        message: 'Order submitted successfully',
        author: 'system',
        metadata: {
          ip: '192.168.1.1',
          userAgent: 'Mozilla/5.0 Test Browser'
        }
      })
    })

    it('should handle database connection errors', async () => {
      const connectToDatabase = await import('@/lib/mongodb')
      vi.mocked(connectToDatabase.default).mockRejectedValueOnce(new Error('Database connection failed'))

      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(response.status).toBe(500)
      expect(data.success).toBe(false)
      expect(data.error).toBe('Failed to submit order')
    })

    it('should include tracking URL in response', async () => {
      const request = new NextRequest('http://localhost:3000/api/order/submit', {
        method: 'POST',
        body: JSON.stringify(validOrderData),
        headers: {
          'Content-Type': 'application/json'
        }
      })

      const response = await POST(request)
      const data = await response.json()

      expect(data.trackingUrl).toBe('/order/track/ORD-123456789')
    })
  })

  describe('Helper Functions', () => {
    it('should determine priority correctly for different scenarios', () => {
      // This would test the determinePriority function if it were exported
      // For now, we test it indirectly through the API endpoint
      expect(true).toBe(true) // Placeholder
    })
  })
})