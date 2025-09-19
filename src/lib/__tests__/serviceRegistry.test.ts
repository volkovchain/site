import { describe, it, expect, beforeEach, vi } from 'vitest'
import { serviceRegistry } from '@/lib/serviceRegistry'
import type { OrderFormData, FilterState } from '@/types'

describe('ServiceRegistry', () => {
  beforeEach(() => {
    // Reset any mocked functions
    vi.clearAllMocks()
  })

  describe('Service Catalog Management', () => {
    it('should return all active service categories', () => {
      const categories = serviceRegistry.getServiceCategories()
      
      expect(categories).toHaveLength(4)
      expect(categories.map(c => c.categoryId)).toEqual([
        'education', 'development', 'consulting', 'content'
      ])
      categories.forEach(category => {
        expect(category.isActive).toBe(true)
      })
    })

    it('should return services by category', () => {
      const educationServices = serviceRegistry.getServicesByCategory('education')
      const consultingServices = serviceRegistry.getServicesByCategory('consulting')
      
      expect(educationServices.length).toBeGreaterThan(0)
      expect(consultingServices.length).toBeGreaterThan(0)
      
      educationServices.forEach(service => {
        expect(service.categoryId).toBe('education')
        expect(service.isActive).toBe(true)
      })
    })

    it('should find service by ID', () => {
      const service = serviceRegistry.getServiceById('rust-blockchain-course')
      
      expect(service).toBeDefined()
      expect(service?.serviceId).toBe('rust-blockchain-course')
      expect(service?.categoryId).toBe('education')
    })

    it('should return undefined for non-existent service ID', () => {
      const service = serviceRegistry.getServiceById('non-existent-service')
      expect(service).toBeUndefined()
    })
  })

  describe('Service Search', () => {
    it('should search services by name in English', () => {
      const results = serviceRegistry.searchServices('rust', 'en')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(s => s.serviceId === 'rust-blockchain-course')).toBe(true)
    })

    it('should search services by name in Russian', () => {
      const results = serviceRegistry.searchServices('rust', 'ru')
      
      expect(results.length).toBeGreaterThan(0)
      expect(results.some(s => s.serviceId === 'rust-blockchain-course')).toBe(true)
    })

    it('should search services by tags', () => {
      const results = serviceRegistry.searchServices('blockchain')
      
      expect(results.length).toBeGreaterThan(0)
      results.forEach(service => {
        expect(
          service.tags.includes('blockchain') ||
          service.name.en.toLowerCase().includes('blockchain') ||
          service.shortDescription.en.toLowerCase().includes('blockchain')
        ).toBe(true)
      })
    })

    it('should return empty array for non-matching search', () => {
      const results = serviceRegistry.searchServices('xyz123nonexistent')
      expect(results).toHaveLength(0)
    })
  })

  describe('Service Filtering', () => {
    it('should filter services by category', () => {
      const filters: FilterState = {
        categories: ['education'],
        complexity: [],
        priceRange: { min: 0, max: 0 },
        tags: []
      }
      
      const results = serviceRegistry.filterServices(filters)
      
      expect(results.length).toBeGreaterThan(0)
      results.forEach(service => {
        expect(service.categoryId).toBe('education')
      })
    })

    it('should filter services by complexity', () => {
      const filters: FilterState = {
        categories: [],
        complexity: ['Advanced'],
        priceRange: { min: 0, max: 0 },
        tags: []
      }
      
      const results = serviceRegistry.filterServices(filters)
      
      expect(results.length).toBeGreaterThan(0)
      results.forEach(service => {
        expect(service.complexity).toBe('Advanced')
      })
    })

    it('should filter services by price range', () => {
      const filters: FilterState = {
        categories: [],
        complexity: [],
        priceRange: { min: 100, max: 1000 },
        tags: []
      }
      
      const results = serviceRegistry.filterServices(filters)
      
      results.forEach(service => {
        expect(service.priceRange.min).toBeGreaterThanOrEqual(100)
        expect(service.priceRange.max).toBeLessThanOrEqual(1000)
      })
    })

    it('should filter services by tags', () => {
      const filters: FilterState = {
        categories: [],
        complexity: [],
        priceRange: { min: 0, max: 0 },
        tags: ['rust']
      }
      
      const results = serviceRegistry.filterServices(filters)
      
      expect(results.length).toBeGreaterThan(0)
      results.forEach(service => {
        expect(service.tags.includes('rust')).toBe(true)
      })
    })

    it('should combine multiple filters', () => {
      const filters: FilterState = {
        categories: ['education'],
        complexity: ['Advanced'],
        priceRange: { min: 0, max: 2000 },
        tags: []
      }
      
      const results = serviceRegistry.filterServices(filters)
      
      results.forEach(service => {
        expect(service.categoryId).toBe('education')
        expect(service.complexity).toBe('Advanced')
        expect(service.priceRange.max).toBeLessThanOrEqual(2000)
      })
    })
  })

  describe('Popular Services', () => {
    it('should return only popular services', () => {
      const popularServices = serviceRegistry.getPopularServices()
      
      expect(popularServices.length).toBeGreaterThan(0)
      popularServices.forEach(service => {
        expect(service.isPopular).toBe(true)
        expect(service.isActive).toBe(true)
      })
    })
  })

  describe('Price Calculation', () => {
    it('should calculate total price for selected services', () => {
      const selectedServices = [
        { serviceId: 'basic-consultation', priority: 'Medium' as const },
        { serviceId: 'smart-contract-audit', priority: 'High' as const }
      ]
      
      const total = serviceRegistry.calculateTotalPrice(selectedServices)
      
      expect(total.min).toBeGreaterThan(0)
      expect(total.max).toBeGreaterThan(total.min)
      expect(total.currency).toBe('USD')
    })

    it('should return zero for empty service selection', () => {
      const total = serviceRegistry.calculateTotalPrice([])
      
      expect(total.min).toBe(0)
      expect(total.max).toBe(0)
      expect(total.currency).toBe('USD')
    })
  })

  describe('Order Management', () => {
    it('should generate unique order IDs', () => {
      const orderId1 = serviceRegistry.generateOrderId()
      const orderId2 = serviceRegistry.generateOrderId()
      
      expect(orderId1).not.toBe(orderId2)
      expect(orderId1).toMatch(/^ORD-\\d+-[A-Z0-9]+$/)
      expect(orderId2).toMatch(/^ORD-\\d+-[A-Z0-9]+$/)
    })

    it('should validate complete order data', () => {
      const validOrderData: OrderFormData = {
        selectedServices: [{ serviceId: 'basic-consultation', priority: 'Medium' }],
        projectDetails: {
          title: 'Test Project',
          description: 'Test description',
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
      
      const validation = serviceRegistry.validateOrderData(validOrderData)
      
      expect(validation.isValid).toBe(true)
      expect(validation.errors).toHaveLength(0)
    })

    it('should validate incomplete order data', () => {
      const invalidOrderData: Partial<OrderFormData> = {
        selectedServices: [],
        projectDetails: {
          title: '',
          description: '',
          objectives: [],
          constraints: []
        }
      }
      
      const validation = serviceRegistry.validateOrderData(invalidOrderData)
      
      expect(validation.isValid).toBe(false)
      expect(validation.errors.length).toBeGreaterThan(0)
      expect(validation.errors).toContain('At least one service must be selected')
      expect(validation.errors).toContain('Project title is required')
    })
  })

  describe('Price Formatting', () => {
    it('should format price range in English', () => {
      const priceRange = { min: 100, max: 500, currency: 'USD' }
      const formatted = serviceRegistry.formatPriceRange(priceRange, 'en')
      
      expect(formatted).toMatch(/\\$100.*\\$500/)
    })

    it('should format price range in Russian', () => {
      const priceRange = { min: 100, max: 500, currency: 'USD' }
      const formatted = serviceRegistry.formatPriceRange(priceRange, 'ru')
      
      expect(formatted).toContain('100')
      expect(formatted).toContain('500')
    })

    it('should format single price when min equals max', () => {
      const priceRange = { min: 150, max: 150, currency: 'USD' }
      const formatted = serviceRegistry.formatPriceRange(priceRange, 'en')
      
      expect(formatted).toBe('$150')
    })
  })

  describe('Services by Complexity', () => {
    it('should return services filtered by complexity level', () => {
      const basicServices = serviceRegistry.getServicesByComplexity('Basic')
      const advancedServices = serviceRegistry.getServicesByComplexity('Advanced')
      const enterpriseServices = serviceRegistry.getServicesByComplexity('Enterprise')
      
      basicServices.forEach(service => {
        expect(service.complexity).toBe('Basic')
      })
      
      advancedServices.forEach(service => {
        expect(service.complexity).toBe('Advanced')
      })
      
      enterpriseServices.forEach(service => {
        expect(service.complexity).toBe('Enterprise')
      })
    })
  })
})