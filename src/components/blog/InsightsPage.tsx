'use client'

import { useState, useMemo, useEffect } from 'react'
import { MagnifyingGlassIcon, FunnelIcon, AcademicCapIcon, LightBulbIcon, RocketLaunchIcon } from '@heroicons/react/24/outline'
import { BlogCard } from '@/components/blog/BlogCard'
import { ServiceCTACard } from '@/components/blog/ServiceCTACard'
import { BlogPostMetadata } from '@/lib/blog'
import { Service } from '@/types'

interface InsightsPageProps {
  initialPosts: BlogPostMetadata[]
  categories: string[]
  contentTypes: string[]
  difficultyLevels: string[]
  services: Service[]
}

interface FilterState {
  category: string
  contentType: string
  difficulty: string
  serviceId: string
}

interface PaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

function SearchBar({ value, onChange }: { value: string; onChange: (value: string) => void }) {
  return (
    <div className="relative">
      <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <MagnifyingGlassIcon className="h-5 w-5 text-gray-400" />
      </div>
      <input
        type="text"
        placeholder="Search insights, tutorials, case studies..."
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="block w-full pl-10 pr-3 py-3 border border-gray-300 rounded-lg leading-5 bg-white placeholder-gray-500 focus:outline-none focus:placeholder-gray-400 focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 text-sm"
      />
    </div>
  )
}

