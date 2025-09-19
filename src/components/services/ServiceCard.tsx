'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import type { Service } from '@/types'
import { serviceRegistry } from '@/lib/serviceRegistry'
import { 
  CheckIcon,
  ClockIcon,
  StarIcon,
  CurrencyDollarIcon,
  TagIcon
} from '@heroicons/react/24/outline'

interface ServiceCardProps {
  service: Service
  isSelected?: boolean
  onSelect: () => void
  language: 'ru' | 'en'
  showFullDescription?: boolean
  compact?: boolean
}

export function ServiceCard({ 
  service, 
  isSelected = false, 
  onSelect, 
  language,
  showFullDescription = false,
  compact = false
}: ServiceCardProps) {
  const priceDisplay = serviceRegistry.formatPriceRange(service.priceRange, language)
  
  return (
    <motion.div
      whileHover={{ y: -4, scale: 1.02 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col relative transition-all duration-200 ${
        isSelected 
          ? 'ring-2 ring-primary shadow-lg bg-primary/5' 
          : 'hover:shadow-lg'
      } ${
        service.isPopular ? 'border-primary/20' : ''
      }`}>
        {/* Popular Badge */}
        {service.isPopular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2 z-10">
            <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <StarIcon className="h-4 w-4" />
              <span>{language === 'ru' ? 'Популярно' : 'Popular'}</span>
            </div>
          </div>
        )}
        
        {/* Selection Indicator */}
        {isSelected && (
          <div className="absolute top-4 right-4 z-10">
            <div className="bg-primary text-white rounded-full p-1">
              <CheckIcon className="h-4 w-4" />
            </div>
          </div>
        )}

        <div className={`${compact ? 'p-4' : 'p-6'} flex-1 flex flex-col`}>
          {/* Header */}
          <div className="mb-4">
            <div className="flex items-start justify-between mb-2">
              <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                {service.name[language]}
              </h3>
              <div className="flex items-center space-x-1">
                {/* Complexity Badge */}
                <span className={`px-2 py-1 rounded-full text-xs font-medium ${
                  service.complexity === 'Basic' 
                    ? 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-200'
                    : service.complexity === 'Advanced'
                    ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {service.complexity}
                </span>
              </div>
            </div>
            
            <p className="text-gray-600 dark:text-gray-400 text-sm leading-relaxed">
              {showFullDescription 
                ? service.fullDescription[language]
                : service.shortDescription[language]
              }
            </p>
          </div>

          {/* Price and Timeline */}
          <div className="mb-4 space-y-2">
            <div className="flex items-center justify-between">
              <div className="flex items-center space-x-2">
                <CurrencyDollarIcon className="h-5 w-5 text-primary" />
                <span className="font-bold text-lg text-gray-900 dark:text-white">
                  {priceDisplay}
                </span>
              </div>
              {service.priceRange.note && (
                <span className="text-xs text-gray-500 dark:text-gray-400">
                  {service.priceRange.note[language]}
                </span>
              )}
            </div>
            
            <div className="flex items-center space-x-2 text-sm text-gray-600 dark:text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span>{service.timeline}</span>
              <span>•</span>
              <span>
                {language === 'ru' 
                  ? `~${service.metadata.estimatedDeliveryDays} дней`
                  : `~${service.metadata.estimatedDeliveryDays} days`
                }
              </span>
            </div>
          </div>

          {/* Tags */}
          {!compact && service.tags.length > 0 && (
            <div className="mb-4">
              <div className="flex items-center space-x-1 text-xs">
                <TagIcon className="h-3 w-3 text-gray-400" />
                <div className="flex flex-wrap gap-1">
                  {service.tags.slice(0, 3).map((tag, index) => (
                    <span 
                      key={index}
                      className="px-2 py-1 bg-gray-100 dark:bg-gray-700 text-gray-600 dark:text-gray-300 rounded"
                    >
                      {tag}
                    </span>
                  ))}
                  {service.tags.length > 3 && (
                    <span className="px-2 py-1 text-gray-400">+{service.tags.length - 3}</span>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* Features */}
          {!compact && (
            <div className="flex-1 mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                {language === 'ru' ? 'Что включено:' : 'What\'s included:'}
              </h4>
              <ul className="space-y-1">
                {service.features.slice(0, showFullDescription ? undefined : 4).map((feature, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckIcon className="h-3 w-3 text-green-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {feature}
                    </span>
                  </li>
                ))}
                {!showFullDescription && service.features.length > 4 && (
                  <li className="text-xs text-gray-500 dark:text-gray-400 ml-5">
                    +{service.features.length - 4} {language === 'ru' ? 'еще' : 'more'}
                  </li>
                )}
              </ul>
            </div>
          )}

          {/* Deliverables */}
          {!compact && showFullDescription && service.deliverables.length > 0 && (
            <div className="mb-4">
              <h4 className="font-semibold text-gray-900 dark:text-white mb-2 text-sm">
                {language === 'ru' ? 'Результаты:' : 'Deliverables:'}
              </h4>
              <ul className="space-y-1">
                {service.deliverables.map((deliverable, index) => (
                  <li key={index} className="flex items-start space-x-2 text-sm">
                    <CheckIcon className="h-3 w-3 text-blue-500 mt-0.5 flex-shrink-0" />
                    <span className="text-gray-600 dark:text-gray-400 leading-relaxed">
                      {deliverable}
                    </span>
                  </li>
                ))}
              </ul>
            </div>
          )}

          {/* Service Metadata */}
          {!compact && (
            <div className="mb-4 text-xs text-gray-500 dark:text-gray-400 space-y-1">
              <div className="flex justify-between">
                <span>{language === 'ru' ? 'Поддержка:' : 'Support:'}</span>
                <span>{service.metadata.supportLevel}</span>
              </div>
              {service.metadata.teamSize && (
                <div className="flex justify-between">
                  <span>{language === 'ru' ? 'Команда:' : 'Team:'}</span>
                  <span>{service.metadata.teamSize}</span>
                </div>
              )}
              {service.metadata.requiresDiscovery && (
                <div className="text-orange-600 dark:text-orange-400">
                  {language === 'ru' 
                    ? '* Требуется предварительная консультация'
                    : '* Discovery phase required'
                  }
                </div>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="mt-auto">
            <Button 
              onClick={onSelect}
              variant={isSelected ? 'primary' : service.isPopular ? 'primary' : 'outline'}
              className="w-full"
              size={compact ? 'sm' : 'md'}
            >
              {isSelected 
                ? (language === 'ru' ? '✓ Выбрано' : '✓ Selected')
                : (language === 'ru' ? 'Выбрать услугу' : 'Select Service')
              }
            </Button>
          </div>

          {/* Customization Note */}
          {service.isCustomizable && !compact && (
            <p className="text-xs text-gray-500 dark:text-gray-400 mt-2 text-center">
              {language === 'ru' 
                ? 'Возможна настройка под ваши требования'
                : 'Customizable to your requirements'
              }
            </p>
          )}
        </div>
      </Card>
    </motion.div>
  )
}

export default ServiceCard