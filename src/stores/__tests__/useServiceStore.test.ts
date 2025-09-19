import { describe, it, expect, beforeEach, vi } from 'vitest'
import { renderHook, act } from '@testing-library/react'
import useServiceStore from '@/stores/useServiceStore'

// Mock the serviceRegistry
vi.mock('@/lib/serviceRegistry', () => ({
  serviceRegistry: {
    getServiceCategories: vi.fn(() => [
      {
        categoryId: 'education',
        name: { ru: 'Обучение', en: 'Education' },
        services: [
          {
            serviceId: 'test-service',
            name: { ru: 'Тест', en: 'Test' },
            priceRange: { min: 100, max: 200, currency: 'USD' }
          }
        ]
      }
    ]),
    getServiceById: vi.fn((id: string) => 
      id === 'test-service' ? {
        serviceId: 'test-service',
        name: { ru: 'Тест', en: 'Test' },
        priceRange: { min: 100, max: 200, currency: 'USD' }
      } : undefined
    ),
    calculateTotalPrice: vi.fn(() => ({ min: 100, max: 200, currency: 'USD' })),
    validateOrderData: vi.fn(() => ({ isValid: true, errors: [] })),
    filterServices: vi.fn(() => []),
    searchServices: vi.fn(() => []),
    getPopularServices: vi.fn(() => [])
  }
}))

// Mock fetch for API calls
global.fetch = vi.fn()

