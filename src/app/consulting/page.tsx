'use client'

import React, { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { 
  ArrowRightIcon,
  ExclamationTriangleIcon
} from '@heroicons/react/24/outline'

/**
 * Legacy consulting page - redirects to new services structure
 * This page maintains backward compatibility for existing links
 */
export default function ConsultingPage() {
  const router = useRouter()
  const { language } = useAppStore()
  
  useEffect(() => {
    // Automatic redirect after 3 seconds
    const timer = setTimeout(() => {
      router.push('/services?category=consulting')
    }, 3000)
    
    return () => clearTimeout(timer)
  }, [router])
  
  const handleRedirect = () => {
    router.push('/services?category=consulting')
  }
  
  return (
    <div className="min-h-screen flex items-center justify-center py-12">
      <div className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Warning Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-yellow-100 dark:bg-yellow-900 mb-6">
            <ExclamationTriangleIcon className="h-8 w-8 text-yellow-600 dark:text-yellow-400" />
          </div>
          
          {/* Migration Notice */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ru' ? 'Страница перемещена' : 'Page Moved'}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-6">
            {language === 'ru'
              ? 'Консультационные услуги теперь являются частью нашего расширенного каталога услуг.'
              : 'Consulting services are now part of our expanded service catalog.'
            }
          </p>
          
          <p className="text-gray-500 dark:text-gray-400 mb-8">
            {language === 'ru'
              ? 'Вы будете автоматически перенаправлены через несколько секунд...'
              : 'You will be automatically redirected in a few seconds...'
            }
          </p>
          
          {/* Redirect Button */}
          <motion.button
            onClick={handleRedirect}
            className="inline-flex items-center px-6 py-3 border border-transparent text-base font-medium rounded-md text-white bg-primary hover:bg-primary/90 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-primary transition-colors"
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
            {language === 'ru' ? 'Перейти к услугам' : 'Go to Services'}
            <ArrowRightIcon className="ml-2 h-5 w-5" />
          </motion.button>
          
          {/* Additional Info */}
          <div className="mt-12 p-6 bg-blue-50 dark:bg-blue-900/20 rounded-lg border border-blue-200 dark:border-blue-800">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-2">
              {language === 'ru' ? 'Что изменилось?' : 'What changed?'}
            </h3>
            <ul className="text-blue-800 dark:text-blue-200 text-sm space-y-2 text-left">
              <li>• {language === 'ru' 
                ? 'Консультации теперь часть более широкого каталога услуг'
                : 'Consulting is now part of a broader service catalog'
              }</li>
              <li>• {language === 'ru'
                ? 'Добавлены новые категории: обучение, разработка, контент'
                : 'Added new categories: education, development, content'
              }</li>
              <li>• {language === 'ru'
                ? 'Улучшенная форма заказа с пошаговым процессом'
                : 'Enhanced order form with step-by-step process'
              }</li>
              <li>• {language === 'ru'
                ? 'Возможность комбинирования нескольких услуг'
                : 'Ability to combine multiple services'
              }</li>
              <li>• {language === 'ru'
                ? 'Переход на ручную обработку платежей для большей гибкости'
                : 'Manual payment processing for greater flexibility'
              }</li>
            </ul>
          </div>
          
          {/* Contact Info */}
          <div className="mt-8 text-sm text-gray-500 dark:text-gray-400">
            <p>
              {language === 'ru'
                ? 'Вопросы? Свяжитесь с нами:'
                : 'Questions? Contact us:'
              }
              {' '}
              <a 
                href="mailto:hello@volkovchain.com" 
                className="text-primary hover:underline"
              >
                hello@volkovchain.com
              </a>
            </p>
          </div>
        </motion.div>
      </div>
    </div>
  )
}