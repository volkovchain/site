'use client'

import React from 'react'
import { motion } from 'framer-motion'
import useServiceStore from '@/stores/useServiceStore'
import { serviceRegistry } from '@/lib/serviceRegistry'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ValidationState } from '@/types'
import { 
  CheckCircleIcon,
  CurrencyDollarIcon,
  ClockIcon,
  UserIcon,
  BuildingOfficeIcon,
  EnvelopeIcon,
  GlobeAltIcon,
  CodeBracketIcon,
  DocumentCheckIcon
} from '@heroicons/react/24/outline'

interface ReviewSubmitStepProps {
  language: 'ru' | 'en'
  validation: ValidationState
}

const budgetOptions = [
  { value: 'under_1k', label: { ru: 'До $1,000', en: 'Under $1,000' } },
  { value: '1k_5k', label: { ru: '$1,000 - $5,000', en: '$1,000 - $5,000' } },
  { value: '5k_15k', label: { ru: '$5,000 - $15,000', en: '$5,000 - $15,000' } },
  { value: '15k_plus', label: { ru: 'Свыше $15,000', en: '$15,000+' } },
  { value: 'enterprise', label: { ru: 'Корпоративный', en: 'Enterprise' } }
]

const timelineOptions = [
  { value: 'rush', label: { ru: 'Срочно (1-2 недели)', en: 'Rush (1-2 weeks)' } },
  { value: 'standard', label: { ru: 'Стандартно (1-2 месяца)', en: 'Standard (1-2 months)' } },
  { value: 'flexible', label: { ru: 'Гибкий график', en: 'Flexible timeline' } },
  { value: 'long_term', label: { ru: 'Долгосрочный (3+ месяцев)', en: 'Long-term (3+ months)' } }
]

