// Core periodic element types
export interface PeriodicElement {
  symbol: string          // Bt, Eth, Vc, etc.
  name: string           // Bitcoin, Ethereum, VolkovChain
  atomicNumber: number   // Sequential number
  category: ElementCategory
  color: string          // Hex color
  description: string    // Technology description
  marketCap?: number     // Market capitalization
  website?: string       // Official website
  documentation?: string // Documentation link
  launchDate?: string    // Launch date
  blockchain?: string    // Underlying blockchain
  consensus?: string     // Consensus mechanism
}

export type ElementCategory = 
  | 'payment-coin'
  | 'smart-contract-platform' 
  | 'defi-protocol'
  | 'layer2-solution'
  | 'stablecoin'
  | 'personal-brand'
  | 'infrastructure'
  | 'privacy-coin'
  | 'nft-platform'

// Application state types
export interface AppState {
  theme: 'light' | 'dark'
  language: 'ru' | 'en'
  user: User | null
  periodicTable: PeriodicTableState
  navigation: NavigationState
}

export interface PeriodicTableState {
  selectedElement: PeriodicElement | null
  filterCategory: ElementCategory | 'all'
  searchQuery: string
  viewMode: '2d' | '3d'
  isLoading: boolean
}

export interface NavigationState {
  isMobileMenuOpen: boolean
  activePage: string
}

export interface User {
  id: string
  name: string
  email: string
  avatar?: string
}

// Video content types
export interface YouTubeVideo {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  publishedAt: string
  duration: string
  viewCount: number
  likeCount?: number
  playlistId?: string
}

export interface VideoPlaylist {
  id: string
  title: string
  description: string
  thumbnailUrl: string
  videoCount: number
  videos: YouTubeVideo[]
}

// Enhanced Blog content types with service integration
export interface ContentPost {
  // Core Content
  id: string
  slug: string
  title: string
  excerpt: string
  content: string // MDX content
  publishedAt: Date
  updatedAt: Date
  status: 'draft' | 'published' | 'archived'
  
  // Content Classification
  type: 'blog' | 'news' | 'tutorial' | 'case-study' | 'opinion'
  category: string
  tags: string[]
  difficulty: 'Beginner' | 'Intermediate' | 'Advanced'
  
  // Service Integration
  targetedServices: string[] // Service IDs from ServiceRegistry
  primaryService?: string    // Main service this post promotes
  conversionGoals: ConversionGoal[]
  
  // SEO & Discovery
  metaTitle: string
  metaDescription: string
  focusKeyword: string
  featuredImage?: string
  
  // Engagement Metrics
  readingTime: number
  views: number
  estimatedConversionValue: number
  
  // Content Enhancement
  ctaBlocks: CTABlock[]
  tableOfContents: TOCItem[]
  featured: boolean
  
  // Legacy compatibility
  author: string
}

export interface ConversionGoal {
  type: 'service_inquiry' | 'consultation_booking' | 'newsletter_signup'
  serviceId?: string
  priority: number
  expectedConversionRate: number
}

export interface CTABlock {
  id: string
  type: 'inline' | 'sidebar' | 'footer'
  position: number
  content: string
  actionText: string
  actionUrl: string
  targetService?: string
  trackingId: string
}

export interface TOCItem {
  id: string
  text: string
  level: number
  children?: TOCItem[]
}

// Legacy BlogPost for backward compatibility
export interface BlogPost {
  id: string
  slug: string
  title: string
  content: string
  excerpt: string
  author: string
  publishedAt: Date
  updatedAt: Date
  tags: string[]
  category: string
  readingTime: number
  tableOfContents?: TOCItem[]
  featured: boolean
}

// Service-Content Integration Types
export interface ServiceContentStrategy {
  serviceId: string
  contentTypes: ('blog' | 'news' | 'tutorial' | 'case-study' | 'opinion')[]
  keywords: string[]
  ctaStrategies: ('consultation_booking' | 'service_inquiry' | 'project_inquiry')[] 
}

export interface PostWithServices extends ContentPost {
  relatedServices: Service[]
  serviceRecommendations: ServiceCTA[]
}

export interface ServiceCTA {
  id: string
  serviceId: string
  service: Service
  ctaText: string
  ctaUrl: string
  priority: number
  placement: 'header' | 'sidebar' | 'inline' | 'footer'
  trackingId: string
}

export interface ContentPerformanceMetrics {
  postId: string
  views: number
  readingTime: number
  conversionEvents: ConversionEvent[]
  serviceInquiries: number
  revenueAttribution: number
}

export interface ConversionEvent {
  id: string
  postId: string
  serviceId: string
  eventType: 'cta_click' | 'service_view' | 'inquiry_submitted'
  timestamp: Date
  source: string
  conversionValue?: number
}

// Multi-Service Platform Types
export interface ServiceCategory {
  categoryId: string
  name: {
    ru: string
    en: string
  }
  description: {
    ru: string
    en: string
  }
  icon: string // Heroicon name or component
  displayOrder: number
  isActive: boolean
  services: Service[]
}

export interface Service {
  serviceId: string
  categoryId: string
  name: {
    ru: string
    en: string
  }
  shortDescription: {
    ru: string
    en: string
  }
  fullDescription: {
    ru: string
    en: string
  }
  features: string[]
  deliverables: string[]
  timeline: string
  priceRange: {
    min: number
    max: number
    currency: 'USD' | 'RUB'
    note?: {
      ru?: string
      en?: string
    }
  }
  complexity: 'Basic' | 'Advanced' | 'Enterprise'
  tags: string[]
  isPopular: boolean
  isCustomizable: boolean
  isActive: boolean
  metadata: {
    estimatedDeliveryDays: number
    requiresDiscovery: boolean
    teamSize?: string
    supportLevel: 'Basic' | 'Standard' | 'Premium'
    displayOrder: number
  }
}

