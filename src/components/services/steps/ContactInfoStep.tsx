'use client'

import React from 'react'
import { motion } from 'framer-motion'
import useServiceStore from '@/stores/useServiceStore'
import { Input } from '@/components/ui/Input'
import { Select } from '@/components/ui/Select'
import type { ValidationState } from '@/types'
import { 
  EnvelopeIcon,
  BuildingOfficeIcon,
  ClockIcon,
  ChatBubbleLeftRightIcon
} from '@heroicons/react/24/outline'

interface ContactInfoStepProps {
  language: 'ru' | 'en'
  validation: ValidationState
}

const timezones = [
  { value: 'UTC', label: 'UTC' },
  { value: 'America/New_York', label: 'Eastern Time (ET)' },
  { value: 'America/Chicago', label: 'Central Time (CT)' },
  { value: 'America/Denver', label: 'Mountain Time (MT)' },
  { value: 'America/Los_Angeles', label: 'Pacific Time (PT)' },
  { value: 'Europe/London', label: 'London (GMT)' },
  { value: 'Europe/Berlin', label: 'Berlin (CET)' },
  { value: 'Europe/Moscow', label: 'Moscow (MSK)' },
  { value: 'Asia/Shanghai', label: 'Shanghai (CST)' },
  { value: 'Asia/Tokyo', label: 'Tokyo (JST)' },
  { value: 'Asia/Dubai', label: 'Dubai (GST)' },
  { value: 'Australia/Sydney', label: 'Sydney (AEDT)' }
]

const contactTimes = [
  { value: 'morning', label: { ru: 'Утром (9-12)', en: 'Morning (9-12)' } },
  { value: 'afternoon', label: { ru: 'Днем (12-17)', en: 'Afternoon (12-17)' } },
  { value: 'evening', label: { ru: 'Вечером (17-20)', en: 'Evening (17-20)' } },
  { value: 'flexible', label: { ru: 'Гибкий график', en: 'Flexible' } }
]

