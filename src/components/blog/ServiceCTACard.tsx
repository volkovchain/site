'use client'

import Link from 'next/link'
import { ArrowRightIcon, AcademicCapIcon, CodeBracketIcon, ChatBubbleLeftRightIcon } from '@heroicons/react/24/outline'

export function ServiceCTACard() {
  const services = [
    {
      id: 'education',
      title: 'Learn Blockchain Development',
      description: 'Master Rust, Solidity, and Web3 technologies',
      icon: AcademicCapIcon,
      href: '/services#education'
    },
    {
      id: 'development', 
      title: 'Build Your DeFi Protocol',
      description: 'From smart contracts to full-stack dApps',
      icon: CodeBracketIcon,
      href: '/services#development'
    },
    {
      id: 'consulting',
      title: 'Get Expert Consultation', 
      description: 'Strategic guidance for your blockchain project',
      icon: ChatBubbleLeftRightIcon,
      href: '/consulting'
    }
  ]

  return (
    <div className="grid md:grid-cols-3 gap-6">
      {services.map((service) => {
        const Icon = service.icon
        return (
          <Link
            key={service.id}
            href={service.href}
            className="group p-6 bg-white rounded-xl shadow-sm border hover:shadow-lg transition-all"
          >
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 p-3 rounded-lg bg-indigo-100">
                <Icon className="h-6 w-6 text-indigo-600" />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-semibold text-gray-900 group-hover:text-indigo-600">
                  {service.title}
                </h3>
                <p className="text-sm text-gray-600 mt-1 mb-3">
                  {service.description}
                </p>
                <div className="flex items-center text-sm font-medium text-indigo-600">
                  Learn more
                  <ArrowRightIcon className="ml-1 h-4 w-4" />
                </div>
              </div>
            </div>
          </Link>
        )
      })}
    </div>
  )
}