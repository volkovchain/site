'use client'

import React from 'react'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/useAppStore'
import { formatCurrency, formatDate } from '@/lib/utils'
import { categoryTranslations } from '@/lib/periodicData'
import type { PeriodicElement } from '@/types'
import { 
  GlobeAltIcon, 
  DocumentTextIcon, 
  CalendarIcon,
  CurrencyDollarIcon,
  LinkIcon,
  ChartBarIcon
} from '@heroicons/react/24/outline'

interface ElementDetailModalProps {
  element: PeriodicElement
  open: boolean
  onClose: () => void
}

export function ElementDetailModal({ element, open, onClose }: ElementDetailModalProps) {
  const { language } = useAppStore()
  
  const categoryName = categoryTranslations[language][element.category]

  return (
    <Modal
      open={open}
      onClose={onClose}
      title={element.name}
      size="lg"
      className="max-h-[90vh] overflow-y-auto"
    >
      <div className="space-y-6">
        {/* Header with symbol and basic info */}
        <div className="flex items-center space-x-4">
          <div 
            className="w-16 h-16 rounded-lg flex items-center justify-center text-white text-2xl font-bold"
            style={{ backgroundColor: element.color }}
          >
            {element.symbol}
          </div>
          <div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white">
              {element.name}
            </h2>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              #{element.atomicNumber} • {categoryName}
            </p>
          </div>
        </div>

        {/* Description */}
        <div className="bg-gray-50 dark:bg-gray-700 rounded-lg p-4">
          <p className="text-gray-700 dark:text-gray-300">
            {element.description}
          </p>
        </div>

        {/* Stats grid */}
        <div className="grid grid-cols-2 gap-4">
          {element.marketCap && (
            <div className="bg-green-50 dark:bg-green-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-green-600 dark:text-green-400" />
                <span className="text-sm font-medium text-green-800 dark:text-green-200">
                  Рыночная капитализация
                </span>
              </div>
              <p className="text-lg font-bold text-green-900 dark:text-green-100">
                {formatCurrency(element.marketCap)}
              </p>
            </div>
          )}

          {element.launchDate && (
            <div className="bg-blue-50 dark:bg-blue-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <CalendarIcon className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                <span className="text-sm font-medium text-blue-800 dark:text-blue-200">
                  Дата запуска
                </span>
              </div>
              <p className="text-lg font-bold text-blue-900 dark:text-blue-100">
                {formatDate(element.launchDate)}
              </p>
            </div>
          )}

          {element.consensus && (
            <div className="bg-purple-50 dark:bg-purple-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <ChartBarIcon className="h-5 w-5 text-purple-600 dark:text-purple-400" />
                <span className="text-sm font-medium text-purple-800 dark:text-purple-200">
                  Консенсус
                </span>
              </div>
              <p className="text-lg font-bold text-purple-900 dark:text-purple-100">
                {element.consensus}
              </p>
            </div>
          )}

          {element.blockchain && (
            <div className="bg-orange-50 dark:bg-orange-900/20 rounded-lg p-4">
              <div className="flex items-center space-x-2">
                <LinkIcon className="h-5 w-5 text-orange-600 dark:text-orange-400" />
                <span className="text-sm font-medium text-orange-800 dark:text-orange-200">
                  Блокчейн
                </span>
              </div>
              <p className="text-lg font-bold text-orange-900 dark:text-orange-100">
                {element.blockchain}
              </p>
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex flex-wrap gap-3">
          {element.website && (
            <Button
              variant="outline"
              onClick={() => window.open(element.website, '_blank')}
              className="flex items-center space-x-2"
            >
              <GlobeAltIcon className="h-4 w-4" />
              <span>Официальный сайт</span>
            </Button>
          )}

          {element.documentation && (
            <Button
              variant="outline"
              onClick={() => window.open(element.documentation, '_blank')}
              className="flex items-center space-x-2"
            >
              <DocumentTextIcon className="h-4 w-4" />
              <span>Документация</span>
            </Button>
          )}
        </div>

        {/* Special content for VolkovChain */}
        {element.symbol === 'Vc' && (
          <div className="border-t pt-6 mt-6">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              Экспертиза в блокчейн-разработке
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="text-center p-4 bg-rust-50 dark:bg-rust-900/20 rounded-lg">
                <div className="text-2xl font-bold text-rust-600 dark:text-rust-400">Rust</div>
                <p className="text-sm text-rust-800 dark:text-rust-200">Layer-1 протоколы</p>
              </div>
              <div className="text-center p-4 bg-blue-50 dark:bg-blue-900/20 rounded-lg">
                <div className="text-2xl font-bold text-blue-600 dark:text-blue-400">Solidity</div>
                <p className="text-sm text-blue-800 dark:text-blue-200">Смарт-контракты</p>
              </div>
              <div className="text-center p-4 bg-green-50 dark:bg-green-900/20 rounded-lg">
                <div className="text-2xl font-bold text-green-600 dark:text-green-400">Go</div>
                <p className="text-sm text-green-800 dark:text-green-200">Бэкенд системы</p>
              </div>
            </div>
          </div>
        )}
      </div>
    </Modal>
  )
}