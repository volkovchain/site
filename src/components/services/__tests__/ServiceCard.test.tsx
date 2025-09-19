import { describe, it, expect, beforeEach, vi } from 'vitest'
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { ServiceCard } from '@/components/services/ServiceCard'
import type { Service } from '@/types'

// Mock framer-motion
vi.mock('framer-motion', () => ({
  motion: {
    div: ({ children, ...props }: any) => <div {...props}>{children}</div>
  }
}))

// Mock serviceRegistry
vi.mock('@/lib/serviceRegistry', () => ({
  serviceRegistry: {
    formatPriceRange: vi.fn(() => '$100 - $200')
  }
}))

const mockService: Service = {
  serviceId: 'test-service',
  categoryId: 'education',
  name: {
    ru: 'Тестовая услуга',
    en: 'Test Service'
  },
  shortDescription: {
    ru: 'Краткое описание',
    en: 'Short description'
  },
  fullDescription: {
    ru: 'Полное описание услуги',
    en: 'Full service description'
  },
  features: [
    'Feature 1',
    'Feature 2',
    'Feature 3'
  ],
  deliverables: [
    'Deliverable 1',
    'Deliverable 2'
  ],
  timeline: '2-4 weeks',
  priceRange: {
    min: 100,
    max: 200,
    currency: 'USD'
  },
  complexity: 'Advanced',
  tags: ['test', 'education'],
  isPopular: false,
  isCustomizable: true,
  isActive: true,
  metadata: {
    estimatedDeliveryDays: 21,
    requiresDiscovery: false,
    teamSize: '1 instructor',
    supportLevel: 'Standard',
    displayOrder: 1
  }
}

const mockPopularService: Service = {
  ...mockService,
  serviceId: 'popular-service',
  isPopular: true
}

