'use client'

import React from 'react'
import { motion } from 'framer-motion'
import { CheckIcon } from '@heroicons/react/24/outline'

interface ProgressIndicatorProps {
  steps: {
    title: string
    description: string
  }[]
  currentStep: number
  completedSteps: number[]
}

export function ProgressIndicator({ 
  steps, 
  currentStep, 
  completedSteps 
}: ProgressIndicatorProps) {
  return (
    <div className="mb-8">
      <div className="flex items-center justify-between">
        {steps.map((step, index) => {
          const isCompleted = completedSteps.includes(index)
          const isCurrent = index === currentStep
          const isUpcoming = index > currentStep
          
          return (
            <div key={index} className="flex items-center">
              {/* Step Circle */}
              <div className="relative">
                <motion.div
                  className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all duration-300 ${
                    isCompleted
                      ? 'bg-primary border-primary text-white'
                      : isCurrent
                      ? 'border-primary text-primary bg-primary/10'
                      : 'border-gray-300 dark:border-gray-600 text-gray-400 dark:text-gray-500'
                  }`}
                  initial={false}
                  animate={{
                    scale: isCurrent ? 1.1 : 1,
                  }}
                  transition={{ duration: 0.2 }}
                >
                  {isCompleted ? (
                    <CheckIcon className="h-5 w-5" />
                  ) : (
                    <span className="text-sm font-medium">{index + 1}</span>
                  )}
                </motion.div>
                
                {/* Step Content */}
                <div className="absolute top-12 left-1/2 transform -translate-x-1/2 text-center min-w-[120px]">
                  <div className={`text-sm font-medium ${
                    isCurrent
                      ? 'text-primary'
                      : isCompleted
                      ? 'text-gray-900 dark:text-white'
                      : 'text-gray-500 dark:text-gray-400'
                  }`}>
                    {step.title}
                  </div>
                  <div className="text-xs text-gray-500 dark:text-gray-400 mt-1 hidden sm:block">
                    {step.description}
                  </div>
                </div>
              </div>
              
              {/* Connector Line */}
              {index < steps.length - 1 && (
                <div className="flex-1 mx-4 mt-0">
                  <div className={`h-0.5 transition-all duration-300 ${
                    isCompleted || (isCurrent && index < currentStep)
                      ? 'bg-primary'
                      : 'bg-gray-300 dark:bg-gray-600'
                  }`} />
                </div>
              )}
            </div>
          )
        })}
      </div>
      
      {/* Progress Bar */}
      <div className="mt-16 sm:mt-20">
        <div className="bg-gray-200 dark:bg-gray-700 rounded-full h-2">
          <motion.div
            className="bg-primary rounded-full h-2"
            initial={{ width: '0%' }}
            animate={{ width: `${((currentStep + 1) / steps.length) * 100}%` }}
            transition={{ duration: 0.5, ease: 'easeInOut' }}
          />
        </div>
        <div className="flex justify-between text-xs text-gray-500 dark:text-gray-400 mt-2">
          <span>0%</span>
          <span>{Math.round(((currentStep + 1) / steps.length) * 100)}%</span>
          <span>100%</span>
        </div>
      </div>
    </div>
  )
}

export default ProgressIndicator