// Order Form Types
export interface OrderFormData {
  selectedServices: SelectedService[]
  projectDetails: ProjectDetails
  contactInfo: ContactInfo
  technicalInfo: TechnicalInfo
  additionalRequirements?: string
  agreesToTerms: boolean
  marketingOptIn: boolean
  preferredCommunication: 'email' | 'telegram' | 'discord' | 'video_call'
  estimatedBudget?: 'under_1k' | '1k_5k' | '5k_15k' | '15k_plus' | 'enterprise'
  timeline: 'rush' | 'standard' | 'flexible' | 'long_term'
}

export interface SelectedService {
  serviceId: string
  customizations?: Record<string, any>
  priority: 'Low' | 'Medium' | 'High'
  estimatedPrice?: {
    min: number
    max: number
    currency: string
  }
}

export interface ProjectDetails {
  title: string
  description: string
  objectives: string[]
  targetAudience?: string
  existingAssets?: string
  constraints: string[]
}

export interface ContactInfo {
  firstName: string
  lastName: string
  email: string
  company?: string
  position?: string
  timezone: string
  preferredContactTime?: string
  communicationChannels: {
    telegram?: string
    discord?: string
    linkedin?: string
  }
}

export interface TechnicalInfo {
  hasExistingCode: boolean
  existingCodeUrl?: string
  existingCodeDescription?: string
  preferredTechStack: string[]
  requiredIntegrations: string[]
  performanceRequirements?: string
  securityRequirements?: string
  scalabilityNeeds?: string
}

// Order Processing Types
export interface Order {
  orderId: string
  customerId?: string
  status: OrderStatus
  orderData: OrderFormData
  calculatedTotal: {
    minPrice: number
    maxPrice: number
    currency: string
  }
  priority: 'normal' | 'medium' | 'high'
  assignedManager?: string
  notes: OrderNote[]
  createdAt: Date
  updatedAt: Date
}

export type OrderStatus = 
  | 'submitted'
  | 'reviewed'
  | 'invoice_sent'
  | 'payment_pending'
  | 'paid'
  | 'in_progress'
  | 'completed'
  | 'cancelled'

export interface OrderNote {
  content: string
  author: string
  timestamp: Date
  type: 'internal' | 'customer'
}

// Invoice Types
export interface Invoice {
  invoiceId: string
  invoiceNumber: string
  orderId: string
  customerId: string
  status: InvoiceStatus
  issueDate: Date
  dueDate: Date
  lineItems: InvoiceLineItem[]
  subtotal: number
  taxAmount: number
  totalAmount: number
  currency: string
  bankingDetails: BankingDetails
  paymentInstructions: {
    ru: string
    en: string
  }
  createdAt: Date
  updatedAt: Date
}

export type InvoiceStatus = 
  | 'draft'
  | 'sent'
  | 'viewed'
  | 'paid'
  | 'overdue'
  | 'cancelled'

export interface InvoiceLineItem {
  description: string
  quantity: number
  unitPrice: number
  adjustments: {
    type: string
    description: string
    amount: number
  }[]
  total: number
}

export interface BankingDetails {
  bankName: string
  accountNumber: string
  routingNumber?: string
  swiftCode?: string
  iban?: string
  beneficiaryName: string
  beneficiaryAddress: string
  correspondentBank?: string
  notes?: {
    ru?: string
    en?: string
  }
}

// Service Store State Types
export interface ServiceStore {
  // Service catalog state
  serviceCategories: ServiceCategory[]
  selectedServices: string[]
  activeFilters: FilterState
  
  // Order form state
  orderFormData: OrderFormData
  currentFormStep: number
  formValidation: ValidationState
  
  // UI state
  showServiceModal: boolean
  isOrderFormOpen: boolean
  isSubmittingOrder: boolean
  
  // Actions
  selectService: (serviceId: string) => void
  updateOrderForm: (data: Partial<OrderFormData>) => void
  submitOrder: (data: OrderFormData) => Promise<any>
  resetOrder: () => void
  setFormStep: (step: number) => void
  validateFormStep: (step: number) => boolean
  
  // Additional helper actions
  loadServiceCategories: () => void
  filterServices: (filters: FilterState) => void
  clearFilters: () => void
  openOrderForm: () => void
  closeOrderForm: () => void
  showServiceDetails: (serviceId: string) => void
  hideServiceDetails: () => void
  
  // Computed getters
  getFilteredServices: () => Service[]
  getSelectedServiceDetails: () => Service[]
  getTotalPrice: () => { min: number; max: number; currency: string }
  getFormProgress: () => number
  
  // Service category helpers
  getServicesByCategory: (categoryId: string) => Service[]
  searchServices: (query: string, language?: 'ru' | 'en') => Service[]
  getPopularServices: () => Service[]
}

export interface FilterState {
  categories: string[]
  complexity: string[]
  priceRange: {
    min: number
    max: number
  }
  tags: string[]
}

export interface ValidationState {
  [fieldName: string]: {
    isValid: boolean
    message?: string
  }
}

// Legacy Consulting Types (for backward compatibility)
export interface ConsultationService {
  id: string
  name: string
  description: string
  price: number
  duration: number // in hours
  features: string[]
  popular?: boolean
}

export interface BookingRequest {
  serviceId: string
  clientName: string
  clientEmail: string
  preferredDate: Date
  message?: string
  timezone: string
}