describe('ServiceCard', () => {
  const mockOnSelect = vi.fn()

  beforeEach(() => {
    vi.clearAllMocks()
  })

  describe('Basic Rendering', () => {
    it('should render service information in English', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('Test Service')).toBeInTheDocument()
      expect(screen.getByText('Short description')).toBeInTheDocument()
      expect(screen.getByText('Advanced')).toBeInTheDocument()
      expect(screen.getByText('2-4 weeks')).toBeInTheDocument()
    })

    it('should render service information in Russian', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="ru"
        />
      )

      expect(screen.getByText('Тестовая услуга')).toBeInTheDocument()
      expect(screen.getByText('Краткое описание')).toBeInTheDocument()
    })

    it('should display popular badge for popular services', () => {
      render(
        <ServiceCard
          service={mockPopularService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('Popular')).toBeInTheDocument()
    })

    it('should display selection indicator when selected', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
          isSelected={true}
        />
      )

      expect(screen.getByText('✓ Selected')).toBeInTheDocument()
    })
  })

  describe('Features Display', () => {
    it('should display service features', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText("What's included:")).toBeInTheDocument()
      expect(screen.getByText('Feature 1')).toBeInTheDocument()
      expect(screen.getByText('Feature 2')).toBeInTheDocument()
      expect(screen.getByText('Feature 3')).toBeInTheDocument()
    })

    it('should show limited features in compact mode', () => {
      const serviceWithManyFeatures = {
        ...mockService,
        features: ['F1', 'F2', 'F3', 'F4', 'F5', 'F6']
      }

      render(
        <ServiceCard
          service={serviceWithManyFeatures}
          onSelect={mockOnSelect}
          language="en"
          compact={false}
        />
      )

      expect(screen.getByText('F1')).toBeInTheDocument()
      expect(screen.getByText('F4')).toBeInTheDocument()
      expect(screen.getByText('+2 more')).toBeInTheDocument()
    })

    it('should display deliverables when showFullDescription is true', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
          showFullDescription={true}
        />
      )

      expect(screen.getByText('Deliverables:')).toBeInTheDocument()
      expect(screen.getByText('Deliverable 1')).toBeInTheDocument()
      expect(screen.getByText('Deliverable 2')).toBeInTheDocument()
    })
  })

  describe('Compact Mode', () => {
    it('should hide features in compact mode', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
          compact={true}
        />
      )

      expect(screen.queryByText("What's included:")).not.toBeInTheDocument()
    })

    it('should hide tags in compact mode', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
          compact={true}
        />
      )

      expect(screen.queryByText('test')).not.toBeInTheDocument()
    })
  })

  describe('Interactions', () => {
    it('should call onSelect when clicked', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      const selectButton = screen.getByText('Select Service')
      fireEvent.click(selectButton)

      expect(mockOnSelect).toHaveBeenCalledTimes(1)
    })

    it('should show different button text when selected', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
          isSelected={true}
        />
      )

      expect(screen.getByText('✓ Selected')).toBeInTheDocument()
      expect(screen.queryByText('Select Service')).not.toBeInTheDocument()
    })
  })

  describe('Styling and CSS Classes', () => {
    it('should apply selected styles when isSelected is true', () => {
      const { container } = render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
          isSelected={true}
        />
      )

      const card = container.querySelector('[class*=\"ring-2 ring-primary\"]')
      expect(card).toBeInTheDocument()
    })

    it('should apply popular service border when service is popular', () => {
      const { container } = render(
        <ServiceCard
          service={mockPopularService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      const card = container.querySelector('[class*=\"border-primary\"]')
      expect(card).toBeInTheDocument()
    })

    it('should apply correct complexity badge colors', () => {
      const basicService = { ...mockService, complexity: 'Basic' as const }
      const enterpriseService = { ...mockService, complexity: 'Enterprise' as const }

      const { rerender } = render(
        <ServiceCard
          service={basicService}
          onSelect={mockOnSelect}
          language="en"
        />
      )
      
      expect(screen.getByText('Basic')).toHaveClass('bg-green-100')

      rerender(
        <ServiceCard
          service={enterpriseService}
          onSelect={mockOnSelect}
          language="en"
        />
      )
      
      expect(screen.getByText('Enterprise')).toHaveClass('bg-red-100')
    })
  })

  describe('Metadata Display', () => {
    it('should display support level and team size', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('Standard Support')).toBeInTheDocument()
      expect(screen.getByText('1 instructor')).toBeInTheDocument()
    })

    it('should show discovery requirement warning', () => {
      const serviceWithDiscovery = {
        ...mockService,
        metadata: {
          ...mockService.metadata,
          requiresDiscovery: true
        }
      }

      render(
        <ServiceCard
          service={serviceWithDiscovery}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('* Discovery phase required')).toBeInTheDocument()
    })

    it('should display customization note for customizable services', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('Customizable to your requirements')).toBeInTheDocument()
    })
  })

  describe('Price Display', () => {
    it('should display formatted price range', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('$100 - $200')).toBeInTheDocument()
    })

    it('should display price note if available', () => {
      const serviceWithPriceNote = {
        ...mockService,
        priceRange: {
          ...mockService.priceRange,
          note: {
            ru: 'Зависит от объема',
            en: 'Depends on scope'
          }
        }
      }

      render(
        <ServiceCard
          service={serviceWithPriceNote}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('Depends on scope')).toBeInTheDocument()
    })
  })

  describe('Tags Display', () => {
    it('should display service tags', () => {
      render(
        <ServiceCard
          service={mockService}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('test')).toBeInTheDocument()
      expect(screen.getByText('education')).toBeInTheDocument()
    })

    it('should limit tag display and show count for excess tags', () => {
      const serviceWithManyTags = {
        ...mockService,
        tags: ['tag1', 'tag2', 'tag3', 'tag4', 'tag5']
      }

      render(
        <ServiceCard
          service={serviceWithManyTags}
          onSelect={mockOnSelect}
          language="en"
        />
      )

      expect(screen.getByText('tag1')).toBeInTheDocument()
      expect(screen.getByText('tag2')).toBeInTheDocument()
      expect(screen.getByText('tag3')).toBeInTheDocument()
      expect(screen.getByText('+2')).toBeInTheDocument()
    })
  })
})