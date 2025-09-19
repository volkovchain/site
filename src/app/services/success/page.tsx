'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckCircleIcon, DocumentDuplicateIcon } from '@heroicons/react/24/outline'
import { Button } from '@/components/ui/Button'
import { useAppStore } from '@/stores/useAppStore'

export default function OrderSuccessPage() {
  const { language } = useAppStore()
  const [copied, setCopied] = React.useState(false)
  
  // Get order details from URL params (would be passed from order submission)
  const orderId = 'ORD-1234567890' // This would come from URL params or state
  
  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text)
    setCopied(true)
    setTimeout(() => setCopied(false), 2000)
  }
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-center\"
        >
          {/* Success Icon */}
          <div className="mx-auto flex items-center justify-center h-16 w-16 rounded-full bg-green-100 dark:bg-green-900 mb-6">
            <CheckCircleIcon className="h-8 w-8 text-green-600 dark:text-green-400\" />
          </div>
          
          {/* Success Message */}
          <h1 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
            {language === 'ru' ? 'Заказ успешно отправлен!' : 'Order Submitted Successfully!'}
          </h1>
          
          <p className="text-lg text-gray-600 dark:text-gray-400 mb-8">
            {language === 'ru'
              ? 'Спасибо за ваш заказ! Мы получили вашу заявку и свяжемся с вами в ближайшее время.'
              : 'Thank you for your order! We have received your request and will contact you soon.'
            }
          </p>
          
          {/* Order Details */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 text-left">
            <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ru' ? 'Детали заказа' : 'Order Details'}
            </h2>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'ru' ? 'Номер заказа:' : 'Order Number:'}
                </span>
                <div className="flex items-center space-x-2">
                  <span className="font-mono text-gray-900 dark:text-white">{orderId}</span>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => copyToClipboard(orderId)}
                    className="p-1\"
                  >
                    <DocumentDuplicateIcon className="h-4 w-4" />
                  </Button>
                </div>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'ru' ? 'Дата:' : 'Date:'}
                </span>
                <span className="text-gray-900 dark:text-white">
                  {new Date().toLocaleDateString(language === 'ru' ? 'ru-RU' : 'en-US')}
                </span>
              </div>
              
              <div className="flex justify-between items-center">
                <span className="text-gray-600 dark:text-gray-400">
                  {language === 'ru' ? 'Статус:' : 'Status:'}
                </span>
                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-200">
                  {language === 'ru' ? 'В обработке' : 'Processing'}
                </span>
              </div>
            </div>
          </div>
          
          {/* Next Steps */}
          <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-blue-900 dark:text-blue-100 mb-4">
              {language === 'ru' ? 'Что происходит дальше?' : 'What happens next?'}
            </h3>
            
            <ol className="space-y-3 text-blue-800 dark:text-blue-200">
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">1</span>
                <span>
                  {language === 'ru'
                    ? 'Мы рассмотрим ваш заказ и свяжемся с вами в течение 24 часов для уточнения деталей'
                    : 'We will review your order and contact you within 24 hours to clarify details'
                  }
                </span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">2</span>
                <span>
                  {language === 'ru'
                    ? 'Вы получите детальное коммерческое предложение с окончательными ценами и условиями'
                    : 'You will receive a detailed proposal with final pricing and terms'
                  }
                </span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">3</span>
                <span>
                  {language === 'ru'
                    ? 'После согласования условий мы вышлем счет для оплаты с банковскими реквизитами'
                    : 'After terms agreement, we will send an invoice with banking details for payment'
                  }
                </span>
              </li>
              
              <li className="flex items-start">
                <span className="flex-shrink-0 w-6 h-6 bg-blue-500 text-white rounded-full flex items-center justify-center text-sm font-medium mr-3 mt-0.5">4</span>
                <span>
                  {language === 'ru'
                    ? 'Работа над проектом начнется сразу после поступления оплаты'
                    : 'Project work begins immediately after payment is received'
                  }
                </span>
              </li>
            </ol>
          </div>
          
          {/* Payment Information */}
          <div className="bg-gray-50 dark:bg-gray-800 rounded-lg p-6 mb-8 text-left">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
              {language === 'ru' ? 'Информация об оплате' : 'Payment Information'}
            </h3>
            
            <div className="space-y-3 text-sm text-gray-600 dark:text-gray-400">
              <p>
                {language === 'ru'
                  ? 'Мы принимаем следующие способы оплаты:'
                  : 'We accept the following payment methods:'
                }
              </p>
              
              <ul className="list-disc list-inside space-y-1 ml-4">
                <li>{language === 'ru' ? 'Банковский перевод (рубли, доллары, евро)' : 'Bank transfer (RUB, USD, EUR)'}</li>
                <li>{language === 'ru' ? 'Криптовалюты (USDT, USDC, BTC, ETH)' : 'Cryptocurrencies (USDT, USDC, BTC, ETH)'}</li>
                <li>{language === 'ru' ? 'Для корпоративных клиентов - оплата по счету' : 'For corporate clients - invoice payment'}</li>
              </ul>
              
              <p className="text-xs text-gray-500 dark:text-gray-400 mt-4">
                {language === 'ru'
                  ? 'Все детали оплаты будут указаны в счете, который вы получите после согласования коммерческого предложения.'
                  : 'All payment details will be specified in the invoice you receive after proposal agreement.'
                }
              </p>
            </div>
          </div>
          
          {/* Action Buttons */}
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Button
              size="lg"
              onClick={() => window.location.href = '/services'}
            >
              {language === 'ru' ? 'Вернуться к услугам' : 'Back to Services'}
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              onClick={() => window.location.href = '/'}
            >
              {language === 'ru' ? 'На главную' : 'Go Home'}
            </Button>
          </div>
          
          {/* Contact Information */}
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-600 dark:text-gray-400">
              {language === 'ru'
                ? 'Есть вопросы? Свяжитесь с нами:'
                : 'Have questions? Contact us:'
              }
            </p>
            
            <div className="mt-2 space-x-4">
              <a 
                href="mailto:hello@volkovchain.com\" 
                className="text-primary hover:underline\"
              >
                hello@volkovchain.com
              </a>
              <span className="text-gray-400">•</span>
              <a 
                href="https://t.me/volkovchain\" 
                className="text-primary hover:underline\"
                target="_blank\"
                rel="noopener noreferrer\"
              >
                Telegram
              </a>
            </div>
          </div>
          
          {/* Copy Success Message */}
          {copied && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              className="fixed bottom-4 right-4 bg-green-500 text-white px-4 py-2 rounded-lg shadow-lg\"
            >
              {language === 'ru' ? 'Скопировано!' : 'Copied!'}
            </motion.div>
          )}
        </motion.div>
      </div>
    </div>
  )
}