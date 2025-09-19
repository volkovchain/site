'use client'

import React from 'react'
import { useAppStore } from '@/stores/useAppStore'
import { categoryTranslations, categoryColors } from '@/lib/periodicData'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import { Button } from '@/components/ui/Button'
import type { ElementCategory } from '@/types'
import { 
  MagnifyingGlassIcon,
  FunnelIcon,
  CubeIcon,
  TableCellsIcon
} from '@heroicons/react/24/outline'

export function TableControls({ isMobile = false }: { isMobile?: boolean }) {
  const { 
    periodicTable, 
    language, 
    setSearchQuery, 
    setFilterCategory, 
    setViewMode 
  } = useAppStore()
  
  const { searchQuery, filterCategory, viewMode } = periodicTable

  const categoryOptions = [
    { value: 'all', label: categoryTranslations[language]['all'] },
    { value: 'payment-coin', label: categoryTranslations[language]['payment-coin'] },
    { value: 'smart-contract-platform', label: categoryTranslations[language]['smart-contract-platform'] },
    { value: 'defi-protocol', label: categoryTranslations[language]['defi-protocol'] },
    { value: 'layer2-solution', label: categoryTranslations[language]['layer2-solution'] },
    { value: 'stablecoin', label: categoryTranslations[language]['stablecoin'] },
    { value: 'infrastructure', label: categoryTranslations[language]['infrastructure'] },
    { value: 'privacy-coin', label: categoryTranslations[language]['privacy-coin'] },
    { value: 'personal-brand', label: categoryTranslations[language]['personal-brand'] }
  ]

  return (
    <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 space-y-4 min-w-[300px]">
      {/* Search */}
      <div className="relative">
        <MagnifyingGlassIcon className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
        <input
          type="text"
          placeholder={language === 'ru' ? 'Поиск криптовалют...' : 'Search cryptocurrencies...'}
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          className="w-full pl-10 pr-4 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
        />
      </div>

      {/* Category filter */}
      <div>
        <label className="flex items-center space-x-2 text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          <FunnelIcon className="h-4 w-4" />
          <span>{language === 'ru' ? 'Категория' : 'Category'}</span>
        </label>
        <select
          value={filterCategory}
          onChange={(e) => setFilterCategory(e.target.value as ElementCategory | 'all')}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
        >
          {categoryOptions.map(option => (
            <option key={option.value} value={option.value}>
              {option.label}
            </option>
          ))}
        </select>
      </div>

      {/* View mode toggle */}
      <div>
        <label className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 block">
          {language === 'ru' ? 'Режим просмотра' : 'View Mode'}
        </label>
        <div className="flex space-x-2">
          <Button
            variant={viewMode === '3d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('3d')}
            className="flex items-center space-x-1"
          >
            <CubeIcon className="h-4 w-4" />
            <span>3D</span>
          </Button>
          <Button
            variant={viewMode === '2d' ? 'primary' : 'outline'}
            size="sm"
            onClick={() => setViewMode('2d')}
            className="flex items-center space-x-1"
          >
            <TableCellsIcon className="h-4 w-4" />
            <span>2D</span>
          </Button>
        </div>
      </div>

      {/* Category legend */}
      <div>
        <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'ru' ? 'Легенда' : 'Legend'}
        </h4>
        <div className="space-y-1">
          {Object.entries(categoryColors).map(([category, color]) => (
            <div key={category} className="flex items-center space-x-2">
              <div 
                className="w-3 h-3 rounded"
                style={{ backgroundColor: color }}
              />
              <span className="text-xs text-gray-600 dark:text-gray-400">
                {categoryTranslations[language][category as ElementCategory]}
              </span>
            </div>
          ))}
        </div>
      </div>

      {/* Instructions */}
      <div className="border-t pt-3 mt-3">
        <p className="text-xs text-gray-500 dark:text-gray-400">
          {language === 'ru' 
            ? 'Нажмите на элемент для получения подробной информации. Используйте мышь для навигации в 3D.'
            : 'Click on an element for detailed information. Use mouse to navigate in 3D.'}
        </p>
      </div>
    </div>
  )
}