describe('useServiceStore', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    // Reset store state
    const { result } = renderHook(() => useServiceStore())
    act(() => {
      result.current.resetOrder()
    })
  })

  describe('Service Selection', () => {
    it('should select a service', () => {
      const { result } = renderHook(() => useServiceStore())
      
      act(() => {
        result.current.selectService('test-service')
      })
      
      expect(result.current.selectedServices).toContain('test-service')
      expect(result.current.orderFormData.selectedServices).toHaveLength(1)
      expect(result.current.orderFormData.selectedServices[0].serviceId).toBe('test-service')
    })

    it('should deselect a service when selecting again', () => {
      const { result } = renderHook(() => useServiceStore())
      
      act(() => {
        result.current.selectService('test-service')
      })
      
      expect(result.current.selectedServices).toContain('test-service')
      
      act(() => {
        result.current.selectService('test-service')
      })
      
      expect(result.current.selectedServices).not.toContain('test-service')
      expect(result.current.orderFormData.selectedServices).toHaveLength(0)
    })

    it('should handle multiple service selections', () => {
      const { result } = renderHook(() => useServiceStore())
      
      act(() => {
        result.current.selectService('test-service')
        result.current.selectService('another-service')
      })
      
      expect(result.current.selectedServices).toHaveLength(2)
      expect(result.current.selectedServices).toContain('test-service')
      expect(result.current.selectedServices).toContain('another-service')
    })
  })

  describe('Order Form Management', () => {
    it('should update order form data', () => {
      const { result } = renderHook(() => useServiceStore())
      
      const projectData = {
        projectDetails: {
          title: 'Test Project',
          description: 'Test Description',
          objectives: ['Objective 1'],
          constraints: []
        }
      }
      
      act(() => {
        result.current.updateOrderForm(projectData)
      })
      
      expect(result.current.orderFormData.projectDetails.title).toBe('Test Project')
      expect(result.current.orderFormData.projectDetails.description).toBe('Test Description')
    })

    it('should navigate form steps', () => {
      const { result } = renderHook(() => useServiceStore())
      
      expect(result.current.currentFormStep).toBe(0)
      
      act(() => {
        result.current.setFormStep(2)
      })
      
      expect(result.current.currentFormStep).toBe(2)
    })

    it('should reset order form', () => {
      const { result } = renderHook(() => useServiceStore())
      
      // First, add some data
      act(() => {
        result.current.selectService('test-service')
        result.current.setFormStep(2)
        result.current.updateOrderForm({
          projectDetails: {
            title: 'Test',
            description: 'Test',
            objectives: [],
            constraints: []
          }
        })
      })
      
      expect(result.current.selectedServices).toHaveLength(1)
      expect(result.current.currentFormStep).toBe(2)
      
      // Reset
      act(() => {
        result.current.resetOrder()
      })
      
      expect(result.current.selectedServices).toHaveLength(0)
      expect(result.current.currentFormStep).toBe(0)
      expect(result.current.orderFormData.projectDetails.title).toBe('')
    })
  })

  describe('Form Validation', () => {
    it('should validate form step successfully', () => {
      const { result } = renderHook(() => useServiceStore())
      
      // Add valid data
      act(() => {
        result.current.selectService('test-service')
      })
      
      let isValid = false
      act(() => {
        isValid = result.current.validateFormStep(0) // Service selection step
      })
      
      expect(isValid).toBe(true)
    })

    it('should fail validation for empty service selection', () => {
      const { result } = renderHook(() => useServiceStore())
      
      let isValid = true
      act(() => {
        isValid = result.current.validateFormStep(0) // Service selection step
      })
      
      expect(isValid).toBe(false)
      expect(result.current.formValidation.selectedServices?.isValid).toBe(false)
    })

    it('should validate project details step', () => {
      const { result } = renderHook(() => useServiceStore())
      
      // Test without project title
      let isValid = true
      act(() => {
        isValid = result.current.validateFormStep(1) // Project details step
      })
      
      expect(isValid).toBe(false)
      expect(result.current.formValidation.projectTitle?.isValid).toBe(false)
      
      // Add valid project data
      act(() => {
        result.current.updateOrderForm({
          projectDetails: {
            title: 'Valid Title',
            description: 'Valid Description',
            objectives: [],
            constraints: []
          }
        })
      })
      
      act(() => {
        isValid = result.current.validateFormStep(1)
      })
      
      expect(isValid).toBe(true)
    })

    it('should validate contact information step', () => {
      const { result } = renderHook(() => useServiceStore())
      
      // Test with invalid email
      act(() => {
        result.current.updateOrderForm({
          contactInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'invalid-email',
            timezone: 'UTC',
            communicationChannels: {}
          }
        })
      })
      
      let isValid = true
      act(() => {
        isValid = result.current.validateFormStep(2) // Contact info step
      })
      
      expect(isValid).toBe(false)
      expect(result.current.formValidation.email?.isValid).toBe(false)
      
      // Fix email
      act(() => {
        result.current.updateOrderForm({
          contactInfo: {
            firstName: 'John',
            lastName: 'Doe',
            email: 'john@example.com',
            timezone: 'UTC',
            communicationChannels: {}
          }
        })
      })
      
      act(() => {
        isValid = result.current.validateFormStep(2)
      })
      
      expect(isValid).toBe(true)
    })

    it('should validate terms agreement', () => {
      const { result } = renderHook(() => useServiceStore())
      
      // Test without agreeing to terms
      let isValid = true
      act(() => {
        isValid = result.current.validateFormStep(4) // Review step
      })
      
      expect(isValid).toBe(false)
      expect(result.current.formValidation.agreesToTerms?.isValid).toBe(false)
      
      // Agree to terms
      act(() => {
        result.current.updateOrderForm({ agreesToTerms: true })
      })
      
      act(() => {
        isValid = result.current.validateFormStep(4)
      })
      
      expect(isValid).toBe(true)
    })
  })

  describe('Order Submission', () => {
    it('should submit order successfully', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: true,
        json: async () => ({ success: true, orderId: 'ORD-123' })
      } as Response)
      
      const { result } = renderHook(() => useServiceStore())
      
      // Prepare valid order data
      const validOrderData = {
        selectedServices: [{ serviceId: 'test-service', priority: 'Medium' as const }],
        projectDetails: {
          title: 'Test Project',
          description: 'Test Description',
          objectives: [],
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
        preferredCommunication: 'email' as const,
        timeline: 'standard' as const
      }
      
      let submissionResult: any
      await act(async () => {
        submissionResult = await result.current.submitOrder(validOrderData)
      })
      
      expect(mockFetch).toHaveBeenCalledWith('/api/order/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(validOrderData)
      })
      
      expect(submissionResult.success).toBe(true)
      expect(result.current.isSubmittingOrder).toBe(false)
    })

    it('should handle submission failure', async () => {
      const mockFetch = vi.mocked(fetch)
      mockFetch.mockResolvedValueOnce({
        ok: false,
        json: async () => ({ error: 'Submission failed' })
      } as Response)
      
      const { result } = renderHook(() => useServiceStore())
      
      const invalidOrderData = {
        selectedServices: [],
        projectDetails: { title: '', description: '', objectives: [], constraints: [] },
        contactInfo: { firstName: '', lastName: '', email: '', timezone: 'UTC', communicationChannels: {} },
        technicalInfo: { hasExistingCode: false, preferredTechStack: [], requiredIntegrations: [] },
        agreesToTerms: false,
        marketingOptIn: false,
        preferredCommunication: 'email' as const,
        timeline: 'standard' as const
      }
      
      await expect(async () => {
        await act(async () => {
          await result.current.submitOrder(invalidOrderData)
        })
      }).rejects.toThrow()
      
      expect(result.current.isSubmittingOrder).toBe(false)
    })
  })

  describe('Helper Methods', () => {
    it('should load service categories', () => {
      const { result } = renderHook(() => useServiceStore())
      
      act(() => {
        result.current.loadServiceCategories()
      })
      
      expect(result.current.serviceCategories).toHaveLength(1)
      expect(result.current.serviceCategories[0].categoryId).toBe('education')
    })

    it('should get selected service details', () => {
      const { result } = renderHook(() => useServiceStore())
      
      act(() => {
        result.current.selectService('test-service')
      })
      
      const selectedDetails = result.current.getSelectedServiceDetails()
      expect(selectedDetails).toHaveLength(1)
      expect(selectedDetails[0]?.serviceId).toBe('test-service')
    })

    it('should calculate total price', () => {
      const { result } = renderHook(() => useServiceStore())
      
      act(() => {
        result.current.selectService('test-service')
      })
      
      const totalPrice = result.current.getTotalPrice()
      expect(totalPrice.min).toBe(100)
      expect(totalPrice.max).toBe(200)
      expect(totalPrice.currency).toBe('USD')
    })

    it('should calculate form progress', () => {
      const { result } = renderHook(() => useServiceStore())
      
      expect(result.current.getFormProgress()).toBe(20) // Step 1 of 5
      
      act(() => {
        result.current.setFormStep(2)
      })
      
      expect(result.current.getFormProgress()).toBe(60) // Step 3 of 5
    })
  })

  describe('UI State Management', () => {
    it('should manage order form visibility', () => {
      const { result } = renderHook(() => useServiceStore())
      
      expect(result.current.isOrderFormOpen).toBe(false)
      
      act(() => {
        result.current.openOrderForm()
      })
      
      expect(result.current.isOrderFormOpen).toBe(true)
      expect(result.current.currentFormStep).toBe(0)
      
      act(() => {
        result.current.closeOrderForm()
      })
      
      expect(result.current.isOrderFormOpen).toBe(false)
    })

    it('should manage service modal visibility', () => {
      const { result } = renderHook(() => useServiceStore())
      
      expect(result.current.showServiceModal).toBe(false)
      
      act(() => {
        result.current.showServiceDetails('test-service')
      })
      
      expect(result.current.showServiceModal).toBe(true)
      
      act(() => {
        result.current.hideServiceDetails()
      })
      
      expect(result.current.showServiceModal).toBe(false)
    })
  })

  describe('Filter Management', () => {
    it('should update active filters', () => {
      const { result } = renderHook(() => useServiceStore())
      
      const newFilters = {
        categories: ['education'],
        complexity: ['Advanced'],
        priceRange: { min: 100, max: 1000 },
        tags: ['rust']
      }
      
      act(() => {
        result.current.filterServices(newFilters)
      })
      
      expect(result.current.activeFilters).toEqual(newFilters)
    })

    it('should clear filters', () => {
      const { result } = renderHook(() => useServiceStore())
      
      // Set some filters first
      act(() => {
        result.current.filterServices({
          categories: ['education'],
          complexity: ['Advanced'],
          priceRange: { min: 100, max: 1000 },
          tags: ['rust']
        })
      })
      
      // Clear filters
      act(() => {
        result.current.clearFilters()
      })
      
      expect(result.current.activeFilters).toEqual({
        categories: [],
        complexity: [],
        priceRange: { min: 0, max: 0 },
        tags: []
      })
    })
  })
})