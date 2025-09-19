'use client'

import React from 'react'
import { PeriodicTable3D } from '@/components/periodic-table/PeriodicTable3D'
import { useAppStore } from '@/stores/useAppStore'

export default function PeriodicTablePage() {
  const { language } = useAppStore()

  return (
    <div className="min-h-screen bg-dark">
      {/* Page header */}
      <div className="absolute top-4 right-4 z-10 bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4">
        <h1 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ru' 
            ? 'Интерактивная таблица криптовалют' 
            : 'Interactive Cryptocurrency Table'}
        </h1>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Исследуйте блокчейн-экосистему в формате периодической таблицы'
            : 'Explore the blockchain ecosystem in periodic table format'}
        </p>
      </div>

      {/* Main 3D periodic table */}
      <PeriodicTable3D />
    </div>
  )
}