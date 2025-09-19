'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { formatPrice } from '@/lib/consulting'
import type { ConsultationService } from '@/types'
import { 
  CheckIcon,
  ClockIcon,
  StarIcon
} from '@heroicons/react/24/outline'

interface ServiceCardProps {
  service: ConsultationService
  onSelect: (service: ConsultationService) => void
}

export function ServiceCard({ service, onSelect }: ServiceCardProps) {
  return (
    <motion.div
      whileHover={{ y: -4 }}
      transition={{ duration: 0.2 }}
      className="h-full"
    >
      <Card className={`h-full flex flex-col relative ${
        service.popular ? 'ring-2 ring-primary shadow-lg' : ''
      }`}>
        {/* Popular badge */}
        {service.popular && (
          <div className="absolute -top-3 left-1/2 transform -translate-x-1/2">
            <div className="bg-primary text-white px-3 py-1 rounded-full text-sm font-medium flex items-center space-x-1">
              <StarIcon className="h-4 w-4" />
              <span>Популярно</span>
            </div>
          </div>
        )}

        <div className="p-6 flex-1 flex flex-col">
          {/* Header */}
          <div className="mb-4">
            <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
              {service.name}
            </h3>
            <p className="text-gray-600 dark:text-gray-400 text-sm">
              {service.description}
            </p>
          </div>

          {/* Price and duration */}
          <div className="mb-6">
            <div className="flex items-baseline space-x-2 mb-2">
              <span className="text-3xl font-bold text-primary">
                {formatPrice(service.price)}
              </span>
              <span className="text-gray-500 dark:text-gray-400">
                / проект
              </span>
            </div>
            <div className="flex items-center space-x-1 text-sm text-gray-600 dark:text-gray-400">
              <ClockIcon className="h-4 w-4" />
              <span>{service.duration} час{service.duration > 1 ? (service.duration < 5 ? 'а' : 'ов') : ''}</span>
            </div>
          </div>

          {/* Features */}
          <div className="flex-1">
            <h4 className="font-semibold text-gray-900 dark:text-white mb-3">
              Что включено:
            </h4>
            <ul className="space-y-2">
              {service.features.map((feature, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <CheckIcon className="h-4 w-4 text-green-500 mt-0.5 flex-shrink-0" />
                  <span className="text-sm text-gray-600 dark:text-gray-400">
                    {feature}
                  </span>
                </li>
              ))}
            </ul>
          </div>

          {/* CTA Button */}
          <div className="mt-6">
            <Button 
              onClick={() => onSelect(service)}
              variant={service.popular ? 'primary' : 'outline'}
              className="w-full"
            >
              Выбрать пакет
            </Button>
          </div>
        </div>
      </Card>
    </motion.div>
  )
}

// Default export for lazy loading
export default ServiceCard