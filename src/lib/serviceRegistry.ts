import type { 
  ServiceCategory, 
  Service, 
  OrderFormData, 
  SelectedService, 
  FilterState,
  Order,
  OrderStatus 
} from '@/types'

/**
 * ServiceRegistry - Unified service management system
 * Handles service catalog, filtering, pricing, and order processing
 */
export class ServiceRegistry {
  private serviceCategories: ServiceCategory[] = []
  private services: Service[] = []
  private orders: Order[] = []

  constructor() {
    this.initializeServices()
  }

  /**
   * Initialize service catalog with all available services
   */
  private initializeServices(): void {
    this.serviceCategories = [
      {
        categoryId: 'education',
        name: {
          ru: 'Обучение',
          en: 'Education'
        },
        description: {
          ru: 'Курсы и тренинги по блокчейн-разработке',
          en: 'Blockchain development courses and training'
        },
        icon: 'AcademicCapIcon',
        displayOrder: 1,
        isActive: true,
        services: []
      },
      {
        categoryId: 'development',
        name: {
          ru: 'Разработка',
          en: 'Development'
        },
        description: {
          ru: 'Разработка блокчейн-приложений и смарт-контрактов',
          en: 'Blockchain application and smart contract development'
        },
        icon: 'CodeBracketIcon',
        displayOrder: 2,
        isActive: true,
        services: []
      },
      {
        categoryId: 'consulting',
        name: {
          ru: 'Консультации',
          en: 'Consulting'
        },
        description: {
          ru: 'Экспертные консультации по блокчейн-проектам',
          en: 'Expert blockchain project consulting'
        },
        icon: 'ChatBubbleLeftRightIcon',
        displayOrder: 3,
        isActive: true,
        services: []
      },
      {
        categoryId: 'content',
        name: {
          ru: 'Контент',
          en: 'Content'
        },
        description: {
          ru: 'Создание образовательного и технического контента',
          en: 'Educational and technical content creation'
        },
        icon: 'DocumentTextIcon',
        displayOrder: 4,
        isActive: true,
        services: []
      }
    ]

    this.services = [
      // Education Services
      {
        serviceId: 'rust-blockchain-course',
        categoryId: 'education',
        name: {
          ru: 'Курс Rust для блокчейна',
          en: 'Rust for Blockchain Course'
        },
        shortDescription: {
          ru: 'Интенсивный курс по Rust для разработки блокчейн-приложений',
          en: 'Intensive Rust course for blockchain application development'
        },
        fullDescription: {
          ru: 'Полный курс по изучению языка Rust с фокусом на блокчейн-разработку. Включает практические проекты и реальные кейсы.',
          en: 'Complete Rust language course focused on blockchain development. Includes hands-on projects and real-world case studies.'
        },
        features: [
          'Video lessons with practical examples',
          'Hands-on coding exercises',
          'Real blockchain project development',
          'Code review and feedback',
          'Certificate of completion',
          '6 months access to materials'
        ],
        deliverables: [
          'Access to comprehensive video course',
          'Downloadable code examples',
          'Project templates and boilerplates',
          'Personal mentorship sessions',
          'Course completion certificate'
        ],
        timeline: '8-12 weeks',
        priceRange: {
          min: 800,
          max: 1200,
          currency: 'USD',
          note: {
            ru: 'Цена зависит от уровня поддержки',
            en: 'Price depends on support level'
          }
        },
        complexity: 'Advanced',
        tags: ['rust', 'blockchain', 'education', 'programming'],
        isPopular: true,
        isCustomizable: true,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 84,
          requiresDiscovery: false,
          teamSize: '1 instructor',
          supportLevel: 'Premium',
          displayOrder: 1
        }
      },
      {
        serviceId: 'solidity-masterclass',
        categoryId: 'education',
        name: {
          ru: 'Мастер-класс по Solidity',
          en: 'Solidity Masterclass'
        },
        shortDescription: {
          ru: 'Продвинутый курс по разработке смарт-контрактов на Solidity',
          en: 'Advanced smart contract development course in Solidity'
        },
        fullDescription: {
          ru: 'Глубокое изучение Solidity с акцентом на безопасность, оптимизацию и лучшие практики разработки смарт-контрактов.',
          en: 'Deep dive into Solidity with focus on security, optimization, and smart contract development best practices.'
        },
        features: [
          'Advanced Solidity patterns',
          'Security audit techniques',
          'Gas optimization strategies',
          'DeFi protocol development',
          'Testing and deployment',
          'Live coding sessions'
        ],
        deliverables: [
          'Video course library',
          'Smart contract templates',
          'Security checklist',
          'Deployment scripts',
          'Testing frameworks setup'
        ],
        timeline: '6-8 weeks',
        priceRange: {
          min: 600,
          max: 900,
          currency: 'USD'
        },
        complexity: 'Advanced',
        tags: ['solidity', 'ethereum', 'smart-contracts', 'defi'],
        isPopular: false,
        isCustomizable: true,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 56,
          requiresDiscovery: false,
          teamSize: '1 instructor',
          supportLevel: 'Standard',
          displayOrder: 2
        }
      },

