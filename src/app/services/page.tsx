'use client'

import React from 'react'
import { ServiceCatalog } from '@/components/services/ServiceCatalog'
import { Button } from '@/components/ui/Button'
import { OrderForm } from '@/components/services/OrderForm'
import useServiceStore from '@/stores/useServiceStore'
import { useAppStore } from '@/stores/useAppStore'
import { motion } from 'framer-motion'
import { 
  BriefcaseIcon,
  SparklesIcon,
  TrophyIcon,
  UserGroupIcon
} from '@heroicons/react/24/outline'

const benefits = [
  {
    icon: SparklesIcon,
    title: { ru: 'Инновационные решения', en: 'Innovative Solutions' },
    description: { ru: 'Современные технологии и лучшие практики', en: 'Cutting-edge technologies and best practices' }
  },
  {
    icon: TrophyIcon,
    title: { ru: 'Проверенная экспертиза', en: 'Proven Expertise' },
    description: { ru: '8+ лет опыта и 50+ успешных проектов', en: '8+ years experience and 50+ successful projects' }
  },
  {
    icon: UserGroupIcon,
    title: { ru: 'Персональный подход', en: 'Personal Approach' },
    description: { ru: 'Индивидуальные решения под ваши задачи', en: 'Tailored solutions for your specific needs' }
  },
  {
    icon: BriefcaseIcon,
    title: { ru: 'Полный цикл', en: 'Full Cycle' },
    description: { ru: 'От концепции до внедрения и поддержки', en: 'From concept to implementation and support' }
  }
]

export default function ServicesPage() {
  const { language } = useAppStore()
  const {
    isOrderFormOpen,
    selectedServices,
    openOrderForm,
    closeOrderForm,
    loadServiceCategories
  } = useServiceStore()
  
  // Load service categories on mount
  React.useEffect(() => {
    loadServiceCategories()
  }, [])
  
  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            {language === 'ru' ? 'Услуги по блокчейн-разработке' : 'Blockchain Development Services'}
          </motion.h1>
          
          <motion.p 
            className="text-xl text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {language === 'ru'
              ? 'Комплексные решения для блокчейн-проектов: от обучения и консультаций до полного цикла разработки'
              : 'Comprehensive blockchain solutions: from education and consulting to full-cycle development'
            }
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            <Button 
              size="lg" 
              onClick={openOrderForm}
              className="flex items-center"
            >
              <BriefcaseIcon className="h-5 w-5 mr-2" />
              {language === 'ru' ? 'Заказать услугу' : 'Order Service'}
            </Button>
            <Button 
              variant="outline" 
              size="lg"
              onClick={() => document.getElementById('services-catalog')?.scrollIntoView({ behavior: 'smooth' })}
            >
              {language === 'ru' ? 'Посмотреть услуги' : 'Browse Services'}
            </Button>
          </motion.div>
        </section>

        {/* Benefits Section */}
        <section className="mb-16">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {benefits.map((benefit, index) => {
              const Icon = benefit.icon
              return (
                <motion.div
                  key={benefit.title.en}
                  className="text-center"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                    <Icon className="h-8 w-8 text-primary" />
                  </div>
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                    {benefit.title[language]}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {benefit.description[language]}
                  </p>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Services Catalog */}
        <section id="services-catalog" className="mb-16">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              {language === 'ru' ? 'Наши услуги' : 'Our Services'}
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              {language === 'ru'
                ? 'Выберите подходящие услуги для вашего проекта или комбинируйте несколько для комплексного решения'
                : 'Choose the right services for your project or combine multiple services for a comprehensive solution'
              }
            </p>
          </div>
          
          <ServiceCatalog />
        </section>

        {/* Selected Services Summary */}
        {selectedServices.length > 0 && (
          <motion.section 
            className="mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <div className="bg-primary/5 border border-primary/20 rounded-xl p-6 text-center">
              <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-4">
                {language === 'ru' 
                  ? `Выбрано услуг: ${selectedServices.length}`
                  : `Selected Services: ${selectedServices.length}`
                }
              </h3>
              <p className="text-gray-600 dark:text-gray-400 mb-6">
                {language === 'ru'
                  ? 'Готовы оформить заказ? Заполните форму, и мы свяжемся с вами для обсуждения деталей.'
                  : 'Ready to place an order? Fill out the form and we\'ll contact you to discuss the details.'
                }
              </p>
              <Button size="lg" onClick={openOrderForm}>
                {language === 'ru' ? 'Оформить заказ' : 'Place Order'}
              </Button>
            </div>
          </motion.section>
        )}

        {/* FAQ Section */}
        <section className="mb-16">
          <div className="bg-gray-50 dark:bg-gray-800 rounded-2xl p-8">
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-8 text-center">
              {language === 'ru' ? 'Часто задаваемые вопросы' : 'Frequently Asked Questions'}
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'ru' 
                    ? 'Как происходит процесс заказа?'
                    : 'How does the ordering process work?'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ru'
                    ? 'Выберите услуги, заполните форму заказа, получите коммерческое предложение, подтвердите заказ и оплатите счет.'
                    : 'Select services, fill out the order form, receive a proposal, confirm the order, and pay the invoice.'
                  }
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'ru'
                    ? 'Какие способы оплаты доступны?'
                    : 'What payment methods are available?'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ru'
                    ? 'Банковский перевод, криптовалюты (USDT, USDC), для корпоративных клиентов - оплата по счету.'
                    : 'Bank transfer, cryptocurrencies (USDT, USDC), for corporate clients - payment by invoice.'
                  }
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'ru'
                    ? 'Можно ли комбинировать услуги?'
                    : 'Can services be combined?'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ru'
                    ? 'Да, вы можете выбрать несколько услуг для комплексного решения. Мы предложим оптимальную комбинацию.'
                    : 'Yes, you can select multiple services for a comprehensive solution. We\'ll suggest an optimal combination.'
                  }
                </p>
              </div>
              
              <div>
                <h3 className="font-semibold text-gray-900 dark:text-white mb-2">
                  {language === 'ru'
                    ? 'Предоставляете ли вы поддержку?'
                    : 'Do you provide support?'
                  }
                </h3>
                <p className="text-gray-600 dark:text-gray-400">
                  {language === 'ru'
                    ? 'Да, мы предоставляем техническую поддержку и сопровождение проектов в зависимости от выбранного пакета услуг.'
                    : 'Yes, we provide technical support and project maintenance depending on your selected service package.'
                  }
                </p>
              </div>
            </div>
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <div className="bg-gradient-to-r from-primary to-blue-600 rounded-2xl p-8 text-white">
            <h2 className="text-2xl font-bold mb-4">
              {language === 'ru' ? 'Нужна консультация?' : 'Need a consultation?'}
            </h2>
            <p className="text-primary-100 mb-6 max-w-2xl mx-auto">
              {language === 'ru'
                ? 'Не уверены, какие услуги подходят для вашего проекта? Свяжитесь с нами для бесплатной консультации.'
                : 'Not sure which services are right for your project? Contact us for a free consultation.'
              }
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                {language === 'ru' ? 'Связаться с нами' : 'Contact Us'}
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                {language === 'ru' ? 'Заказать консультацию' : 'Book Consultation'}
              </Button>
            </div>
          </div>
        </section>
      </div>

      {/* Order Form Modal */}
      <OrderForm
        open={isOrderFormOpen}
        onClose={closeOrderForm}
      />
    </div>
  )
}