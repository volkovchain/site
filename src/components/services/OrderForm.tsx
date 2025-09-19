'use client'

import React, { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Modal } from '@/components/ui/Modal'
import { Button } from '@/components/ui/Button'
import useServiceStore from '@/stores/useServiceStore'
import { useAppStore } from '@/stores/useAppStore'
import { ServiceSelectionStep } from './steps/ServiceSelectionStep'
import { ProjectDetailsStep } from './steps/ProjectDetailsStep'
import { ContactInfoStep } from './steps/ContactInfoStep'
import { TechnicalDetailsStep } from './steps/TechnicalDetailsStep'
import { ReviewSubmitStep } from './steps/ReviewSubmitStep'
import { ProgressIndicator } from './ProgressIndicator'
import { 
  CheckIcon,
  XMarkIcon
} from '@heroicons/react/24/outline'

interface OrderFormProps {
  open: boolean
  onClose: () => void
}

const steps = [
  {
    id: 'services',
    title: { ru: 'Выбор услуг', en: 'Service Selection' },
    description: { ru: 'Выберите нужные услуги', en: 'Choose your services' },
    component: ServiceSelectionStep
  },
  {
    id: 'project',
    title: { ru: 'О проекте', en: 'Project Details' },
    description: { ru: 'Расскажите о вашем проекте', en: 'Tell us about your project' },
    component: ProjectDetailsStep
  },
  {
    id: 'contact',
    title: { ru: 'Контактная информация', en: 'Contact Information' },
    description: { ru: 'Ваши контактные данные', en: 'Your contact details' },
    component: ContactInfoStep
  },
  {
    id: 'technical',
    title: { ru: 'Технические детали', en: 'Technical Details' },
    description: { ru: 'Технические требования', en: 'Technical requirements' },
    component: TechnicalDetailsStep
  },
  {
    id: 'review',
    title: { ru: 'Проверка и отправка', en: 'Review & Submit' },
    description: { ru: 'Проверьте данные и отправьте', en: 'Review and submit your order' },
    component: ReviewSubmitStep
  }
]

