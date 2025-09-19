'use client'

import React, { useState, useEffect } from 'react'
import { motion } from 'framer-motion'
import type { ServiceCategory, Service } from '@/types'
import { ServiceCard } from './ServiceCard'
import { ServiceFilters } from './ServiceFilters'
import { useAppStore } from '@/stores/useAppStore'
import useServiceStore from '@/stores/useServiceStore'
import { 
  AcademicCapIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon,
  MagnifyingGlassIcon
} from '@heroicons/react/24/outline'

// Icon mapping
const iconMap = {
  AcademicCapIcon,
  CodeBracketIcon,
  ChatBubbleLeftRightIcon,
  DocumentTextIcon
}

interface ServiceCatalogProps {
  initialCategories?: ServiceCategory[]
  showFilters?: boolean
  showSearch?: boolean
  maxItemsPerCategory?: number
}

export function ServiceCatalog({ 
  initialCategories = [], 
  showFilters = true, 
  showSearch = true,
  maxItemsPerCategory 
}: ServiceCatalogProps) {
  const { language } = useAppStore()
  const {
    serviceCategories,
    selectedServices,
    activeFilters,
    selectService,
    loadServiceCategories,
    filterServices,
    searchServices,
    getFilteredServices
  } = useServiceStore()
  
  const [searchQuery, setSearchQuery] = useState('')
  const [filteredServices, setFilteredServices] = useState<Service[]>([])
  const [isLoading, setIsLoading] = useState(true)
  
  // Load service categories on mount
  useEffect(() => {
    loadServiceCategories()
    setIsLoading(false)
  }, [])
  
  // Update filtered services when filters or search change
  useEffect(() => {
    if (searchQuery.trim()) {
      const searchResults = searchServices(searchQuery, language)
      setFilteredServices(searchResults)
    } else {
      const filtered = getFilteredServices()
      setFilteredServices(filtered)
    }
  }, [searchQuery, activeFilters, language, searchServices, getFilteredServices])
  
  // Get categories to display
  const categoriesToShow = serviceCategories.length > 0 ? serviceCategories : initialCategories
  
  // Group filtered services by category
  const servicesByCategory = categoriesToShow.reduce((acc, category) => {
    const categoryServices = filteredServices.filter(service => 
      service.categoryId === category.categoryId
    )
    
    if (categoryServices.length > 0) {
      acc[category.categoryId] = {
        category,
        services: maxItemsPerCategory 
          ? categoryServices.slice(0, maxItemsPerCategory)
          : categoryServices
      }
    }
    
    return acc
  }, {} as Record<string, { category: ServiceCategory; services: Service[] }>)
  
  if (isLoading) {
    return (
      <div className="flex items-center justify-center min-h-[400px]">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }
  
  return (
    <div className="space-y-8">
      {/* Search and Filters */}
      {(showSearch || showFilters) && (
        <div className="space-y-4">
          {/* Search Bar */}
          {showSearch && (
            <div className="relative max-w-md mx-auto">
              <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400\" />
              <input
                type="text\"
                placeholder={language === 'ru' ? 'Поиск услуг...' : 'Search services...'}
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                         bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                         focus:ring-2 focus:ring-primary focus:border-transparent
                         placeholder-gray-500 dark:placeholder-gray-400\"
              />
            </div>
          )}
          
          {/* Filters */}
          {showFilters && (
            <ServiceFilters
              categories={categoriesToShow}
              onFiltersChange={filterServices}
              activeFilters={activeFilters}
            />
          )}
        </div>
      )}
      
      {/* Search Results */}
      {searchQuery.trim() && (
        <div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {language === 'ru' 
              ? `Результаты поиска \"${searchQuery}\"` 
              : `Search Results for \"${searchQuery}\"`
            }
            <span className="text-lg font-normal text-gray-600 dark:text-gray-400 ml-2">
              ({filteredServices.length} {language === 'ru' ? 'найдено' : 'found'})
            </span>
          </h2>
          
          {filteredServices.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredServices.map((service, index) => (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5, delay: index * 0.1 }}
                >
                  <ServiceCard
                    service={service}
                    isSelected={selectedServices.includes(service.serviceId)}
                    onSelect={() => selectService(service.serviceId)}
                    language={language}
                  />
                </motion.div>
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <MagnifyingGlassIcon className="mx-auto h-12 w-12 text-gray-400\" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ru' ? 'Ничего не найдено' : 'No results found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {language === 'ru' 
                  ? 'Попробуйте изменить поисковый запрос или фильтры'
                  : 'Try adjusting your search query or filters'
                }
              </p>
            </div>
          )}
        </div>
      )}
      
      {/* Service Categories */}
      {!searchQuery.trim() && (
        <div className="space-y-12">
          {Object.values(servicesByCategory).map(({ category, services }, categoryIndex) => {
            const IconComponent = iconMap[category.icon as keyof typeof iconMap] || DocumentTextIcon
            
            return (
              <motion.section
                key={category.categoryId}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: categoryIndex * 0.2 }}
                className="space-y-6\"
              >
                {/* Category Header */}
                <div className="flex items-center space-x-3">
                  <div className="bg-primary/10 rounded-lg p-2">
                    <IconComponent className="h-6 w-6 text-primary\" />
                  </div>
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
                      {category.name[language]}
                    </h2>
                    <p className="text-gray-600 dark:text-gray-400">
                      {category.description[language]}
                    </p>
                  </div>
                </div>
                
                {/* Services Grid */}
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {services.map((service, serviceIndex) => (
                    <motion.div
                      key={service.serviceId}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ 
                        duration: 0.5, 
                        delay: categoryIndex * 0.2 + serviceIndex * 0.1 
                      }}
                    >
                      <ServiceCard
                        service={service}
                        isSelected={selectedServices.includes(service.serviceId)}
                        onSelect={() => selectService(service.serviceId)}
                        language={language}
                      />
                    </motion.div>
                  ))}
                </div>
                
                {/* Show More Link */}
                {maxItemsPerCategory && category.services.length > maxItemsPerCategory && (
                  <div className="text-center">
                    <button className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-primary bg-primary/10 hover:bg-primary/20 transition-colors">
                      {language === 'ru' 
                        ? `Показать еще (${category.services.length - maxItemsPerCategory})`
                        : `Show more (${category.services.length - maxItemsPerCategory})`
                      }
                    </button>
                  </div>
                )}
              </motion.section>
            )
          })}
          
          {/* Empty State */}
          {Object.keys(servicesByCategory).length === 0 && (
            <div className="text-center py-12">
              <DocumentTextIcon className="mx-auto h-12 w-12 text-gray-400\" />
              <h3 className="mt-2 text-sm font-medium text-gray-900 dark:text-white">
                {language === 'ru' ? 'Услуги не найдены' : 'No services found'}
              </h3>
              <p className="mt-1 text-sm text-gray-500 dark:text-gray-400">
                {language === 'ru' 
                  ? 'Попробуйте изменить фильтры поиска'
                  : 'Try adjusting your search filters'
                }
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default ServiceCatalog