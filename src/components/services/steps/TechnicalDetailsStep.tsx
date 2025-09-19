'use client'

import React from 'react'
import { motion } from 'framer-motion'
import useServiceStore from '@/stores/useServiceStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import { Select } from '@/components/ui/Select'
import type { ValidationState } from '@/types'
import { 
  CodeBracketIcon,
  LinkIcon,
  PlusIcon,
  XMarkIcon,
  ShieldCheckIcon
} from '@heroicons/react/24/outline'

interface TechnicalDetailsStepProps {
  language: 'ru' | 'en'
  validation: ValidationState
}

const popularTechStacks = [
  'Rust', 'Solidity', 'JavaScript/TypeScript', 'Python', 'Go', 'C++',
  'React', 'Next.js', 'Vue.js', 'Node.js', 'Express',
  'Ethereum', 'Polygon', 'Binance Smart Chain', 'Solana', 'Polkadot',
  'Web3.js', 'Ethers.js', 'Hardhat', 'Truffle', 'Foundry',
  'IPFS', 'The Graph', 'Chainlink', 'OpenZeppelin'
]

const popularIntegrations = [
  'MetaMask', 'WalletConnect', 'Coinbase Wallet',
  'Uniswap', 'SushiSwap', 'Curve', '1inch',
  'Compound', 'Aave', 'MakerDAO',
  'OpenSea', 'Rarible', 'SuperRare',
  'AWS', 'Google Cloud', 'Azure',
  'MongoDB', 'PostgreSQL', 'Redis',
  'Docker', 'Kubernetes', 'CI/CD'
]

