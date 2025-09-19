import { render, RenderOptions } from '@testing-library/react'
import { ReactElement } from 'react'
import { vi } from 'vitest'

// Mock data for testing
export const mockPeriodicElement = {
  symbol: 'Bt',
  name: 'Bitcoin',
  atomicNumber: 1,
  category: 'payment-coin' as const,
  color: '#F7931A',
  description: 'The first and most well-known cryptocurrency.',
  website: 'https://bitcoin.org',
  marketCap: 800000000000,
  consensus: 'Proof of Work',
  yearCreated: 2009
}

export const mockBlogPost = {
  slug: 'test-post',
  title: 'Test Blog Post',
  description: 'A test blog post for unit testing',
  publishedAt: '2024-01-01',
  author: 'Test Author',
  category: 'Technology',
  tags: ['test', 'javascript'],
  readingTime: '5 min read',
  featured: false,
  content: '# Test Content\n\nThis is test content.'
}

export const mockConsultationService = {
  id: 'basic',
  name: 'Basic Consultation',
  description: 'One-time consultation for specific questions',
  price: 150,
  duration: 1,
  features: ['Technical review', 'Code review'],
  popular: false
}

export const mockYouTubeVideo = {
  id: 'test-video-id',
  title: 'Test Video',
  description: 'A test video description',
  thumbnail: 'https://example.com/thumbnail.jpg',
  publishedAt: '2024-01-01',
  duration: '10:30',
  viewCount: 1000,
  url: 'https://youtube.com/watch?v=test-video-id'
}

// Custom render function that includes providers
const customRender = (ui: ReactElement, options?: RenderOptions) => {
  return render(ui, {
    // Add any providers here if needed
    wrapper: ({ children }) => <div>{children}</div>,
    ...options,
  })
}

// Helper to create mock store
export const createMockStore = () => ({
  theme: 'dark' as const,
  language: 'en' as const,
  user: null,
  periodicTable: {
    selectedElement: null,
    filterCategory: 'all' as const,
    searchQuery: '',
    viewMode: '3d' as const,
    isLoading: false
  },
  navigation: {
    isMobileMenuOpen: false,
    activePage: '/'
  },
  setTheme: vi.fn(),
  setLanguage: vi.fn(),
  toggleTheme: vi.fn(),
  setUser: vi.fn(),
  updatePeriodicTable: vi.fn(),
  setSelectedElement: vi.fn(),
  setFilterCategory: vi.fn(),
  setSearchQuery: vi.fn(),
  setViewMode: vi.fn(),
  setIsLoading: vi.fn(),
  toggleMobileMenu: vi.fn(),
  closeMobileMenu: vi.fn(),
  setActivePage: vi.fn()
})

// Helper to mock fetch responses
export const mockFetch = (response: any, ok = true) => {
  global.fetch = vi.fn().mockResolvedValue({
    ok,
    json: async () => response,
    text: async () => JSON.stringify(response),
    status: ok ? 200 : 400,
    statusText: ok ? 'OK' : 'Bad Request'
  })
}

// Helper to wait for animations/async operations
export const waitForAnimation = () => new Promise(resolve => setTimeout(resolve, 0))

// Helper to create mock event
export const createMockEvent = (type: string, props: any = {}) => ({
  type,
  preventDefault: vi.fn(),
  stopPropagation: vi.fn(),
  target: { value: '' },
  currentTarget: { value: '' },
  ...props
})

// Export everything including the custom render
export * from '@testing-library/react'
export { customRender as render }