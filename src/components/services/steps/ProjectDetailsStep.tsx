'use client'

import React from 'react'
import { motion } from 'framer-motion'
import useServiceStore from '@/stores/useServiceStore'
import { Input } from '@/components/ui/Input'
import { Button } from '@/components/ui/Button'
import type { ValidationState } from '@/types'
import { PlusIcon, XMarkIcon } from '@heroicons/react/24/outline'

interface ProjectDetailsStepProps {
  language: 'ru' | 'en'
  validation: ValidationState
}

export function ProjectDetailsStep({ 
  language, 
  validation 
}: ProjectDetailsStepProps) {
  const { orderFormData, updateOrderForm } = useServiceStore()
  const { projectDetails } = orderFormData
  
  const addObjective = () => {
    const newObjectives = [...projectDetails.objectives, '']
    updateOrderForm({
      projectDetails: {
        ...projectDetails,
        objectives: newObjectives
      }
    })
  }
  
  const updateObjective = (index: number, value: string) => {
    const newObjectives = [...projectDetails.objectives]
    newObjectives[index] = value
    updateOrderForm({
      projectDetails: {
        ...projectDetails,
        objectives: newObjectives
      }
    })
  }
  
  const removeObjective = (index: number) => {
    const newObjectives = projectDetails.objectives.filter((_, i) => i !== index)
    updateOrderForm({
      projectDetails: {
        ...projectDetails,
        objectives: newObjectives
      }
    })
  }
  
  const addConstraint = () => {
    const newConstraints = [...projectDetails.constraints, '']
    updateOrderForm({
      projectDetails: {
        ...projectDetails,
        constraints: newConstraints
      }
    })
  }
  
  const updateConstraint = (index: number, value: string) => {
    const newConstraints = [...projectDetails.constraints]
    newConstraints[index] = value
    updateOrderForm({
      projectDetails: {
        ...projectDetails,
        constraints: newConstraints
      }
    })
  }
  
  const removeConstraint = (index: number) => {
    const newConstraints = projectDetails.constraints.filter((_, i) => i !== index)
    updateOrderForm({
      projectDetails: {
        ...projectDetails,
        constraints: newConstraints
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
          {language === 'ru' ? 'Расскажите о вашем проекте' : 'Tell us about your project'}
        </h2>
        <p className="text-gray-600 dark:text-gray-400">
          {language === 'ru'
            ? 'Предоставьте детали, которые помогут нам лучше понять ваши потребности'
            : 'Provide details that will help us better understand your needs'
          }
        </p>
      </div>
      
      {/* Project Title */}
      <div>
        <Input
          label={language === 'ru' ? 'Название проекта *' : 'Project Title *'}
          placeholder={language === 'ru' ? 'Например: DeFi протокол для торговли NFT' : 'e.g., DeFi protocol for NFT trading'}
          value={projectDetails.title}
          onChange={(e) => updateOrderForm({
            projectDetails: {
              ...projectDetails,
              title: e.target.value
            }
          })}
          error={validation.projectTitle && !validation.projectTitle.isValid}
          helperText={validation.projectTitle?.message}
          required
        />
      </div>
      
      {/* Project Description */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'ru' ? 'Описание проекта *' : 'Project Description *'}
        </label>
        <textarea
          rows={4}
          value={projectDetails.description}
          onChange={(e) => updateOrderForm({
            projectDetails: {
              ...projectDetails,
              description: e.target.value
            }
          })}
          className={`w-full px-3 py-2 border rounded-lg bg-white dark:bg-gray-700 text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:border-transparent ${
            validation.projectDescription && !validation.projectDescription.isValid
              ? 'border-red-300 dark:border-red-600'
              : 'border-gray-300 dark:border-gray-600'
          }`}
          placeholder={language === 'ru'
            ? 'Подробно опишите ваш проект, его цели, целевую аудиторию и ключевые функции...'
            : 'Describe your project in detail, including goals, target audience, and key features...'
          }
          required
        />
        {validation.projectDescription && !validation.projectDescription.isValid && (
          <p className="mt-1 text-sm text-red-600 dark:text-red-400">
            {validation.projectDescription.message}
          </p>
        )}
      </div>
      
      {/* Project Objectives */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {language === 'ru' ? 'Цели проекта' : 'Project Objectives'}
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addObjective}
            className="flex items-center space-x-1\"
          >
            <PlusIcon className="h-4 w-4\" />
            <span>{language === 'ru' ? 'Добавить' : 'Add'}</span>
          </Button>
        </div>
        <div className="space-y-2">
          {projectDetails.objectives.map((objective, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={language === 'ru' ? `Цель ${index + 1}` : `Objective ${index + 1}`}
                value={objective}
                onChange={(e) => updateObjective(index, e.target.value)}
                className="flex-1\"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeObjective(index)}
                className="text-red-500 hover:text-red-700\"
              >
                <XMarkIcon className="h-4 w-4\" />
              </Button>
            </div>
          ))}
          {projectDetails.objectives.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {language === 'ru'
                ? 'Нажмите \"Добавить\" чтобы добавить цели проекта'
                : 'Click \"Add\" to include project objectives'
              }
            </p>
          )}
        </div>
      </div>
      
      {/* Target Audience */}
      <div>
        <Input
          label={language === 'ru' ? 'Целевая аудитория' : 'Target Audience'}
          placeholder={language === 'ru' ? 'Например: DeFi трейдеры, NFT коллекционеры, институциональные инвесторы' : 'e.g., DeFi traders, NFT collectors, institutional investors'}
          value={projectDetails.targetAudience || ''}
          onChange={(e) => updateOrderForm({
            projectDetails: {
              ...projectDetails,
              targetAudience: e.target.value
            }
          })}
        />
      </div>
      
      {/* Existing Assets */}
      <div>
        <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2">
          {language === 'ru' ? 'Существующие ресурсы' : 'Existing Assets'}
        </label>
        <textarea
          rows={3}
          value={projectDetails.existingAssets || ''}
          onChange={(e) => updateOrderForm({
            projectDetails: {
              ...projectDetails,
              existingAssets: e.target.value
            }
          })}
          className="w-full px-3 py-2 border border-gray-300 dark:border-gray-600 rounded-lg 
                     bg-white dark:bg-gray-700 text-gray-900 dark:text-white
                     focus:ring-2 focus:ring-primary focus:border-transparent\"
          placeholder={language === 'ru'
            ? 'Опишите существующие ресурсы: код, дизайн, документация, команда...'
            : 'Describe existing assets: code, design, documentation, team...'
          }
        />
      </div>
      
      {/* Constraints */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <label className="block text-sm font-medium text-gray-700 dark:text-gray-300">
            {language === 'ru' ? 'Ограничения и требования' : 'Constraints & Requirements'}
          </label>
          <Button
            variant="outline"
            size="sm"
            onClick={addConstraint}
            className="flex items-center space-x-1\"
          >
            <PlusIcon className="h-4 w-4\" />
            <span>{language === 'ru' ? 'Добавить' : 'Add'}</span>
          </Button>
        </div>
        <div className="space-y-2">
          {projectDetails.constraints.map((constraint, index) => (
            <div key={index} className="flex items-center space-x-2">
              <Input
                placeholder={language === 'ru' ? `Ограничение ${index + 1}` : `Constraint ${index + 1}`}
                value={constraint}
                onChange={(e) => updateConstraint(index, e.target.value)}
                className="flex-1\"
              />
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeConstraint(index)}
                className="text-red-500 hover:text-red-700\"
              >
                <XMarkIcon className="h-4 w-4\" />
              </Button>
            </div>
          ))}
          {projectDetails.constraints.length === 0 && (
            <p className="text-sm text-gray-500 dark:text-gray-400 italic">
              {language === 'ru'
                ? 'Нажмите \"Добавить\" чтобы указать ограничения или особые требования'
                : 'Click \"Add\" to specify constraints or special requirements'
              }
            </p>
          )}
        </div>
      </div>
      
      {/* Help Text */}
      <div className="bg-blue-50 dark:bg-blue-900/20 border border-blue-200 dark:border-blue-800 rounded-lg p-4">
        <p className="text-blue-800 dark:text-blue-200 text-sm">
          <strong>{language === 'ru' ? 'Совет:' : 'Tip:'}</strong>
          {' '}
          {language === 'ru'
            ? 'Чем подробнее вы опишите проект, тем точнее мы сможем оценить стоимость и сроки реализации.'
            : 'The more detailed your project description, the more accurately we can estimate costs and timelines.'
          }
        </p>
      </div>
    </motion.div>
  )
}

export default ProjectDetailsStep