      // Development Services
      {
        serviceId: 'custom-blockchain-dev',
        categoryId: 'development',
        name: {
          ru: 'Разработка кастомного блокчейна',
          en: 'Custom Blockchain Development'
        },
        shortDescription: {
          ru: 'Создание собственного блокчейна под ваши требования',
          en: 'Build your own blockchain tailored to your requirements'
        },
        fullDescription: {
          ru: 'Полный цикл разработки кастомного блокчейна: от концепции и архитектуры до реализации и деплоя. Включает токеномику, консенсус и экосистему.',
          en: 'Full-cycle custom blockchain development: from concept and architecture to implementation and deployment. Includes tokenomics, consensus, and ecosystem.'
        },
        features: [
          'Custom consensus mechanism',
          'Native token implementation',
          'Smart contract platform',
          'Explorer and wallet',
          'Network infrastructure',
          'Documentation and training'
        ],
        deliverables: [
          'Complete blockchain implementation',
          'Network deployment',
          'Block explorer',
          'Wallet application',
          'Technical documentation',
          'Team training sessions'
        ],
        timeline: '6-12 months',
        priceRange: {
          min: 50000,
          max: 200000,
          currency: 'USD',
          note: {
            ru: 'Зависит от сложности и требований',
            en: 'Depends on complexity and requirements'
          }
        },
        complexity: 'Enterprise',
        tags: ['blockchain', 'custom-development', 'consensus', 'tokenomics'],
        isPopular: false,
        isCustomizable: true,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 365,
          requiresDiscovery: true,
          teamSize: '3-5 developers',
          supportLevel: 'Premium',
          displayOrder: 1
        }
      },
      {
        serviceId: 'defi-protocol-dev',
        categoryId: 'development',
        name: {
          ru: 'Разработка DeFi протокола',
          en: 'DeFi Protocol Development'
        },
        shortDescription: {
          ru: 'Создание DeFi протокола с полным набором функций',
          en: 'Build a full-featured DeFi protocol'
        },
        fullDescription: {
          ru: 'Разработка комплексного DeFi протокола включая смарт-контракты, фронтенд, токеномику и интеграции с существующими протоколами.',
          en: 'Develop comprehensive DeFi protocol including smart contracts, frontend, tokenomics, and integrations with existing protocols.'
        },
        features: [
          'Smart contract architecture',
          'Frontend application',
          'Liquidity management',
          'Yield farming mechanisms',
          'Governance system',
          'Security audits'
        ],
        deliverables: [
          'Audited smart contracts',
          'Web application',
          'Mobile app (optional)',
          'Admin dashboard',
          'API documentation',
          'User guides'
        ],
        timeline: '4-8 months',
        priceRange: {
          min: 25000,
          max: 80000,
          currency: 'USD'
        },
        complexity: 'Enterprise',
        tags: ['defi', 'smart-contracts', 'yield-farming', 'governance'],
        isPopular: true,
        isCustomizable: true,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 240,
          requiresDiscovery: true,
          teamSize: '4-6 developers',
          supportLevel: 'Premium',
          displayOrder: 2
        }
      },

      // Consulting Services (Migrated from legacy)
      {
        serviceId: 'basic-consultation',
        categoryId: 'consulting',
        name: {
          ru: 'Базовая консультация',
          en: 'Basic Consultation'
        },
        shortDescription: {
          ru: 'Общие вопросы по блокчейн-разработке',
          en: 'General blockchain development questions'
        },
        fullDescription: {
          ru: 'Персональная консультация по общим вопросам блокчейн-разработки, выбору технологий и архитектурным решениям.',
          en: 'Personal consultation on general blockchain development questions, technology selection, and architectural solutions.'
        },
        features: [
          'Video conference 1 hour',
          'Project overview',
          'Technology recommendations',
          'Technical Q&A',
          'Brief report with recommendations'
        ],
        deliverables: [
          'One-hour consultation session',
          'Written recommendations report',
          'Follow-up email with resources'
        ],
        timeline: '1 hour',
        priceRange: {
          min: 150,
          max: 150,
          currency: 'USD'
        },
        complexity: 'Basic',
        tags: ['consultation', 'architecture', 'technology-selection'],
        isPopular: false,
        isCustomizable: false,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 1,
          requiresDiscovery: false,
          teamSize: '1 consultant',
          supportLevel: 'Basic',
          displayOrder: 1
        }
      },
      {
        serviceId: 'smart-contract-audit',
        categoryId: 'consulting',
        name: {
          ru: 'Аудит смарт-контрактов',
          en: 'Smart Contract Audit'
        },
        shortDescription: {
          ru: 'Детальный аудит безопасности смарт-контрактов',
          en: 'Detailed smart contract security audit'
        },
        fullDescription: {
          ru: 'Комплексный аудит безопасности смарт-контрактов с детальным отчетом, рекомендациями по исправлению уязвимостей и повторной проверкой.',
          en: 'Comprehensive smart contract security audit with detailed report, vulnerability fix recommendations, and re-audit.'
        },
        features: [
          'Smart contract code analysis',
          'Security vulnerability detection',
          'Gas optimization review',
          'Detailed report with recommendations',
          '2 hours consultation on results',
          'Re-audit after fixes'
        ],
        deliverables: [
          'Comprehensive audit report',
          'Security recommendations',
          'Gas optimization suggestions',
          'Re-audit after fixes',
          'Certificate of audit completion'
        ],
        timeline: '3-5 days',
        priceRange: {
          min: 500,
          max: 1500,
          currency: 'USD',
          note: {
            ru: 'Зависит от размера и сложности контрактов',
            en: 'Depends on contract size and complexity'
          }
        },
        complexity: 'Advanced',
        tags: ['audit', 'security', 'smart-contracts', 'vulnerability'],
        isPopular: true,
        isCustomizable: true,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 5,
          requiresDiscovery: true,
          teamSize: '1-2 auditors',
          supportLevel: 'Premium',
          displayOrder: 2
        }
      },

      // Content Services
      {
        serviceId: 'technical-blog-writing',
        categoryId: 'content',
        name: {
          ru: 'Написание технических статей',
          en: 'Technical Blog Writing'
        },
        shortDescription: {
          ru: 'Создание качественного технического контента',
          en: 'High-quality technical content creation'
        },
        fullDescription: {
          ru: 'Профессиональное написание технических статей, туториалов и документации по блокчейн-технологиям для вашего проекта.',
          en: 'Professional technical article writing, tutorials, and documentation on blockchain technologies for your project.'
        },
        features: [
          'In-depth research',
          'Technical accuracy',
          'SEO optimization',
          'Code examples',
          'Visual diagrams',
          'Multiple revisions'
        ],
        deliverables: [
          'High-quality articles',
          'SEO-optimized content',
          'Code examples and snippets',
          'Technical diagrams',
          'Editorial calendar'
        ],
        timeline: '1-2 weeks per article',
        priceRange: {
          min: 200,
          max: 800,
          currency: 'USD',
          note: {
            ru: 'За статью, зависит от длины и сложности',
            en: 'Per article, depends on length and complexity'
          }
        },
        complexity: 'Advanced',
        tags: ['content', 'technical-writing', 'documentation', 'seo'],
        isPopular: false,
        isCustomizable: true,
        isActive: true,
        metadata: {
          estimatedDeliveryDays: 14,
          requiresDiscovery: false,
          teamSize: '1 writer',
          supportLevel: 'Standard',
          displayOrder: 1
        }
      }
    ]

    // Assign services to categories
    this.serviceCategories.forEach(category => {
      category.services = this.services.filter(service => service.categoryId === category.categoryId)
    })
  }

  /**
   * Get all service categories
   */
  getServiceCategories(): ServiceCategory[] {
    return this.serviceCategories.filter(category => category.isActive)
  }

  /**
   * Get services by category
   */
  getServicesByCategory(categoryId: string): Service[] {
    return this.services.filter(service => 
      service.categoryId === categoryId && service.isActive
    )
  }

  /**
   * Get service by ID
   */
  getServiceById(serviceId: string): Service | undefined {
    return this.services.find(service => service.serviceId === serviceId)
  }

  /**
   * Search services by query
   */
  searchServices(query: string, language: 'ru' | 'en' = 'en'): Service[] {
    const lowercaseQuery = query.toLowerCase()
    
    return this.services.filter(service => {
      if (!service.isActive) return false
      
      const name = service.name[language].toLowerCase()
      const description = service.shortDescription[language].toLowerCase()
      const tags = service.tags.join(' ').toLowerCase()
      
      return name.includes(lowercaseQuery) || 
             description.includes(lowercaseQuery) || 
             tags.includes(lowercaseQuery)
    })
  }

  /**
   * Filter services by criteria
   */
  filterServices(filters: FilterState): Service[] {
    return this.services.filter(service => {
      if (!service.isActive) return false

      // Category filter
      if (filters.categories.length > 0 && !filters.categories.includes(service.categoryId)) {
        return false
      }

      // Complexity filter
      if (filters.complexity.length > 0 && !filters.complexity.includes(service.complexity)) {
        return false
      }

      // Price range filter
      if (filters.priceRange.min > 0 || filters.priceRange.max > 0) {
        const serviceMinPrice = service.priceRange.min
        const serviceMaxPrice = service.priceRange.max
        
        if (filters.priceRange.min > 0 && serviceMaxPrice < filters.priceRange.min) {
          return false
        }
        
        if (filters.priceRange.max > 0 && serviceMinPrice > filters.priceRange.max) {
          return false
        }
      }

      // Tags filter
      if (filters.tags.length > 0) {
        const hasMatchingTag = filters.tags.some(tag => 
          service.tags.includes(tag)
        )
        if (!hasMatchingTag) return false
      }

      return true
    })
  }

  /**
   * Calculate total price range for selected services
   */
  calculateTotalPrice(selectedServices: SelectedService[]): { min: number; max: number; currency: string } {
    let totalMin = 0
    let totalMax = 0
    const currency = 'USD' // Default currency

    selectedServices.forEach(selectedService => {
      const service = this.getServiceById(selectedService.serviceId)
      if (service) {
        totalMin += service.priceRange.min
        totalMax += service.priceRange.max
      }
    })

    return { min: totalMin, max: totalMax, currency }
  }

  /**
   * Generate order ID
   */
  generateOrderId(): string {
    const timestamp = Date.now()
    const random = Math.random().toString(36).substring(2, 8)
    return `ORD-${timestamp}-${random.toUpperCase()}`
  }

  /**
   * Create order from form data
   */
  createOrder(orderData: OrderFormData): Order {
    const orderId = this.generateOrderId()
    const calculatedTotal = this.calculateTotalPrice(orderData.selectedServices)
    
    const order: Order = {
      orderId,
      status: 'submitted',
      orderData,
      calculatedTotal,
      priority: 'normal',
      notes: [],
      createdAt: new Date(),
      updatedAt: new Date()
    }

    this.orders.push(order)
    return order
  }

  /**
   * Update order status
   */
  updateOrderStatus(orderId: string, status: OrderStatus): boolean {
    const orderIndex = this.orders.findIndex(order => order.orderId === orderId)
    if (orderIndex === -1) return false

    this.orders[orderIndex].status = status
    this.orders[orderIndex].updatedAt = new Date()
    return true
  }

  /**
   * Get popular services
   */
  getPopularServices(): Service[] {
    return this.services.filter(service => service.isPopular && service.isActive)
  }

  /**
   * Get services by complexity
   */
  getServicesByComplexity(complexity: 'Basic' | 'Advanced' | 'Enterprise'): Service[] {
    return this.services.filter(service => 
      service.complexity === complexity && service.isActive
    )
  }

  /**
   * Validate order form data
   */
  validateOrderData(orderData: Partial<OrderFormData>): { isValid: boolean; errors: string[] } {
    const errors: string[] = []

    // Check required fields
    if (!orderData.selectedServices || orderData.selectedServices.length === 0) {
      errors.push('At least one service must be selected')
    }

    if (!orderData.projectDetails?.title) {
      errors.push('Project title is required')
    }

    if (!orderData.projectDetails?.description) {
      errors.push('Project description is required')
    }

    if (!orderData.contactInfo?.firstName) {
      errors.push('First name is required')
    }

    if (!orderData.contactInfo?.lastName) {
      errors.push('Last name is required')
    }

    if (!orderData.contactInfo?.email) {
      errors.push('Email is required')
    }

    if (!orderData.contactInfo?.timezone) {
      errors.push('Timezone is required')
    }

    if (!orderData.agreesToTerms) {
      errors.push('You must agree to the terms and conditions')
    }

    return {
      isValid: errors.length === 0,
      errors
    }
  }

  /**
   * Format price range for display
   */
  formatPriceRange(priceRange: { min: number; max: number; currency: string }, language: 'ru' | 'en' = 'en'): string {
    const formatter = new Intl.NumberFormat(language === 'ru' ? 'ru-RU' : 'en-US', {
      style: 'currency',
      currency: priceRange.currency,
      minimumFractionDigits: 0
    })

    if (priceRange.min === priceRange.max) {
      return formatter.format(priceRange.min)
    }

    return `${formatter.format(priceRange.min)} - ${formatter.format(priceRange.max)}`
  }
}

// Singleton instance
export const serviceRegistry = new ServiceRegistry()

// Export default
export default serviceRegistry