function FilterSection({ 
  filters, 
  onFiltersChange,
  categories,
  contentTypes,
  difficultyLevels,
  services,
  showFilters,
  onToggleFilters
}: {
  filters: FilterState
  onFiltersChange: (filters: FilterState) => void
  categories: string[]
  contentTypes: string[]
  difficultyLevels: string[]
  services: Service[]
  showFilters: boolean
  onToggleFilters: () => void
}) {
  const updateFilter = (key: keyof FilterState, value: string) => {
    onFiltersChange({ ...filters, [key]: value })
  }

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h3 className="text-lg font-semibold text-gray-900">Filters</h3>
        <button
          onClick={onToggleFilters}
          className="md:hidden flex items-center px-3 py-2 border border-gray-300 rounded-md text-sm font-medium text-gray-700 bg-white hover:bg-gray-50"
        >
          <FunnelIcon className="w-4 h-4 mr-2" />
          {showFilters ? 'Hide' : 'Show'} Filters
        </button>
      </div>
      
      <div className={`grid grid-cols-1 md:grid-cols-4 gap-4 ${showFilters ? 'block' : 'hidden md:grid'}`}>
        {/* Category Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
          <select
            value={filters.category}
            onChange={(e) => updateFilter('category', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Categories</option>
            {categories.map((category) => (
              <option key={category} value={category}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Content Type Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Content Type</label>
          <select
            value={filters.contentType}
            onChange={(e) => updateFilter('contentType', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Types</option>
            {contentTypes.map((type) => (
              <option key={type} value={type}>
                {type.charAt(0).toUpperCase() + type.slice(1)}
              </option>
            ))}
          </select>
        </div>

        {/* Difficulty Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Difficulty</label>
          <select
            value={filters.difficulty}
            onChange={(e) => updateFilter('difficulty', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Levels</option>
            {difficultyLevels.map((level) => (
              <option key={level} value={level}>
                {level}
              </option>
            ))}
          </select>
        </div>

        {/* Service Filter */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">Related Service</label>
          <select
            value={filters.serviceId}
            onChange={(e) => updateFilter('serviceId', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
          >
            <option value="">All Services</option>
            {services.map((service) => (
              <option key={service.serviceId} value={service.serviceId}>
                {service.name.en}
              </option>
            ))}
          </select>
        </div>
      </div>
    </div>
  )
}

function ContentTypeCards() {
  const contentTypes = [
    {
      type: 'tutorial',
      icon: AcademicCapIcon,
      title: 'Tutorials',
      description: 'Step-by-step guides and hands-on learning',
      color: 'bg-blue-50 text-blue-600 border-blue-200'
    },
    {
      type: 'case-study',
      icon: LightBulbIcon,
      title: 'Case Studies',
      description: 'Real-world project insights and solutions',
      color: 'bg-green-50 text-green-600 border-green-200'
    },
    {
      type: 'opinion',
      icon: RocketLaunchIcon,
      title: 'Industry Insights',
      description: 'Expert opinions and future predictions',
      color: 'bg-purple-50 text-purple-600 border-purple-200'
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6 mb-12">
      {contentTypes.map(({ type, icon: Icon, title, description, color }) => (
        <div key={type} className={`p-6 rounded-lg border-2 ${color} hover:shadow-md transition-shadow cursor-pointer`}>
          <div className="flex items-center space-x-3 mb-3">
            <Icon className="h-6 w-6" />
            <h3 className="font-semibold">{title}</h3>
          </div>
          <p className="text-sm opacity-80">{description}</p>
        </div>
      ))}
    </div>
  )
}

function Pagination({ currentPage, totalPages, onPageChange }: PaginationProps) {
  if (totalPages <= 1) return null

  const getPageNumbers = () => {
    const pages = []
    const showPages = 5
    
    let start = Math.max(1, currentPage - Math.floor(showPages / 2))
    let end = Math.min(totalPages, start + showPages - 1)
    
    if (end - start + 1 < showPages) {
      start = Math.max(1, end - showPages + 1)
    }
    
    for (let i = start; i <= end; i++) {
      pages.push(i)
    }
    
    return pages
  }

  return (
    <nav className="flex items-center justify-between border-t border-gray-200 px-4 py-3 sm:px-6 mt-12">
      <div className="flex flex-1 justify-between sm:hidden">
        <button
          onClick={() => onPageChange(currentPage - 1)}
          disabled={currentPage === 1}
          className="relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Previous
        </button>
        <button
          onClick={() => onPageChange(currentPage + 1)}
          disabled={currentPage === totalPages}
          className="ml-3 relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
        >
          Next
        </button>
      </div>
      
      <div className="hidden sm:flex sm:flex-1 sm:items-center sm:justify-between">
        <div>
          <p className="text-sm text-gray-700">
            Showing page <span className="font-medium">{currentPage}</span> of{' '}
            <span className="font-medium">{totalPages}</span>
          </p>
        </div>
        
        <div>
          <nav className="relative z-0 inline-flex rounded-md shadow-sm -space-x-px">
            <button
              onClick={() => onPageChange(currentPage - 1)}
              disabled={currentPage === 1}
              className="relative inline-flex items-center px-2 py-2 rounded-l-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Previous
            </button>
            
            {getPageNumbers().map((page) => (
              <button
                key={page}
                onClick={() => onPageChange(page)}
                className={`relative inline-flex items-center px-4 py-2 border text-sm font-medium ${
                  page === currentPage
                    ? 'z-10 bg-indigo-50 border-indigo-500 text-indigo-600'
                    : 'bg-white border-gray-300 text-gray-500 hover:bg-gray-50'
                }`}
              >
                {page}
              </button>
            ))}
            
            <button
              onClick={() => onPageChange(currentPage + 1)}
              disabled={currentPage === totalPages}
              className="relative inline-flex items-center px-2 py-2 rounded-r-md border border-gray-300 bg-white text-sm font-medium text-gray-500 hover:bg-gray-50 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Next
            </button>
          </nav>
        </div>
      </div>
    </nav>
  )
}

function EmptyState() {
  return (
    <div className="text-center py-12">
      <div className="mx-auto w-24 h-24 text-gray-400 mb-4">
        <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
      </div>
      <h3 className="text-lg font-medium text-gray-900 mb-2">No insights found</h3>
      <p className="text-gray-500">Try adjusting your search or filter criteria to discover relevant content.</p>
    </div>
  )
}

export default function InsightsPage({ 
  initialPosts, 
  categories, 
  contentTypes, 
  difficultyLevels, 
  services 
}: InsightsPageProps) {
  const [searchTerm, setSearchTerm] = useState('')
  const [filters, setFilters] = useState<FilterState>({
    category: '',
    contentType: '',
    difficulty: '',
    serviceId: ''
  })
  const [currentPage, setCurrentPage] = useState(1)
  const [showFilters, setShowFilters] = useState(false)
  
  const postsPerPage = 9

  const filteredPosts = useMemo(() => {
    let posts = initialPosts

    // Apply filters
    if (filters.category) {
      posts = posts.filter(post => post.category === filters.category)
    }

    if (filters.contentType) {
      posts = posts.filter(post => post.type === filters.contentType)
    }

    if (filters.difficulty) {
      posts = posts.filter(post => post.difficulty === filters.difficulty)
    }

    if (filters.serviceId) {
      posts = posts.filter(post => 
        post.targetedServices?.includes(filters.serviceId) || 
        post.primaryService === filters.serviceId
      )
    }

    // Apply search
    if (searchTerm.trim()) {
      const lowercaseQuery = searchTerm.toLowerCase()
      posts = posts.filter((post) => {
        return (
          post.title.toLowerCase().includes(lowercaseQuery) ||
          post.description.toLowerCase().includes(lowercaseQuery) ||
          post.tags.some((tag) => tag.toLowerCase().includes(lowercaseQuery)) ||
          post.category.toLowerCase().includes(lowercaseQuery)
        )
      })
    }

    return posts
  }, [initialPosts, searchTerm, filters])

  const paginationData = useMemo(() => {
    const totalPages = Math.ceil(filteredPosts.length / postsPerPage)
    const startIndex = (currentPage - 1) * postsPerPage
    const endIndex = startIndex + postsPerPage
    const posts = filteredPosts.slice(startIndex, endIndex)

    return {
      posts,
      totalPages,
      currentPage,
      hasNextPage: currentPage < totalPages,
      hasPrevPage: currentPage > 1,
    }
  }, [filteredPosts, currentPage, postsPerPage])

  // Reset to first page when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [searchTerm, filters])

  const featuredPosts = initialPosts.filter(post => post.featured).slice(0, 3)
  const hasFeaturedPosts = featuredPosts.length > 0 && 
    !filters.category && !filters.contentType && !filters.difficulty && 
    !filters.serviceId && !searchTerm.trim()

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
      {/* Header */}
      <div className="text-center mb-12">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
          Insights & Updates
        </h1>
        <p className="text-xl text-gray-600 max-w-3xl mx-auto mb-8">
          Expert insights on blockchain development, comprehensive tutorials, real-world case studies, 
          and industry analysis. Learn from experienced Web3 professionals and advance your blockchain career.
        </p>
      </div>

      {/* Content Type Overview Cards */}
      <ContentTypeCards />

      {/* Search and Filters */}
      <div className="mb-8">
        <div className="max-w-2xl mx-auto mb-8">
          <SearchBar value={searchTerm} onChange={setSearchTerm} />
        </div>
        
        <FilterSection
          filters={filters}
          onFiltersChange={setFilters}
          categories={categories}
          contentTypes={contentTypes}
          difficultyLevels={difficultyLevels}
          services={services}
          showFilters={showFilters}
          onToggleFilters={() => setShowFilters(!showFilters)}
        />
      </div>

      {/* Featured Posts */}
      {hasFeaturedPosts && (
        <section className="mb-12">
          <h2 className="text-2xl font-bold text-gray-900 mb-6">Featured Content</h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {featuredPosts.map((post) => (
              <BlogCard key={post.slug} post={post} featured />
            ))}
          </div>
        </section>
      )}

      {/* All Posts */}
      <section>
        <div className="flex items-center justify-between mb-6">
          <h2 className="text-2xl font-bold text-gray-900">
            {hasFeaturedPosts ? 'Latest Insights' : 'All Content'}
          </h2>
          <p className="text-sm text-gray-500">
            {filteredPosts.length} result{filteredPosts.length !== 1 ? 's' : ''}
          </p>
        </div>

        {paginationData.posts.length > 0 ? (
          <>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {paginationData.posts.map((post) => (
                <BlogCard 
                  key={post.slug} 
                  post={post} 
                  featured={false}
                  showServiceBadge={true}
                />
              ))}
            </div>
            
            <Pagination
              currentPage={paginationData.currentPage}
              totalPages={paginationData.totalPages}
              onPageChange={setCurrentPage}
            />
          </>
        ) : (
          <EmptyState />
        )}
      </section>

      {/* Service CTA Section */}
      {!searchTerm && !Object.values(filters).some(Boolean) && (
        <section className="mt-16 py-12 bg-gradient-to-r from-indigo-50 to-purple-50 rounded-2xl">
          <div className="text-center mb-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Build Your Web3 Project?
            </h2>
            <p className="text-lg text-gray-600 max-w-2xl mx-auto">
              From learning blockchain development to building enterprise solutions, 
              we offer comprehensive services to accelerate your Web3 journey.
            </p>
          </div>
          <ServiceCTACard />
        </section>
      )}
    </div>
  )
}