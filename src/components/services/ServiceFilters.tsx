'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import type { ServiceCategory, FilterState } from '@/types'
import { Button } from '@/components/ui/Button'
import { 
  FunnelIcon,
  XMarkIcon,
  ChevronDownIcon,
  CurrencyDollarIcon
} from '@heroicons/react/24/outline'

interface ServiceFiltersProps {
  categories: ServiceCategory[]
  onFiltersChange: (filters: FilterState) => void
  activeFilters: FilterState
}

const complexityOptions = [
  { value: 'Basic', label: { ru: 'Базовый', en: 'Basic' } },
  { value: 'Advanced', label: { ru: 'Продвинутый', en: 'Advanced' } },
  { value: 'Enterprise', label: { ru: 'Корпоративный', en: 'Enterprise' } }
]

const priceRanges = [
  { min: 0, max: 500, label: { ru: 'До $500', en: 'Under $500' } },
  { min: 500, max: 2000, label: { ru: '$500 - $2,000', en: '$500 - $2,000' } },
  { min: 2000, max: 10000, label: { ru: '$2,000 - $10,000', en: '$2,000 - $10,000' } },
  { min: 10000, max: 50000, label: { ru: '$10,000 - $50,000', en: '$10,000 - $50,000' } },
  { min: 50000, max: 0, label: { ru: 'Свыше $50,000', en: '$50,000+' } }
]

const popularTags = [
  'blockchain', 'smart-contracts', 'defi', 'rust', 'solidity', 
  'education', 'consulting', 'development', 'audit', 'security'
]

export function ServiceFilters({ 
  categories, 
  onFiltersChange, 
  activeFilters 
}: ServiceFiltersProps) {
  const [isExpanded, setIsExpanded] = useState(false)
  const [language] = useState<'ru' | 'en'>('en') // This would come from app store
  
  const hasActiveFilters = 
    activeFilters.categories.length > 0 ||
    activeFilters.complexity.length > 0 ||
    activeFilters.priceRange.min > 0 ||
    activeFilters.priceRange.max > 0 ||
    activeFilters.tags.length > 0
  
  const updateFilters = (newFilters: Partial<FilterState>) => {
    onFiltersChange({ ...activeFilters, ...newFilters })
  }
  
  const clearFilters = () => {
    onFiltersChange({
      categories: [],
      complexity: [],
      priceRange: { min: 0, max: 0 },
      tags: []
    })
  }
  
  const toggleCategory = (categoryId: string) => {
    const newCategories = activeFilters.categories.includes(categoryId)
      ? activeFilters.categories.filter(id => id !== categoryId)
      : [...activeFilters.categories, categoryId]
    updateFilters({ categories: newCategories })
  }
  
  const toggleComplexity = (complexity: string) => {
    const newComplexity = activeFilters.complexity.includes(complexity)
      ? activeFilters.complexity.filter(c => c !== complexity)
      : [...activeFilters.complexity, complexity]
    updateFilters({ complexity: newComplexity })
  }
  
  const setPriceRange = (min: number, max: number) => {
    updateFilters({ priceRange: { min, max } })
  }
  
  const toggleTag = (tag: string) => {
    const newTags = activeFilters.tags.includes(tag)
      ? activeFilters.tags.filter(t => t !== tag)
      : [...activeFilters.tags, tag]
    updateFilters({ tags: newTags })
  }
  
  return (
    <div className="border border-gray-200 dark:border-gray-700 rounded-lg bg-white dark:bg-gray-800">
      {/* Filter Header */}
      <div className="flex items-center justify-between p-4">
        <div className="flex items-center space-x-2">
          <FunnelIcon className="h-5 w-5 text-gray-600 dark:text-gray-400\" />
          <span className="font-medium text-gray-900 dark:text-white">
            {language === 'ru' ? 'Фильтры' : 'Filters'}
          </span>
          {hasActiveFilters && (
            <span className="bg-primary text-white text-xs px-2 py-1 rounded-full">
              {activeFilters.categories.length + 
               activeFilters.complexity.length + 
               (activeFilters.priceRange.min > 0 || activeFilters.priceRange.max > 0 ? 1 : 0) +
               activeFilters.tags.length
              }
            </span>
          )}
        </div>
        
        <div className="flex items-center space-x-2">
          {hasActiveFilters && (
            <Button
              variant="ghost"
              size="sm"
              onClick={clearFilters}
              className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white\"
            >
              <XMarkIcon className="h-4 w-4 mr-1\" />
              {language === 'ru' ? 'Очистить' : 'Clear'}
            </Button>
          )}
          
          <Button
            variant="ghost"
            size="sm"
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white\"
          >
            <ChevronDownIcon className={`h-4 w-4 transition-transform ${
              isExpanded ? 'rotate-180' : ''
            }`} />
          </Button>
        </div>
      </div>
      
      {/* Filter Content */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ height: 0, opacity: 0 }}
            animate={{ height: 'auto', opacity: 1 }}
            exit={{ height: 0, opacity: 0 }}
            transition={{ duration: 0.3 }}
            className="border-t border-gray-200 dark:border-gray-700\"
          >
            <div className="p-4 space-y-6">
              {/* Categories */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  {language === 'ru' ? 'Категории' : 'Categories'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {categories.map((category) => (
                    <button
                      key={category.categoryId}
                      onClick={() => toggleCategory(category.categoryId)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilters.categories.includes(category.categoryId)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {category.name[language]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Complexity */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  {language === 'ru' ? 'Сложность' : 'Complexity'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {complexityOptions.map((option) => (
                    <button
                      key={option.value}
                      onClick={() => toggleComplexity(option.value)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilters.complexity.includes(option.value)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      {option.label[language]}
                    </button>
                  ))}
                </div>
              </div>
              
              {/* Price Range */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3 flex items-center">
                  <CurrencyDollarIcon className="h-4 w-4 mr-1\" />
                  {language === 'ru' ? 'Ценовой диапазон' : 'Price Range'}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-2">
                  {priceRanges.map((range, index) => {
                    const isActive = 
                      activeFilters.priceRange.min === range.min &&
                      activeFilters.priceRange.max === range.max
                    
                    return (
                      <button
                        key={index}
                        onClick={() => setPriceRange(range.min, range.max)}
                        className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors text-center ${
                          isActive
                            ? 'bg-primary text-white'
                            : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                        }`}
                      >
                        {range.label[language]}
                      </button>
                    )
                  })}
                </div>
              </div>
              
              {/* Tags */}
              <div>
                <h3 className="font-medium text-gray-900 dark:text-white mb-3">
                  {language === 'ru' ? 'Теги' : 'Tags'}
                </h3>
                <div className="flex flex-wrap gap-2">
                  {popularTags.map((tag) => (
                    <button
                      key={tag}
                      onClick={() => toggleTag(tag)}
                      className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                        activeFilters.tags.includes(tag)
                          ? 'bg-primary text-white'
                          : 'bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 hover:bg-gray-200 dark:hover:bg-gray-600'
                      }`}
                    >
                      #{tag}
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

export default ServiceFilters