export function TechnicalDetailsStep({ 
  language, 
  validation 
}: TechnicalDetailsStepProps) {
  const { orderFormData, updateOrderForm } = useServiceStore()
  const { technicalInfo } = orderFormData
  
  const updateTechnicalInfo = (field: string, value: any) => {
    updateOrderForm({
      technicalInfo: {
        ...technicalInfo,
        [field]: value
      }
    })
  }
  
  const addTechStack = (tech: string) => {
    if (!technicalInfo.preferredTechStack.includes(tech)) {
      updateTechnicalInfo('preferredTechStack', [...technicalInfo.preferredTechStack, tech])
    }
  }
  
  const removeTechStack = (tech: string) => {
    updateTechnicalInfo(
      'preferredTechStack', 
      technicalInfo.preferredTechStack.filter(t => t !== tech)
    )
  }
  
  const addIntegration = (integration: string) => {
    if (!technicalInfo.requiredIntegrations.includes(integration)) {
      updateTechnicalInfo('requiredIntegrations', [...technicalInfo.requiredIntegrations, integration])
    }
  }
  
  const removeIntegration = (integration: string) => {
    updateTechnicalInfo(
      'requiredIntegrations', 
      technicalInfo.requiredIntegrations.filter(i => i !== integration)
    )
  }
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="space-y-6"
    >
      {/* Header */}
      <div className="text-center">
        <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">
          {language === 'ru' ? 'Технические детали' : 'Technical Details'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Расскажите о технических требованиях и предпочтениях'
            : 'Tell us about technical requirements and preferences'
          }
        </p>
      </div>
      
      {/* Existing Code */}
      <div className="space-y-4">
        <div className="flex items-center space-x-3">
          <input
            type="checkbox"
            id="hasExistingCode"
            checked={technicalInfo.hasExistingCode}
            onChange={(e) => updateTechnicalInfo('hasExistingCode', e.target.checked)}
            className="h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
          />
          <label htmlFor="hasExistingCode" className="text-sm font-medium text-gray-700 dark:text-gray-300 flex items-center">
            <CodeBracketIcon className="h-4 w-4 mr-1" />
            {language === 'ru' ? 'У нас есть существующий код' : 'We have existing code'}
          </label>
        </div>
        
        {technicalInfo.hasExistingCode && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            className="space-y-4 pl-7"
          >
            <Input
              label={language === 'ru' ? 'Ссылка на код' : 'Code Repository URL'}
              value={technicalInfo.existingCodeUrl || ''}
              onChange={(e) => updateTechnicalInfo('existingCodeUrl', e.target.value)}
              placeholder="https://github.com/username/repo"
            />
            
            <div>
              <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
                {language === 'ru' ? 'Описание существующего кода' : 'Existing Code Description'}
              </label>
              <textarea
                rows={3}
                value={technicalInfo.existingCodeDescription || ''}
                onChange={(e) => updateTechnicalInfo('existingCodeDescription', e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                           bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                           focus:ring-2 focus:ring-primary focus:border-transparent"
                placeholder={language === 'ru'
                  ? 'Опишите архитектуру, используемые технологии, текущее состояние...'
                  : 'Describe architecture, technologies used, current state...'
                }
              />
            </div>
          </motion.div>
        )}
      </div>
      
      {/* Preferred Tech Stack */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ru' ? 'Предпочитаемый технологический стек' : 'Preferred Technology Stack'}
        </h3>
        
        {/* Selected Technologies */}
        {technicalInfo.preferredTechStack.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ru' ? 'Выбранные технологии:' : 'Selected technologies:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {technicalInfo.preferredTechStack.map((tech, index) => (
                <div key={index} className="flex items-center bg-primary/10 text-primary px-3 py-1 rounded-full text-sm">
                  <span>{tech}</span>
                  <button
                    onClick={() => removeTechStack(tech)}
                    className="ml-2 hover:text-red-500"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular Technologies */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {language === 'ru' ? 'Выберите из популярных технологий:' : 'Choose from popular technologies:'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {popularTechStacks.map((tech) => (
            <button
              key={tech}
              onClick={() => addTechStack(tech)}
              disabled={technicalInfo.preferredTechStack.includes(tech)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                technicalInfo.preferredTechStack.includes(tech)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {tech}
            </button>
          ))}
        </div>
      </div>
      
      {/* Required Integrations */}
      <div>
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-4">
          {language === 'ru' ? 'Необходимые интеграции' : 'Required Integrations'}
        </h3>
        
        {/* Selected Integrations */}
        {technicalInfo.requiredIntegrations.length > 0 && (
          <div className="mb-4">
            <p className="text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
              {language === 'ru' ? 'Выбранные интеграции:' : 'Selected integrations:'}
            </p>
            <div className="flex flex-wrap gap-2">
              {technicalInfo.requiredIntegrations.map((integration, index) => (
                <div key={index} className="flex items-center bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 px-3 py-1 rounded-full text-sm">
                  <span>{integration}</span>
                  <button
                    onClick={() => removeIntegration(integration)}
                    className="ml-2 hover:text-red-500"
                  >
                    <XMarkIcon className="h-3 w-3" />
                  </button>
                </div>
              ))}
            </div>
          </div>
        )}
        
        {/* Popular Integrations */}
        <p className="text-sm text-gray-600 dark:text-gray-400 mb-3">
          {language === 'ru' ? 'Выберите из популярных интеграций:' : 'Choose from popular integrations:'}
        </p>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-2">
          {popularIntegrations.map((integration) => (
            <button
              key={integration}
              onClick={() => addIntegration(integration)}
              disabled={technicalInfo.requiredIntegrations.includes(integration)}
              className={`px-3 py-2 text-sm rounded-lg border transition-colors ${
                technicalInfo.requiredIntegrations.includes(integration)
                  ? 'bg-gray-100 dark:bg-gray-700 text-gray-400 dark:text-gray-500 cursor-not-allowed'
                  : 'bg-white dark:bg-gray-800 border-gray-300 dark:border-gray-600 hover:bg-gray-50 dark:hover:bg-gray-700 text-gray-700 dark:text-gray-300'
              }`}
            >
              {integration}
            </button>
          ))}
        </div>
      </div>
      
      {/* Performance Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'ru' ? 'Требования к производительности' : 'Performance Requirements'}
        </label>
        <textarea
          rows={3}
          value={technicalInfo.performanceRequirements || ''}
          onChange={(e) => updateTechnicalInfo('performanceRequirements', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={language === 'ru'
            ? 'Например: обработка 1000+ транзакций в секунду, время отклика < 100мс...'
            : 'e.g., handle 1000+ transactions per second, response time < 100ms...'
          }
        />
      </div>
      
      {/* Security Requirements */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2 flex items-center">
          <ShieldCheckIcon className="h-4 w-4 mr-1" />
          {language === 'ru' ? 'Требования безопасности' : 'Security Requirements'}
        </label>
        <textarea
          rows={3}
          value={technicalInfo.securityRequirements || ''}
          onChange={(e) => updateTechnicalInfo('securityRequirements', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={language === 'ru'
            ? 'Например: аудит смарт-контрактов, многоподпись, rate limiting...'
            : 'e.g., smart contract audit, multi-signature, rate limiting...'
          }
        />
      </div>
      
      {/* Scalability Needs */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'ru' ? 'Требования к масштабируемости' : 'Scalability Needs'}
        </label>
        <textarea
          rows={3}
          value={technicalInfo.scalabilityNeeds || ''}
          onChange={(e) => updateTechnicalInfo('scalabilityNeeds', e.target.value)}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent"
          placeholder={language === 'ru'
            ? 'Например: горизонтальное масштабирование, поддержка миллионов пользователей...'
            : 'e.g., horizontal scaling, support for millions of users...'
          }
        />
      </div>
      
      {/* Help Text */}
      <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-lg p-4">
        <p className="text-yellow-800 dark:text-yellow-200 text-sm">
          <strong>{language === 'ru' ? 'Примечание:' : 'Note:'}</strong>
          {' '}
          {language === 'ru'
            ? 'Не все поля обязательны. Заполните те, которые важны для вашего проекта. Наша команда поможет с техническими решениями на этапе планирования.'
            : 'Not all fields are required. Fill in what\'s important for your project. Our team will help with technical decisions during the planning phase.'
          }
        </p>
      </div>
    </motion.div>
  )
}

export default TechnicalDetailsStep