'use client'

import React from 'react'
import { motion } from 'framer-motion'
import useServiceStore from '@/stores/useServiceStore'
import { ServiceCard } from '../ServiceCard'
import type { ValidationState } from '@/types'
import { serviceRegistry } from '@/lib/serviceRegistry'

interface ServiceSelectionStepProps {
  language: 'ru' | 'en'
  validation: ValidationState
}

export function ServiceSelectionStep({ 
  language, 
  validation 
}: ServiceSelectionStepProps) {
  const {
    selectedServices,
    selectService,
    getSelectedServiceDetails,
    getTotalPrice
  } = useServiceStore()
  
  const categories = serviceRegistry.getServiceCategories()
  const selectedServiceDetails = getSelectedServiceDetails()
  const totalPrice = getTotalPrice()
  
  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ru' ? 'Выберите услуги' : 'Select Services'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Выберите одну или несколько услуг для вашего проекта'
            : 'Choose one or more services for your project'
          }
        </p>
      </div>
      
      {/* Selected Services Summary */}
      {selectedServices.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-primary/5 border border-primary/20 rounded-lg p-4\"
        >
          <h3 className="font-semibold text-gray-900 dark:text-white mb-3">
            {language === 'ru' ? 'Выбранные услуги' : 'Selected Services'} ({selectedServices.length})
          </h3>
          <div className="space-y-2">
            {selectedServiceDetails.map((service) => (
              <div key={service.serviceId} className="flex items-center justify-between text-sm">
                <span className="text-gray-700 dark:text-gray-300">
                  {service.name[language]}
                </span>
                <span className="font-medium text-primary">
                  {serviceRegistry.formatPriceRange(service.priceRange, language)}
                </span>
              </div>
            ))}
          </div>
          <div className="border-t border-primary/20 mt-3 pt-3">
            <div className="flex items-center justify-between font-semibold">
              <span className="text-gray-900 dark:text-white">
                {language === 'ru' ? 'Общая стоимость:' : 'Total Cost:'}
              </span>
              <span className="text-primary text-lg">
                ${totalPrice.min.toLocaleString()} - ${totalPrice.max.toLocaleString()} {totalPrice.currency}
              </span>
            </div>
          </div>
        </motion.div>
      )}
      
      {/* Service Categories */}
      <div className="space-y-8">
        {categories.map((category, categoryIndex) => (
          <motion.section
            key={category.categoryId}
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: categoryIndex * 0.1 }}
          >
            <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {category.name[language]}
            </h3>
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
              {category.services.map((service, serviceIndex) => (
                <motion.div
                  key={service.serviceId}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ 
                    duration: 0.3, 
                    delay: categoryIndex * 0.1 + serviceIndex * 0.05 
                  }}
                >
                  <ServiceCard
                    service={service}
                    isSelected={selectedServices.includes(service.serviceId)}
                    onSelect={() => selectService(service.serviceId)}
                    language={language}
                    compact={true}
                  />
                </motion.div>
              ))}
            </div>
          </motion.section>
        ))}
      </div>
      
      {/* Validation Error */}
      {validation.selectedServices && !validation.selectedServices.isValid && (
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4\"
        >
          <p className="text-red-700 dark:text-red-300 text-sm">
            {validation.selectedServices.message}
          </p>
        </motion.div>
      )}
      
      {/* Help Text */}
      <div className="text-center text-sm text-gray-500 dark:text-gray-400">
        {language === 'ru'
          ? 'Вы можете выбрать несколько услуг. Цены являются ориентировочными и будут уточнены при составлении коммерческого предложения.'
          : 'You can select multiple services. Prices are estimates and will be refined in the final proposal.'
        }
      </div>
    </div>
  )
}

export default ServiceSelectionStep