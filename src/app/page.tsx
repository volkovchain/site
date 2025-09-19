'use client'

import React from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/Button'
import { Card } from '@/components/ui/Card'
import { 
  TableCellsIcon,
  DocumentTextIcon,
  PlayIcon,
  CalendarIcon,
  ArrowRightIcon
} from '@heroicons/react/24/outline'

const technologies = [
  {
    name: 'Rust',
    description: 'Layer-1 протоколы и высокопроизводительные системы',
    color: 'bg-orange-500',
    icon: '🦀'
  },
  {
    name: 'Solidity',
    description: 'Смарт-контракты и DeFi протоколы',
    color: 'bg-blue-500',
    icon: '💎'
  },
  {
    name: 'Go',
    description: 'Бэкенд системы и блокчейн инфраструктура',
    color: 'bg-cyan-500',
    icon: '🐹'
  }
]

const quickLinks = [
  {
    title: 'Интерактивная таблица',
    description: 'Исследуйте криптовалюты в формате периодической таблицы',
    href: '/periodic-table',
    icon: TableCellsIcon,
    color: 'text-primary'
  },
  {
    title: 'Блог',
    description: 'Статьи о блокчейн-разработке и DeFi',
    href: '/blog',
    icon: DocumentTextIcon,
    color: 'text-green-500'
  },
  {
    title: 'Видео',
    description: 'Образовательный контент и туториалы',
    href: '/videos',
    icon: PlayIcon,
    color: 'text-red-500'
  },
  {
    title: 'Консультации',
    description: 'Персональные консультации по блокчейн-проектам',
    href: '/consulting',
    icon: CalendarIcon,
    color: 'text-purple-500'
  }
]

export default function Home() {
  const { language } = useAppStore()

  return (
    <div className="min-h-screen">
      {/* Hero Section */}
      <section className="bg-gradient-to-br from-dark via-gray-900 to-black text-white py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <motion.h1 
              className="text-5xl md:text-7xl font-bold mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="text-primary">Volkov</span>Chain
            </motion.h1>
            
            <motion.p 
              className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.2 }}
            >
              {language === 'ru'
                ? 'Principal Blockchain Developer с экспертизой в Rust, Solidity и DeFi архитектуре'
                : 'Principal Blockchain Developer with expertise in Rust, Solidity, and DeFi architecture'
              }
            </motion.p>

            <motion.div 
              className="flex flex-col sm:flex-row gap-4 justify-center"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8, delay: 0.4 }}
            >
              <Link href="/periodic-table">
                <Button size="lg" className="w-full sm:w-auto">
                  Исследовать таблицу
              <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0" />
                </Button>
              </Link>
              <Link href="/consulting">
                <Button variant="outline" size="lg" className="w-full sm:w-auto">
                  Консультации
                </Button>
              </Link>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Technology Expertise */}
      <section className="py-16 bg-gray-50 dark:bg-gray-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Технологическая экспертиза
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Глубокие знания современных технологий блокчейн-разработки
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {technologies.map((tech, index) => (
              <motion.div
                key={tech.name}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="text-center p-8 hover:shadow-lg transition-shadow">
                  <div className={`w-16 h-16 ${tech.color} rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4`}>
                    {tech.icon}
                  </div>
                  <h3 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
                    {tech.name}
                  </h3>
                  <p className="text-gray-600 dark:text-gray-400">
                    {tech.description}
                  </p>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Quick Links */}
      <section className="py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-4">
              Исследуйте проект
            </h2>
            <p className="text-lg text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
              Погрузитесь в мир блокчейн-технологий через интерактивные инструменты и образовательный контент
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {quickLinks.map((link, index) => {
              const Icon = link.icon
              return (
                <motion.div
                  key={link.href}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Link href={link.href}>
                    <Card className="p-6 hover:shadow-lg transition-all duration-300 hover:-translate-y-1 cursor-pointer group">
                      <Icon className={`h-8 w-8 ${link.color} mb-4 group-hover:scale-110 transition-transform flex-shrink-0`} />
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                        {link.title}
                      </h3>
                      <p className="text-sm text-gray-600 dark:text-gray-400">
                        {link.description}
                      </p>
                    </Card>
                  </Link>
                </motion.div>
              )
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="bg-primary py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Готовы начать блокчейн-проект?
          </h2>
          <p className="text-xl text-purple-100 mb-8 max-w-2xl mx-auto">
            Получите персональную консультацию по архитектуре, разработке и внедрению блокчейн-решений
          </p>
          <Link href="/consulting">
            <Button variant="secondary" size="lg">
              Записаться на консультацию
              <ArrowRightIcon className="ml-2 h-5 w-5 flex-shrink-0" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  )
}