export function ContactInfoStep({ 
  language, 
  validation 
}: ContactInfoStepProps) {
  const { orderFormData, updateOrderForm } = useServiceStore()
  const { contactInfo } = orderFormData
  
  const updateContactInfo = (field: string, value: string) => {
    updateOrderForm({
      contactInfo: {
        ...contactInfo,
        [field]: value
      }
    })
  }
  
  const updateCommunicationChannel = (channel: string, value: string) => {
    updateOrderForm({
      contactInfo: {
        ...contactInfo,
        communicationChannels: {
          ...contactInfo.communicationChannels,
          [channel]: value
        }
      }
    })
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6\"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ru' ? 'Контактная информация' : 'Contact Information'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Предоставьте контактные данные для связи по проекту'
            : 'Provide contact details for project communication'
          }
        </p>
      </div>
      
      {/* Personal Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={language === 'ru' ? 'Имя *' : 'First Name *'}
          value={contactInfo.firstName}
          onChange={(e) => updateContactInfo('firstName', e.target.value)}
          error={validation.firstName && !validation.firstName.isValid}
          helperText={validation.firstName?.message}
          required
        />
        
        <Input
          label={language === 'ru' ? 'Фамилия *' : 'Last Name *'}
          value={contactInfo.lastName}
          onChange={(e) => updateContactInfo('lastName', e.target.value)}
          error={validation.lastName && !validation.lastName.isValid}
          helperText={validation.lastName?.message}
          required
        />
      </div>
      
      {/* Email */}
      <div>
        <Input
          label={language === 'ru' ? 'Email *' : 'Email Address *'}
          type="email\"
          value={contactInfo.email}
          onChange={(e) => updateContactInfo('email', e.target.value)}
          error={validation.email && !validation.email.isValid}
          helperText={validation.email?.message}
          icon={EnvelopeIcon}
          required
        />
      </div>
      
      {/* Company Information */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <Input
          label={language === 'ru' ? 'Компания' : 'Company'}
          value={contactInfo.company || ''}
          onChange={(e) => updateContactInfo('company', e.target.value)}
          icon={BuildingOfficeIcon}
          placeholder={language === 'ru' ? 'Название компании' : 'Company name'}
        />
        
        <Input
          label={language === 'ru' ? 'Должность' : 'Position'}
          value={contactInfo.position || ''}
          onChange={(e) => updateContactInfo('position', e.target.value)}
          placeholder={language === 'ru' ? 'Ваша должность' : 'Your position'}
        />
      </div>
      
      {/* Timezone and Contact Preferences */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            <ClockIcon className="inline h-4 w-4 mr-1\" />
            {language === 'ru' ? 'Часовой пояс *' : 'Timezone *'}
          </label>
          <Select
            value={contactInfo.timezone}
            onChange={(value) => updateContactInfo('timezone', value)}
            options={timezones}
            placeholder={language === 'ru' ? 'Выберите часовой пояс' : 'Select timezone'}
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'ru' ? 'Предпочитаемое время' : 'Preferred Contact Time'}
          </label>
          <Select
            value={contactInfo.preferredContactTime || ''}
            onChange={(value) => updateContactInfo('preferredContactTime', value)}
            options={contactTimes.map(time => ({
              value: time.value,
              label: time.label[language]
            }))}
            placeholder={language === 'ru' ? 'Выберите время' : 'Select time'}
          />
        </div>
      </div>
      
      {/* Communication Channels */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4 flex items-center">
          <ChatBubbleLeftRightIcon className="h-5 w-5 mr-2\" />
          {language === 'ru' ? 'Каналы связи' : 'Communication Channels'}
        </h3>
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
          {language === 'ru'
            ? 'Укажите дополнительные каналы связи для быстрого общения (необязательно)'
            : 'Provide additional communication channels for quick contact (optional)'
          }
        </p>
        
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          <Input
            label="Telegram"
            value={contactInfo.communicationChannels.telegram || ''}
            onChange={(e) => updateCommunicationChannel('telegram', e.target.value)}
            placeholder="@username"
          />
          
          <Input
            label="Discord"
            value={contactInfo.communicationChannels.discord || ''}
            onChange={(e) => updateCommunicationChannel('discord', e.target.value)}
            placeholder="username#1234"
          />
          
          <Input
            label="LinkedIn"
            value={contactInfo.communicationChannels.linkedin || ''}
            onChange={(e) => updateCommunicationChannel('linkedin', e.target.value)}
            placeholder="linkedin.com/in/username"
          />
        </div>
      </div>
      
      {/* Communication Preferences */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ru' ? 'Предпочтения общения' : 'Communication Preferences'}
        </h3>
        
        <div>
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
            {language === 'ru' ? 'Предпочитаемый канал связи' : 'Preferred Communication Method'}
          </label>
          <Select
            value={orderFormData.preferredCommunication}
            onChange={(value) => updateOrderForm({
              preferredCommunication: value as 'email' | 'telegram' | 'discord' | 'video_call'
            })}
            options={[
              { value: 'email', label: language === 'ru' ? 'Email' : 'Email' },
              { value: 'telegram', label: 'Telegram' },
              { value: 'discord', label: 'Discord' },
              { value: 'video_call', label: language === 'ru' ? 'Видеозвонок' : 'Video Call' }
            ]}
          />
        </div>
      </div>
      
      {/* Privacy Notice */}
      <div className="bg-gray-50 dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4">
        <h4 className="font-medium text-gray-900 dark:text-white mb-2">
          {language === 'ru' ? 'Конфиденциальность' : 'Privacy'}
        </h4>
        <p className="text-sm text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Ваши персональные данные будут использованы только для связи по проекту и не будут переданы третьим лицам.'
            : 'Your personal information will only be used for project communication and will not be shared with third parties.'
          }
        </p>
      </div>
    </motion.div>
  )
}

export default ContactInfoStep