export function OrderForm({ open, onClose }: OrderFormProps) {
  const { language } = useAppStore()
  const {
    currentFormStep,
    formValidation,
    isSubmittingOrder,
    orderFormData,
    setFormStep,
    validateFormStep,
    resetOrder,
    submitOrder
  } = useServiceStore()
  
  const [isSubmitted, setIsSubmitted] = useState(false)
  const [submitResult, setSubmitResult] = useState<any>(null)
  
  const currentStep = steps[currentFormStep]
  const StepComponent = currentStep?.component
  
  const canGoNext = () => {
    return validateFormStep(currentFormStep)
  }
  
  const canGoPrevious = () => {
    return currentFormStep > 0
  }
  
  const handleNext = () => {
    if (canGoNext() && currentFormStep < steps.length - 1) {
      setFormStep(currentFormStep + 1)
    }
  }
  
  const handlePrevious = () => {
    if (canGoPrevious()) {
      setFormStep(currentFormStep - 1)
    }
  }
  
  const handleSubmit = async () => {
    if (!validateFormStep(currentFormStep)) {
      return
    }
    
    try {
      const result = await submitOrder(orderFormData)
      setSubmitResult(result)
      setIsSubmitted(true)
    } catch (error) {
      console.error('Order submission error:', error)
      // Error handling is done in the store
    }
  }
  
  const handleClose = () => {
    if (!isSubmittingOrder) {
      if (isSubmitted) {
        resetOrder()
        setIsSubmitted(false)
        setSubmitResult(null)
      }
      onClose()
    }
  }
  
  if (!open) return null
  
  return (
    <Modal
      open={open}
      onClose={handleClose}
      title={isSubmitted 
        ? (language === 'ru' ? 'Заказ отправлен!' : 'Order Submitted!')
        : currentStep?.title[language] || ''
      }
      size="xl"
    >
      <div className="space-y-6">
        {!isSubmitted ? (
          <>
            {/* Progress Indicator */}
            <ProgressIndicator
              steps={steps.map(step => ({
                title: step.title[language],
                description: step.description[language]
              }))}
              currentStep={currentFormStep}
              completedSteps={Array.from({ length: currentFormStep }, (_, i) => i)}
            />
            
            {/* Step Content */}
            <div className="min-h-[400px]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentFormStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="h-full"
                >
                  {StepComponent && (
                    <StepComponent
                      language={language}
                      validation={formValidation}
                    />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
            
            {/* Navigation Buttons */}
            <div className="flex items-center justify-between pt-6 border-t border-gray-200 dark:border-gray-700">
              <Button
                variant="outline"
                onClick={handlePrevious}
                disabled={!canGoPrevious() || isSubmittingOrder}
              >
                {language === 'ru' ? 'Назад' : 'Previous'}
              </Button>
              
              <div className="flex items-center space-x-2">
                <span className="text-sm text-gray-500 dark:text-gray-400">
                  {language === 'ru' 
                    ? `Шаг ${currentFormStep + 1} из ${steps.length}`
                    : `Step ${currentFormStep + 1} of ${steps.length}`
                  }
                </span>
              </div>
              
              {currentFormStep < steps.length - 1 ? (
                <Button
                  onClick={handleNext}
                  disabled={!canGoNext() || isSubmittingOrder}
                >
                  {language === 'ru' ? 'Далее' : 'Next'}
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={!canGoNext() || isSubmittingOrder}
                >
                  {isSubmittingOrder 
                    ? (language === 'ru' ? 'Отправка...' : 'Submitting...')
                    : (language === 'ru' ? 'Отправить заказ' : 'Submit Order')
                  }
                </Button>
              )}
            </div>
            
            {/* Validation Errors */}
            {Object.keys(formValidation).length > 0 && (
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg p-4">
                <div className="flex items-start">
                  <XMarkIcon className="h-5 w-5 text-red-500 mt-0.5 mr-2 flex-shrink-0" />
                  <div>
                    <h3 className="text-sm font-medium text-red-800 dark:text-red-200">
                      {language === 'ru' ? 'Пожалуйста, исправьте ошибки:' : 'Please fix the following errors:'}
                    </h3>
                    <ul className="mt-2 text-sm text-red-700 dark:text-red-300 space-y-1">
                      {Object.values(formValidation)
                        .filter(validation => !validation.isValid)
                        .map((validation, index) => (
                          <li key={index}>• {validation.message}</li>
                        ))
                      }
                    </ul>
                  </div>
                </div>
              </div>
            )}
          </>
        ) : (
          /* Success Message */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center py-8"
          >
            <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
              <CheckIcon className="h-8 w-8 text-green-600 dark:text-green-400" />
            </div>
            
            <h3 className="text-lg font-medium text-gray-900 dark:text-white mb-2">
              {language === 'ru' ? 'Заказ успешно отправлен!' : 'Order submitted successfully!'}
            </h3>
            
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {language === 'ru'
                ? 'Мы получили ваш заказ и свяжемся с вами в ближайшее время. Вы получите счет в течение 24-48 часов.'
                : 'We have received your order and will contact you soon. You will receive an invoice within 24-48 hours.'
              }
            </p>
            
            {submitResult && (
              <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-4 mb-6 text-left">
                <h4 className="font-medium text-gray-900 dark:text-white mb-2">
                  {language === 'ru' ? 'Детали заказа:' : 'Order Details:'}
                </h4>
                <div className="space-y-1 text-sm text-gray-600 dark:text-gray-400">
                  <div>
                    <span className="font-medium">
                      {language === 'ru' ? 'Номер заказа:' : 'Order ID:'}
                    </span>
                    <span className="ml-2 font-mono">{submitResult.orderId}</span>
                  </div>
                  {submitResult.estimatedTotal && (
                    <div>
                      <span className="font-medium">
                        {language === 'ru' ? 'Ориентировочная стоимость:' : 'Estimated Total:'}
                      </span>
                      <span className="ml-2">
                        ${submitResult.estimatedTotal.min.toLocaleString()} - 
                        ${submitResult.estimatedTotal.max.toLocaleString()} {submitResult.estimatedTotal.currency}
                      </span>
                    </div>
                  )}
                  {submitResult.trackingUrl && (
                    <div>
                      <span className="font-medium">
                        {language === 'ru' ? 'Отслеживание:' : 'Tracking:'}
                      </span>
                      <a 
                        href={submitResult.trackingUrl}
                        className="ml-2 text-primary hover:underline"
                        target="_blank"
                        rel="noopener noreferrer"
                      >
                        {language === 'ru' ? 'Отследить заказ' : 'Track Order'}
                      </a>
                    </div>
                  )}
                </div>
              </div>
            )}
            
            <div className="flex justify-center space-x-4">
              <Button
                variant="primary"
                onClick={handleClose}
              >
                {language === 'ru' ? 'Закрыть' : 'Close'}
              </Button>
              
              {submitResult?.trackingUrl && (
                <Button
                  variant="outline"
                  onClick={() => window.open(submitResult.trackingUrl, '_blank')}
                >
                  {language === 'ru' ? 'Отследить заказ' : 'Track Order'}
                </Button>
              )}
            </div>
          </motion.div>
        )}
      </div>
    </Modal>
  )
}

export default OrderForm