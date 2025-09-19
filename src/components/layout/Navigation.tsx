'use client'

import React from 'react'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useAppStore } from '@/stores/useAppStore'
import { Button } from '@/components/ui/Button'
import { cn } from '@/lib/utils'
import {
  HomeIcon,
  TableCellsIcon,
  DocumentTextIcon,
  PlayIcon,
  BriefcaseIcon,
  UserIcon,
  Bars3Icon,
  XMarkIcon,
  SunIcon,
  MoonIcon,
  LanguageIcon,
  ChevronDownIcon
} from '@heroicons/react/24/outline'

interface NavigationItem {
  name: { ru: string; en: string }
  href: string
  icon: React.ComponentType<{ className?: string }>
  dropdown?: {
    name: { ru: string; en: string }
    href: string
    description?: { ru: string; en: string }
  }[]
}

const navigationItems: NavigationItem[] = [
  {
    name: { ru: 'Главная', en: 'Home' },
    href: '/',
    icon: HomeIcon
  },
  {
    name: { ru: 'Таблица', en: 'Periodic Table' },
    href: '/periodic-table',
    icon: TableCellsIcon
  },
  {
    name: { ru: 'Блог', en: 'Blog' },
    href: '/blog',
    icon: DocumentTextIcon
  },
  {
    name: { ru: 'Видео', en: 'Videos' },
    href: '/videos',
    icon: PlayIcon
  },
  {
    name: { ru: 'Услуги', en: 'Services' },
    href: '/services',
    icon: BriefcaseIcon,
    dropdown: [
      {
        name: { ru: 'Все услуги', en: 'All Services' },
        href: '/services',
        description: { ru: 'Полный каталог услуг', en: 'Complete service catalog' }
      },
      {
        name: { ru: 'Обучение', en: 'Education' },
        href: '/services?category=education',
        description: { ru: 'Курсы и тренинги', en: 'Courses and training' }
      },
      {
        name: { ru: 'Разработка', en: 'Development' },
        href: '/services?category=development',
        description: { ru: 'Создание приложений', en: 'Application development' }
      },
      {
        name: { ru: 'Консультации', en: 'Consulting' },
        href: '/services?category=consulting',
        description: { ru: 'Экспертные консультации', en: 'Expert consulting' }
      },
      {
        name: { ru: 'Контент', en: 'Content' },
        href: '/services?category=content',
        description: { ru: 'Создание контента', en: 'Content creation' }
      }
    ]
  },
  {
    name: { ru: 'О проекте', en: 'About' },
    href: '/about',
    icon: UserIcon
  }
]

