'use client'

import React from 'react'
import Link from 'next/link'
import { useAppStore } from '@/stores/useAppStore'
import { 
  GlobeAltIcon,
  EnvelopeIcon,
  PhoneIcon
} from '@heroicons/react/24/outline'

const socialLinks = [
  {
    name: 'GitHub',
    href: 'https://github.com/volkovchain',
    icon: '🔗'
  },
  {
    name: 'LinkedIn',
    href: 'https://linkedin.com/in/volkovchain',
    icon: '💼'
  },
  {
    name: 'Twitter',
    href: 'https://twitter.com/volkovchain',
    icon: '🐦'
  },
  {
    name: 'Telegram',
    href: 'https://t.me/volkovchain',
    icon: '📱'
  }
]

export function Footer() {
  const { language } = useAppStore()

  const currentYear = new Date().getFullYear()

  return (
    <footer className="bg-gray-900 text-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          {/* Brand */}
          <div className="col-span-1 md:col-span-2">
            <Link href="/" className="text-2xl font-bold text-primary mb-4 block">
              VolkovChain
            </Link>
            <p className="text-gray-300 mb-4 max-w-md">
              {language === 'ru' 
                ? 'Principal Blockchain Developer с экспертизой в Rust, Solidity и DeFi архитектуре. Создание современных децентрализованных решений.'
                : 'Principal Blockchain Developer with expertise in Rust, Solidity, and DeFi architecture. Building modern decentralized solutions.'
              }
            </p>
            <div className="flex space-x-4">
              {socialLinks.map((link) => (
                <a
                  key={link.name}
                  href={link.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="text-gray-400 hover:text-primary transition-colors"
                  title={link.name}
                >
                  <span className="text-lg">{link.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Быстрые ссылки' : 'Quick Links'}
            </h3>
            <ul className="space-y-2">
              <li>
                <Link 
                  href="/periodic-table" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  {language === 'ru' ? 'Таблица криптовалют' : 'Crypto Table'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/blog" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  {language === 'ru' ? 'Блог' : 'Blog'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/videos" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  {language === 'ru' ? 'Видео' : 'Videos'}
                </Link>
              </li>
              <li>
                <Link 
                  href="/consulting" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  {language === 'ru' ? 'Консультации' : 'Consulting'}
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h3 className="text-lg font-semibold mb-4">
              {language === 'ru' ? 'Контакты' : 'Contact'}
            </h3>
            <ul className="space-y-2">
              <li className="flex items-center space-x-2">
                <EnvelopeIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="mailto:hello@volkovchain.dev" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  hello@volkovchain.dev
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <GlobeAltIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <a 
                  href="https://volkovchain.dev" 
                  className="text-gray-300 hover:text-primary transition-colors"
                >
                  volkovchain.dev
                </a>
              </li>
              <li className="flex items-center space-x-2">
                <PhoneIcon className="h-4 w-4 text-gray-400 flex-shrink-0" />
                <span className="text-gray-300">
                  {language === 'ru' ? 'Консультации по записи' : 'Consultations by appointment'}
                </span>
              </li>
            </ul>
          </div>
        </div>

        {/* Bottom section */}
        <div className="border-t border-gray-700 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
          <p className="text-gray-400 text-sm">
            © {currentYear} VolkovChain. {language === 'ru' ? 'Все права защищены.' : 'All rights reserved.'}
          </p>
          <div className="flex space-x-6 mt-4 md:mt-0">
            <Link 
              href="/privacy" 
              className="text-gray-400 hover:text-primary text-sm transition-colors"
            >
              {language === 'ru' ? 'Политика конфиденциальности' : 'Privacy Policy'}
            </Link>
            <Link 
              href="/terms" 
              className="text-gray-400 hover:text-primary text-sm transition-colors"
            >
              {language === 'ru' ? 'Условия использования' : 'Terms of Service'}
            </Link>
          </div>
        </div>
      </div>
    </footer>
  )
}