import type { ConsultationService } from '@/types'

export const consultationServices: ConsultationService[] = [
  {
    id: 'basic-consultation',
    name: 'Базовая консультация',
    description: 'Общие вопросы по блокчейн-разработке, выбор технологий, архитектурные решения',
    price: 150,
    duration: 1,
    features: [
      'Видеоконференция 1 час',
      'Обзор вашего проекта',
      'Рекомендации по технологиям',
      'Ответы на технические вопросы',
      'Краткий отчет с рекомендациями'
    ]
  },
  {
    id: 'smart-contract-audit',
    name: 'Аудит смарт-контрактов',
    description: 'Детальный аудит безопасности смарт-контрактов с отчетом и рекомендациями',
    price: 500,
    duration: 3,
    features: [
      'Анализ кода смарт-контрактов',
      'Поиск уязвимостей безопасности',
      'Проверка газ-оптимизации',
      'Детальный отчет с рекомендациями',
      '2 часа консультации по результатам',
      'Повторная проверка после исправлений'
    ],
    popular: true
  },
  {
    id: 'defi-architecture',
    name: 'DeFi архитектура',
    description: 'Проектирование архитектуры DeFi протокола: токеномика, контракты, безопасность',
    price: 800,
    duration: 5,
    features: [
      'Анализ требований к протоколу',
      'Дизайн токеномики',
      'Архитектура смарт-контрактов',
      'Интеграция с существующими протоколами',
      'Стратегия безопасности',
      'Техническая документация',
      'Поддержка на этапе разработки'
    ]
  },
  {
    id: 'team-training',
    name: 'Обучение команды',
    description: 'Интенсивное обучение команды разработчиков блокчейн-технологиям',
    price: 1200,
    duration: 8,
    features: [
      'Индивидуальная программа обучения',
      'Rust/Solidity/Go для блокчейна',
      'Практические воркшопы',
      'Code review и менторинг',
      'Материалы и ресурсы',
      'Сертификация участников',
      '3 месяца поддержки после курса'
    ]
  },
  {
    id: 'enterprise-consulting',
    name: 'Корпоративная консультация',
    description: 'Полный цикл консультирования для крупных проектов и enterprise решений',
    price: 2500,
    duration: 20,
    features: [
      'Анализ бизнес-требований',
      'Техническая экспертиза',
      'Архитектура enterprise-уровня',
      'Интеграция с существующими системами',
      'Обучение команды',
      'Код-ревью и аудит',
      'Долгосрочная поддержка',
      'Консультации по регулированию'
    ]
  }
]

export function getServiceById(id: string): ConsultationService | undefined {
  return consultationServices.find(service => service.id === id)
}

export function formatPrice(price: number): string {
  return new Intl.NumberFormat('ru-RU', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0
  }).format(price)
}

export function calculateTotalHours(services: ConsultationService[]): number {
  return services.reduce((total, service) => total + service.duration, 0)
}

export function calculateTotalPrice(services: ConsultationService[]): number {
  return services.reduce((total, service) => total + service.price, 0)
}