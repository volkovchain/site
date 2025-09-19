import { create } from 'zustand'
import { devtools, persist } from 'zustand/middleware'
import type {
  ServiceCategory,
  Service,
  ServiceStore,
  OrderFormData,
  SelectedService,
  FilterState,
  ValidationState,
  Order
} from '@/types'
import { serviceRegistry } from '@/lib/serviceRegistry'

// Initial states
const initialOrderFormData: OrderFormData = {
  selectedServices: [],
  projectDetails: {
    title: '',
    description: '',
    objectives: [],
    constraints: []
  },
  contactInfo: {
    firstName: '',
    lastName: '',
    email: '',
    timezone: 'UTC',
    communicationChannels: {}
  },
  technicalInfo: {
    hasExistingCode: false,
    preferredTechStack: [],
    requiredIntegrations: []
  },
  agreesToTerms: false,
  marketingOptIn: false,
  preferredCommunication: 'email',
  timeline: 'standard'
}

const initialFilters: FilterState = {
  categories: [],
  complexity: [],
  priceRange: { min: 0, max: 0 },
  tags: []
}

const initialValidation: ValidationState = {}

// Zustand store implementation
export const useServiceStore = create<ServiceStore>()(
  devtools(
    persist(
      (set, get) => ({
        // Service catalog state
        serviceCategories: [],
        selectedServices: [],
        activeFilters: initialFilters,
        
        // Order form state
        orderFormData: initialOrderFormData,
        currentFormStep: 0,
        formValidation: initialValidation,
        
        // UI state
        showServiceModal: false,
        isOrderFormOpen: false,
        isSubmittingOrder: false,
        
        // Actions
        selectService: (serviceId: string) => {
          const { selectedServices } = get()
          const isSelected = selectedServices.includes(serviceId)
          
          const newSelectedServices = isSelected
            ? selectedServices.filter(id => id !== serviceId)
            : [...selectedServices, serviceId]
          
          // Update selected services in order form data
          const service = serviceRegistry.getServiceById(serviceId)
          if (service && !isSelected) {
            const selectedService: SelectedService = {
              serviceId,
              priority: 'Medium',
              estimatedPrice: {
                min: service.priceRange.min,
                max: service.priceRange.max,
                currency: service.priceRange.currency
              }
            }
            
            set(state => ({
              selectedServices: newSelectedServices,
              orderFormData: {
                ...state.orderFormData,
                selectedServices: isSelected
                  ? state.orderFormData.selectedServices.filter(s => s.serviceId !== serviceId)
                  : [...state.orderFormData.selectedServices, selectedService]
              }
            }))
          } else {
            set(state => ({
              selectedServices: newSelectedServices,
              orderFormData: {
                ...state.orderFormData,
                selectedServices: state.orderFormData.selectedServices.filter(s => s.serviceId !== serviceId)
              }
            }))
          }
        },
        
        updateOrderForm: (data: Partial<OrderFormData>) => {
          set(state => ({
            orderFormData: { ...state.orderFormData, ...data }
          }))
        },
        
        submitOrder: async (data: OrderFormData) => {
          set({ isSubmittingOrder: true })
          
          try {
            // Validate order data
            const validation = serviceRegistry.validateOrderData(data)
            if (!validation.isValid) {
              throw new Error(`Validation failed: ${validation.errors.join(', ')}`)
            }
            
            // Submit order to API
            const response = await fetch('/api/order/submit', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify(data),
            })
            
            if (!response.ok) {
              const errorData = await response.json()
              throw new Error(errorData.message || 'Failed to submit order')
            }
            
            const result = await response.json()
            
            // Reset form on success
            set({
              isSubmittingOrder: false,
              orderFormData: initialOrderFormData,
              selectedServices: [],
              currentFormStep: 0,
              isOrderFormOpen: false,
              formValidation: initialValidation
            })
            
            return result
          } catch (error) {
            set({ isSubmittingOrder: false })
            throw error
          }
        },
        
        resetOrder: () => {
          set({
            orderFormData: initialOrderFormData,
            selectedServices: [],
            currentFormStep: 0,
            formValidation: initialValidation,
            isOrderFormOpen: false
          })
        },
        
        setFormStep: (step: number) => {
          set({ currentFormStep: step })
        },
        
        validateFormStep: (step: number) => {
          const { orderFormData } = get()
          const errors: ValidationState = {}
          
          switch (step) {
            case 0: // Service selection
              if (orderFormData.selectedServices.length === 0) {
                errors.selectedServices = {
                  isValid: false,
                  message: 'Please select at least one service'
                }
              }
              break
              
            case 1: // Project details
              if (!orderFormData.projectDetails.title.trim()) {
                errors.projectTitle = {
                  isValid: false,
                  message: 'Project title is required'
                }
              }
              if (!orderFormData.projectDetails.description.trim()) {
                errors.projectDescription = {
                  isValid: false,
                  message: 'Project description is required'
                }
              }
              break
              
            case 2: // Contact information
              if (!orderFormData.contactInfo.firstName.trim()) {
                errors.firstName = {
                  isValid: false,
                  message: 'First name is required'
                }
              }
              if (!orderFormData.contactInfo.lastName.trim()) {
                errors.lastName = {
                  isValid: false,
                  message: 'Last name is required'
                }
              }
              if (!orderFormData.contactInfo.email.trim()) {
                errors.email = {
                  isValid: false,
                  message: 'Email is required'
                }
              } else if (!/^[^\\s@]+@[^\\s@]+\\.[^\\s@]+$/.test(orderFormData.contactInfo.email)) {
                errors.email = {
                  isValid: false,
                  message: 'Please enter a valid email address'
                }
              }
              break
              
            case 4: // Final review
              if (!orderFormData.agreesToTerms) {
                errors.agreesToTerms = {
                  isValid: false,
                  message: 'You must agree to the terms and conditions'
                }
              }
              break
          }
          
          set({ formValidation: errors })
          return Object.keys(errors).length === 0
        },
        
        // Additional helper actions
        loadServiceCategories: () => {
          const categories = serviceRegistry.getServiceCategories()
          set({ serviceCategories: categories })
        },
        
        filterServices: (filters: FilterState) => {
          set({ activeFilters: filters })
        },
        
        clearFilters: () => {
          set({ activeFilters: initialFilters })
        },
        
        openOrderForm: () => {
          set({ isOrderFormOpen: true, currentFormStep: 0 })
        },
        
        closeOrderForm: () => {
          set({ isOrderFormOpen: false })
        },
        
        showServiceDetails: (serviceId: string) => {
          set({ showServiceModal: true })
        },
        
        hideServiceDetails: () => {
          set({ showServiceModal: false })
        },
        
        // Computed getters
        getFilteredServices: () => {
          const { activeFilters } = get()
          return serviceRegistry.filterServices(activeFilters)
        },
        
        getSelectedServiceDetails: () => {
          const { selectedServices } = get()
          return selectedServices.map(serviceId => 
            serviceRegistry.getServiceById(serviceId)
          ).filter(Boolean) as Service[]
        },
        
        getTotalPrice: () => {
          const { orderFormData } = get()
          return serviceRegistry.calculateTotalPrice(orderFormData.selectedServices)
        },
        
        getFormProgress: () => {
          const { currentFormStep } = get()
          const totalSteps = 5 // service, project, contact, technical, review
          return ((currentFormStep + 1) / totalSteps) * 100
        },
        
        // Service category helpers
        getServicesByCategory: (categoryId: string) => {
          return serviceRegistry.getServicesByCategory(categoryId)
        },
        
        searchServices: (query: string, language: 'ru' | 'en' = 'en') => {
          return serviceRegistry.searchServices(query, language)
        },
        
        getPopularServices: () => {
          return serviceRegistry.getPopularServices()
        }
      })
    ),
    {
      name: 'volkovchain-service-store',
      partialize: (state) => ({
        // Only persist selected services and form data, not UI state
        selectedServices: state.selectedServices,
        orderFormData: state.orderFormData,
        currentFormStep: state.currentFormStep,
        activeFilters: state.activeFilters
      })
    }
  )
)

// Export hook for component usage
export default useServiceStore

// Export additional computed selectors for performance
export const useSelectedServices = () => useServiceStore((state) => state.selectedServices)
export const useOrderFormData = () => useServiceStore((state) => state.orderFormData)
export const useFormStep = () => useServiceStore((state) => state.currentFormStep)
export const useFormValidation = () => useServiceStore((state) => state.formValidation)
export const useServiceFilters = () => useServiceStore((state) => state.activeFilters)
export const useUIState = () => useServiceStore((state) => ({
  showServiceModal: state.showServiceModal,
  isOrderFormOpen: state.isOrderFormOpen,
  isSubmittingOrder: state.isSubmittingOrder
}))