export function ReviewSubmitStep({ 
  language, 
  validation 
}: ReviewSubmitStepProps) {
  const { 
    orderFormData, 
    updateOrderForm,
    getSelectedServiceDetails,
    getTotalPrice
  } = useServiceStore()
  
  const selectedServiceDetails = getSelectedServiceDetails()
  const totalPrice = getTotalPrice()
  
  const updateAdditionalInfo = (field: string, value: any) => {
    updateOrderForm({ [field]: value })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-8\"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ru' ? 'Проверка и отправка' : 'Review & Submit'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Проверьте все данные перед отправкой заказа'
            : 'Review all information before submitting your order'
          }
        </p>
      </div>
      
      {/* Selected Services Summary */}
      <div className="bg-gradient-to-br from-primary/5 to-blue-50 dark:from-primary/10 dark:to-gray-800 border border-primary/20 rounded-xl p-6">
        <div className="flex items-center mb-4">
          <CheckCircleIcon className="h-6 w-6 text-primary mr-2\" />
          <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
            {language === 'ru' ? 'Выбранные услуги' : 'Selected Services'} ({selectedServiceDetails.length})
          </h3>
        </div>
        
        <div className="space-y-4">
          {selectedServiceDetails.map((service) => (
            <div key={service.serviceId} className="bg-white dark:bg-gray-700 rounded-lg p-4">
              <div className="flex justify-between items-start mb-2">
                <div>
                  <h4 className="font-medium text-gray-900 dark:text-white">
                    {service.name[language]}
                  </h4>
                  <p className="text-sm text-gray-600 dark:text-gray-400">
                    {service.shortDescription[language]}
                  </p>
                </div>
                <div className="text-right">
                  <div className="font-semibold text-primary">
                    {serviceRegistry.formatPriceRange(service.priceRange, language)}
                  </div>
                  <div className="text-xs text-gray-500 flex items-center mt-1">
                    <ClockIcon className="h-3 w-3 mr-1\" />
                    {service.timeline}
                  </div>
                </div>
              </div>
              <div className="flex items-center text-xs text-gray-500 dark:text-gray-400">
                <span className={`px-2 py-1 rounded-full text-xs ${
                  service.complexity === 'Basic' 
                    ? 'bg-green-100 text-green-700 dark:bg-green-900 dark:text-green-200'
                    : service.complexity === 'Advanced'
                    ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900 dark:text-yellow-200'
                    : 'bg-red-100 text-red-700 dark:bg-red-900 dark:text-red-200'
                }`}>
                  {service.complexity}
                </span>
                <span className="ml-2">{service.metadata.supportLevel} Support</span>
              </div>
            </div>
          ))}
        </div>
        
        <div className="border-t border-primary/20 mt-4 pt-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center">
              <CurrencyDollarIcon className="h-5 w-5 text-primary mr-2\" />
              <span className="text-lg font-semibold text-gray-900 dark:text-white">
                {language === 'ru' ? 'Ориентировочная стоимость:' : 'Estimated Total:'}
              </span>
            </div>
            <span className="text-xl font-bold text-primary">
              ${totalPrice.min.toLocaleString()} - ${totalPrice.max.toLocaleString()} {totalPrice.currency}
            </span>
          </div>
          <p className="text-xs text-gray-500 dark:text-gray-400 mt-1">
            {language === 'ru'
              ? 'Окончательная цена будет указана в коммерческом предложении'
              : 'Final price will be provided in the detailed proposal'
            }
          </p>
        </div>
      </div>
      
      {/* Project Summary */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Project Details */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <DocumentCheckIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2\" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {language === 'ru' ? 'Детали проекта' : 'Project Details'}
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {language === 'ru' ? 'Название:' : 'Title:'}
              </span>
              <p className="text-gray-900 dark:text-white mt-1">{orderFormData.projectDetails.title}</p>
            </div>
            <div>
              <span className="font-medium text-gray-600 dark:text-gray-400">
                {language === 'ru' ? 'Описание:' : 'Description:'}
              </span>
              <p className="text-gray-900 dark:text-white mt-1 line-clamp-3">
                {orderFormData.projectDetails.description}
              </p>
            </div>
            {orderFormData.projectDetails.objectives.length > 0 && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {language === 'ru' ? 'Цели:' : 'Objectives:'}
                </span>
                <ul className="mt-1 list-disc list-inside text-gray-900 dark:text-white">
                  {orderFormData.projectDetails.objectives.slice(0, 3).map((objective, index) => (
                    objective && <li key={index}>{objective}</li>
                  ))}
                  {orderFormData.projectDetails.objectives.length > 3 && (
                    <li className="text-gray-500">+{orderFormData.projectDetails.objectives.length - 3} more</li>
                  )}
                </ul>
              </div>
            )}
          </div>
        </div>
        
        {/* Contact Information */}
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <UserIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2\" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {language === 'ru' ? 'Контактная информация' : 'Contact Information'}
            </h3>
          </div>
          <div className="space-y-3 text-sm">
            <div className="flex items-center">
              <UserIcon className="h-4 w-4 text-gray-400 mr-2\" />
              <span className="text-gray-900 dark:text-white">
                {orderFormData.contactInfo.firstName} {orderFormData.contactInfo.lastName}
              </span>
            </div>
            <div className="flex items-center">
              <EnvelopeIcon className="h-4 w-4 text-gray-400 mr-2\" />
              <span className="text-gray-900 dark:text-white">{orderFormData.contactInfo.email}</span>
            </div>
            {orderFormData.contactInfo.company && (
              <div className="flex items-center">
                <BuildingOfficeIcon className="h-4 w-4 text-gray-400 mr-2\" />
                <span className="text-gray-900 dark:text-white">
                  {orderFormData.contactInfo.company}
                  {orderFormData.contactInfo.position && ` - ${orderFormData.contactInfo.position}`}
                </span>
              </div>
            )}
            <div className="flex items-center">
              <GlobeAltIcon className="h-4 w-4 text-gray-400 mr-2\" />
              <span className="text-gray-900 dark:text-white">{orderFormData.contactInfo.timezone}</span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Technical Information */}
      {(orderFormData.technicalInfo.hasExistingCode || 
        orderFormData.technicalInfo.preferredTechStack.length > 0 || 
        orderFormData.technicalInfo.requiredIntegrations.length > 0) && (
        <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6">
          <div className="flex items-center mb-4">
            <CodeBracketIcon className="h-5 w-5 text-gray-600 dark:text-gray-400 mr-2\" />
            <h3 className="font-semibold text-gray-900 dark:text-white">
              {language === 'ru' ? 'Технические требования' : 'Technical Requirements'}
            </h3>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
            {orderFormData.technicalInfo.preferredTechStack.length > 0 && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {language === 'ru' ? 'Технологии:' : 'Tech Stack:'}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {orderFormData.technicalInfo.preferredTechStack.slice(0, 5).map((tech, index) => (
                    <span key={index} className="px-2 py-1 bg-primary/10 text-primary rounded text-xs">
                      {tech}
                    </span>
                  ))}
                  {orderFormData.technicalInfo.preferredTechStack.length > 5 && (
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs">
                      +{orderFormData.technicalInfo.preferredTechStack.length - 5}
                    </span>
                  )}
                </div>
              </div>
            )}
            {orderFormData.technicalInfo.requiredIntegrations.length > 0 && (
              <div>
                <span className="font-medium text-gray-600 dark:text-gray-400">
                  {language === 'ru' ? 'Интеграции:' : 'Integrations:'}
                </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {orderFormData.technicalInfo.requiredIntegrations.slice(0, 3).map((integration, index) => (
                    <span key={index} className="px-2 py-1 bg-blue-100 dark:bg-blue-900 text-blue-700 dark:text-blue-200 rounded text-xs">
                      {integration}
                    </span>
                  ))}
                  {orderFormData.technicalInfo.requiredIntegrations.length > 3 && (
                    <span className="px-2 py-1 bg-gray-200 dark:bg-gray-600 text-gray-600 dark:text-gray-300 rounded text-xs">
                      +{orderFormData.technicalInfo.requiredIntegrations.length - 3}
                    </span>
                  )}
                </div>
              </div>
            )}
          </div>
        </div>
      )}
      
      {/* Additional Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'ru' ? 'Ориентировочный бюджет' : 'Estimated Budget'}
          </label>
          <Select
            value={orderFormData.estimatedBudget || ''}
            onChange={(value) => updateAdditionalInfo('estimatedBudget', value)}
            options={budgetOptions.map(option => ({
              value: option.value,
              label: option.label[language]
            }))}
            placeholder={language === 'ru' ? 'Выберите бюджет' : 'Select budget range'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'ru' ? 'Временные рамки' : 'Timeline'}
          </label>
          <Select
            value={orderFormData.timeline}
            onChange={(value) => updateAdditionalInfo('timeline', value)}
            options={timelineOptions.map(option => ({
              value: option.value,
              label: option.label[language]
            }))}
          />
        </div>
      </div>
      
      {/* Additional Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'ru' ? 'Дополнительные требования' : 'Additional Requirements'}
        </label>
        <textarea
          rows={4}
          value={orderFormData.additionalRequirements || ''}
          onChange={(e) => updateAdditionalInfo('additionalRequirements', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent\"
          placeholder={language === 'ru'
            ? 'Укажите любые дополнительные требования, пожелания или особенности проекта...'
            : 'Specify any additional requirements, preferences, or project specifics...'
          }
        />
      </div>
      
      {/* Terms and Conditions */}
      <div className="space-y-4 p-6 bg-gray-50 dark:bg-gray-800 rounded-lg">
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="agreesToTerms"
            checked={orderFormData.agreesToTerms}
            onChange={(e) => updateAdditionalInfo('agreesToTerms', e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
            required
          />
          <label htmlFor="agreesToTerms" className="text-sm text-gray-700 dark:text-gray-300">
            {language === 'ru'
              ? 'Я согласен с условиями предоставления услуг и обработкой персональных данных *'
              : 'I agree to the terms of service and privacy policy *'
            }
          </label>
        </div>
        
        <div className="flex items-start space-x-3">
          <input
            type="checkbox"
            id="marketingOptIn"
            checked={orderFormData.marketingOptIn}
            onChange={(e) => updateAdditionalInfo('marketingOptIn', e.target.checked)}
            className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="marketingOptIn" className="text-sm text-gray-700 dark:text-gray-300">
            {language === 'ru'
              ? 'Я хочу получать информацию о новых услугах и специальных предложениях'
              : 'I would like to receive information about new services and special offers'
            }
          </label>
        </div>
        
        {validation.agreesToTerms && !validation.agreesToTerms.isValid && (
          <p className="text-red-600 dark:text-red-400 text-sm">
            {validation.agreesToTerms.message}
          </p>
        )}
      </div>
      
      {/* Important Notice */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <h4 className="font-medium text-blue-900 dark:text-blue-100 mb-2">
          {language === 'ru' ? 'Что происходит дальше?' : 'What happens next?'}
        </h4>
        <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-1">
          <li>• {language === 'ru' 
            ? 'Мы рассмотрим ваш заказ в течение 24 часов'
            : 'We will review your order within 24 hours'
          }</li>
          <li>• {language === 'ru'
            ? 'Вы получите детальное коммерческое предложение с окончательными ценами'
            : 'You will receive a detailed proposal with final pricing'
          }</li>
          <li>• {language === 'ru'
            ? 'После согласования условий мы вышлем счет для оплаты'
            : 'After terms agreement, we will send an invoice for payment'
          }</li>
          <li>• {language === 'ru'
            ? 'Работа начнется сразу после поступления оплаты'
            : 'Work begins immediately after payment is received'
          }</li>
        </ul>
      </div>
    </motion.div>
  )
}

export default ReviewSubmitStep