export function Navigation() {
  const pathname = usePathname()
  const { 
    theme, 
    language, 
    navigation,
    toggleTheme, 
    setLanguage, 
    toggleMobileMenu,
    closeMobileMenu 
  } = useAppStore()

  const { isMobileMenuOpen } = navigation
  const [openDropdown, setOpenDropdown] = React.useState<string | null>(null)

  const handleDropdownToggle = (href: string) => {
    setOpenDropdown(openDropdown === href ? null : href)
  }

  const isServicesActive = pathname.startsWith('/services') || pathname === '/consulting'

  return (
    <nav className="bg-white dark:bg-gray-900 shadow-lg relative z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <Link 
              href="/" 
              className="text-2xl font-bold text-primary"
              onClick={closeMobileMenu}
            >
              VolkovChain
            </Link>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden md:flex items-center space-x-4">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/services' 
                ? isServicesActive 
                : pathname === item.href
              
              if (item.dropdown) {
                return (
                  <div key={item.href} className="relative group">
                    <button
                      className={cn(
                        'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                      )}
                      onMouseEnter={() => setOpenDropdown(item.href)}
                    >
                      <Icon className="h-4 w-4 flex-shrink-0" />
                      <span>{item.name[language]}</span>
                      <ChevronDownIcon className="h-3 w-3 flex-shrink-0" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div 
                      className="absolute top-full left-0 mt-1 w-64 bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 z-50"
                      onMouseLeave={() => setOpenDropdown(null)}
                    >
                      <div className="py-2">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            className="block px-4 py-3 text-sm text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 hover:text-primary transition-colors"
                            onClick={() => {
                              setOpenDropdown(null)
                              closeMobileMenu()
                            }}
                          >
                            <div className="font-medium">{dropdownItem.name[language]}</div>
                            {dropdownItem.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {dropdownItem.description[language]}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    </div>
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={cn(
                    'flex items-center space-x-2 px-3 py-2 rounded-md text-sm font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  <Icon className="h-4 w-4 flex-shrink-0" />
                  <span>{item.name[language]}</span>
                </Link>
              )
            })}
          </div>

          {/* Desktop Controls */}
          <div className="hidden md:flex items-center space-x-4">
            {/* Theme Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-4 w-4 flex-shrink-0" />
              ) : (
                <MoonIcon className="h-4 w-4 flex-shrink-0" />
              )}
            </Button>

            {/* Language Toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="p-2 flex items-center space-x-1"
            >
              <LanguageIcon className="h-4 w-4 flex-shrink-0" />
              <span className="text-xs font-medium uppercase">
                {language}
              </span>
            </Button>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center space-x-2">
            {/* Mobile theme toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleTheme}
              className="p-2"
            >
              {theme === 'dark' ? (
                <SunIcon className="h-5 w-5 flex-shrink-0" />
              ) : (
                <MoonIcon className="h-5 w-5 flex-shrink-0" />
              )}
            </Button>

            {/* Mobile menu toggle */}
            <Button
              variant="ghost"
              size="sm"
              onClick={toggleMobileMenu}
              className="p-2"
            >
              {isMobileMenuOpen ? (
                <XMarkIcon className="h-6 w-6 flex-shrink-0" />
              ) : (
                <Bars3Icon className="h-6 w-6 flex-shrink-0" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Navigation Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-16 left-0 right-0 bg-white dark:bg-gray-900 shadow-lg border-t dark:border-gray-700">
          <div className="px-2 pt-2 pb-3 space-y-1">
            {navigationItems.map((item) => {
              const Icon = item.icon
              const isActive = item.href === '/services' 
                ? isServicesActive 
                : pathname === item.href
              
              if (item.dropdown) {
                return (
                  <div key={item.href}>
                    <button
                      onClick={() => handleDropdownToggle(item.href)}
                      className={cn(
                        'flex items-center justify-between w-full px-3 py-2 rounded-md text-base font-medium transition-colors',
                        isActive
                          ? 'text-primary bg-primary/10'
                          : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                      )}
                    >
                      <div className="flex items-center space-x-3">
                        <Icon className="h-5 w-5 flex-shrink-0" />
                        <span>{item.name[language]}</span>
                      </div>
                      <ChevronDownIcon className={cn(
                        'h-4 w-4 transition-transform',
                        openDropdown === item.href ? 'rotate-180' : ''
                      )} />
                    </button>
                    
                    {/* Mobile Dropdown */}
                    {openDropdown === item.href && (
                      <div className="ml-8 mt-1 space-y-1">
                        {item.dropdown.map((dropdownItem) => (
                          <Link
                            key={dropdownItem.href}
                            href={dropdownItem.href}
                            onClick={() => {
                              setOpenDropdown(null)
                              closeMobileMenu()
                            }}
                            className="block px-3 py-2 text-sm text-gray-600 dark:text-gray-400 hover:text-primary hover:bg-primary/5 rounded-md transition-colors"
                          >
                            <div className="font-medium">{dropdownItem.name[language]}</div>
                            {dropdownItem.description && (
                              <div className="text-xs text-gray-500 dark:text-gray-400 mt-1">
                                {dropdownItem.description[language]}
                              </div>
                            )}
                          </Link>
                        ))}
                      </div>
                    )}
                  </div>
                )
              }
              
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  onClick={closeMobileMenu}
                  className={cn(
                    'flex items-center space-x-3 px-3 py-2 rounded-md text-base font-medium transition-colors',
                    isActive
                      ? 'text-primary bg-primary/10'
                      : 'text-gray-700 dark:text-gray-300 hover:text-primary hover:bg-primary/5'
                  )}
                >
                  <Icon className="h-5 w-5 flex-shrink-0" />
                  <span>{item.name[language]}</span>
                </Link>
              )
            })}
            
            {/* Mobile language toggle */}
            <Button
              variant="ghost"
              onClick={() => setLanguage(language === 'ru' ? 'en' : 'ru')}
              className="w-full justify-start px-3 py-2 text-base font-medium"
            >
              <LanguageIcon className="h-5 w-5 mr-3 flex-shrink-0" />
              <span>
                {language === 'ru' ? 'Switch to English' : 'Переключить на русский'}
              </span>
            </Button>
          </div>
        </div>
      )}
    </nav>
  )
}