import React from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  className?: string
  children: React.ReactNode
  variant?: 'default' | 'elevated' | 'outlined'
}

const cardVariants = {
  default: 'bg-white dark:bg-gray-800 shadow-sm',
  elevated: 'bg-white dark:bg-gray-800 shadow-lg',
  outlined: 'bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700'
}

export function Card({ className, children, variant = 'default' }: CardProps) {
  return (
    <div
      className={cn(
        'rounded-lg p-6',
        cardVariants[variant],
        className
      )}
    >
      {children}
    </div>
  )
}

export function CardHeader({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('flex flex-col space-y-1.5 p-6', className)}>
      {children}
    </div>
  )
}

export function CardTitle({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <h3 className={cn('text-2xl font-semibold leading-none tracking-tight', className)}>
      {children}
    </h3>
  )
}

export function CardContent({ className, children }: { className?: string; children: React.ReactNode }) {
  return (
    <div className={cn('p-6 pt-0', className)}>
      {children}
    </div>
  )
}