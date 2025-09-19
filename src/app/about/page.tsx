'use client'

import React from 'react'
import Image from 'next/image'
import { motion } from 'framer-motion'
import { useAppStore } from '@/stores/useAppStore'
import { Card } from '@/components/ui/Card'
import { Button } from '@/components/ui/Button'
import { 
  AcademicCapIcon,
  BriefcaseIcon,
  CodeBracketIcon,
  GlobeAltIcon,
  TrophyIcon,
  DocumentTextIcon,
  EnvelopeIcon,
  ArrowDownTrayIcon
} from '@heroicons/react/24/outline'

const techSkills = [
  { name: 'Rust', level: 95, color: 'bg-orange-500', years: '7+' },
  { name: 'Solidity', level: 98, color: 'bg-blue-500', years: '7+' },
  { name: 'Go', level: 90, color: 'bg-cyan-500', years: '6+' },
  { name: 'TypeScript', level: 85, color: 'bg-blue-600', years: '5+' },
  { name: 'Python', level: 80, color: 'bg-green-500', years: '4+' },
  { name: 'WebAssembly', level: 75, color: 'bg-purple-500', years: '3+' }
]

const experience = [
  {
    company: 'MetaFi Protocol',
    position: 'Principal Blockchain Architect',
    period: '2022-Present',
    achievements: [
      'Designed multi-chain DeFi protocol with $250M+ TVL',
      'Led team of 22 developers in creating innovative yield farming mechanisms',
      'Implemented formal verification for mission-critical smart contracts',
      'Optimized gas consumption by 40% through advanced Solidity patterns'
    ]
  },
  {
    company: 'Avalanche Labs',
    position: 'Senior Blockchain Developer & Tech Lead',
    period: '2020-2022',
    achievements: [
      'Developed core infrastructure components for Avalanche C-Chain',
      'Created cross-chain bridge with $100M+ transaction volume',
      'Implemented novel consensus optimizations, improving finality time by 30%',
      'Led integration of 50+ DeFi protocols into Avalanche ecosystem'
    ]
  },
  {
    company: 'ConsenSys',
    position: 'Blockchain Solutions Architect',
    period: '2018-2020',
    achievements: [
      'Consulted Fortune 500 companies on enterprise blockchain implementation',
      'Developed private blockchain for supply chain management',
      'Created hybrid public-private blockchain architecture for financial sector',
      'Conducted 200+ hours of technical training for enterprise clients'
    ]
  },
  {
    company: 'MakerDAO',
    position: 'Senior Smart Contract Developer',
    period: '2017-2018',
    achievements: [
      'Developed key MakerDAO protocol components and liquidation mechanisms',
      'Created governance smart contracts for $8B+ collateral management system',
      'Implemented emergency shutdown mechanisms and oracle price feed integrations',
      'Participated in security audits and incident response for critical protocol updates'
    ]
  }
]

const achievements = [
  {
    title: 'Blockchain Innovator of the Year',
    organization: 'CoinDesk Awards',
    year: '2023',
    icon: TrophyIcon
  },
  {
    title: 'Top 10 Blockchain Architects',
    organization: 'Forbes Blockchain 50',
    year: '2022-2024',
    icon: AcademicCapIcon
  },
  {
    title: 'DeFi Pioneer Award',
    organization: 'DeFi Alliance',
    year: '2021',
    icon: GlobeAltIcon
  },
  {
    title: '$500K+ Bug Bounty Hunter',
    organization: 'Various DeFi Protocols',
    year: '2020-2024',
    icon: CodeBracketIcon
  }
]

const education = [
  {
    degree: 'M.S. Computer Science',
    institution: 'Stanford University',
    year: '2015',
    specialization: 'Distributed Systems and Cryptography',
    thesis: 'Byzantine Fault Tolerance in Proof-of-Stake Systems'
  },
  {
    degree: 'B.S. Computer Engineering',
    institution: 'UC Berkeley',
    year: '2013',
    honors: 'Magna Cum Laude, Phi Beta Kappa'
  }
]

export default function AboutPage() {
  const { language } = useAppStore()

  return (
    <div className="min-h-screen py-12">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Hero Section */}
        <section className="text-center mb-16">
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <div className="w-32 h-32 mx-auto mb-6 rounded-full bg-gradient-to-br from-primary to-secondary p-1">
              <div className="w-full h-full rounded-full bg-white dark:bg-gray-800 flex items-center justify-center">
                <span className="text-4xl font-bold text-primary">VC</span>
              </div>
            </div>
          </motion.div>

          <motion.h1 
            className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            VolkovChain
          </motion.h1>
          
          <motion.h2 
            className="text-2xl text-primary font-semibold mb-6"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
          >
            Principal Blockchain Developer & Architect
          </motion.h2>
          
          <motion.p 
            className="text-lg text-gray-600 dark:text-gray-400 max-w-3xl mx-auto mb-8"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.4 }}
          >
            12+ лет в разработке ПО, 8+ лет в блокчейне. Эксперт по Rust, Solidity и DeFi архитектуре. 
            Успешно запустил 15+ блокчейн-проектов с общим TVL $500M+. Лидер команд до 25 разработчиков.
          </motion.p>

          <motion.div 
            className="flex flex-col sm:flex-row gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Button size="lg">
              <EnvelopeIcon className="h-5 w-5 mr-2" />
              Связаться
            </Button>
            <Button variant="outline" size="lg">
              <ArrowDownTrayIcon className="h-5 w-5 mr-2" />
              Скачать CV
            </Button>
          </motion.div>
        </section>

        {/* Technical Skills */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Технические навыки
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {techSkills.map((skill, index) => (
              <motion.div
                key={skill.name}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                      {skill.name}
                    </h3>
                    <span className="text-sm text-gray-500 dark:text-gray-400">
                      {skill.years} лет
                    </span>
                  </div>
                  
                  <div className="relative">
                    <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2">
                      <motion.div 
                        className={`h-2 rounded-full ${skill.color}`}
                        initial={{ width: 0 }}
                        animate={{ width: `${skill.level}%` }}
                        transition={{ duration: 1, delay: index * 0.1 + 0.5 }}
                      />
                    </div>
                    <span className="absolute right-0 top-3 text-sm font-medium text-gray-700 dark:text-gray-300">
                      {skill.level}%
                    </span>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Experience */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Опыт работы
          </h2>
          
          <div className="space-y-8">
            {experience.map((job, index) => (
              <motion.div
                key={`${job.company}-${job.period}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
              >
                <Card className="p-6">
                  <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4">
                    <div>
                      <h3 className="text-xl font-bold text-gray-900 dark:text-white">
                        {job.position}
                      </h3>
                      <p className="text-lg text-primary font-semibold">
                        {job.company}
                      </p>
                    </div>
                    <span className="text-gray-600 dark:text-gray-400 font-medium">
                      {job.period}
                    </span>
                  </div>
                  
                  <ul className="space-y-2">
                    {job.achievements.map((achievement, achievementIndex) => (
                      <li key={achievementIndex} className="flex items-start space-x-2">
                        <span className="text-primary mt-1">•</span>
                        <span className="text-gray-600 dark:text-gray-400">
                          {achievement}
                        </span>
                      </li>
                    ))}
                  </ul>
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Achievements & Awards */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Достижения и награды
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {achievements.map((achievement, index) => {
              const Icon = achievement.icon
              return (
                <motion.div
                  key={achievement.title}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: index * 0.1 }}
                >
                  <Card className="p-6 text-center">
                    <div className="bg-primary/10 rounded-full p-4 w-16 h-16 mx-auto mb-4 flex items-center justify-center">
                      <Icon className="h-8 w-8 text-primary" />
                    </div>
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-white mb-2">
                      {achievement.title}
                    </h3>
                    <p className="text-gray-600 dark:text-gray-400 mb-1">
                      {achievement.organization}
                    </p>
                    <p className="text-sm text-primary font-medium">
                      {achievement.year}
                    </p>
                  </Card>
                </motion.div>
              )
            })}
          </div>
        </section>

        {/* Education */}
        <section className="mb-16">
          <h2 className="text-3xl font-bold text-gray-900 dark:text-white mb-8 text-center">
            Образование
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {education.map((edu, index) => (
              <motion.div
                key={`${edu.institution}-${edu.year}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: index * 0.2 }}
              >
                <Card className="p-6">
                  <div className="flex items-center mb-4">
                    <AcademicCapIcon className="h-8 w-8 text-primary mr-3" />
                    <div>
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                        {edu.degree}
                      </h3>
                      <p className="text-primary font-medium">
                        {edu.institution}
                      </p>
                    </div>
                    <span className="ml-auto text-gray-600 dark:text-gray-400 font-medium">
                      {edu.year}
                    </span>
                  </div>
                  
                  {edu.specialization && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Специализация:</strong> {edu.specialization}
                    </p>
                  )}
                  
                  {edu.thesis && (
                    <p className="text-gray-600 dark:text-gray-400 mb-2">
                      <strong>Диссертация:</strong> {edu.thesis}
                    </p>
                  )}
                  
                  {edu.honors && (
                    <p className="text-gray-600 dark:text-gray-400">
                      <strong>Награды:</strong> {edu.honors}
                    </p>
                  )}
                </Card>
              </motion.div>
            ))}
          </div>
        </section>

        {/* Contact CTA */}
        <section className="text-center">
          <Card className="p-8 bg-gradient-to-r from-primary to-secondary text-white">
            <h2 className="text-2xl font-bold mb-4">
              Готовы работать вместе?
            </h2>
            <p className="text-purple-100 mb-6 max-w-2xl mx-auto">
              Свяжитесь со мной для обсуждения вашего блокчейн-проекта. 
              Помогу с архитектурой, разработкой и аудитом.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button variant="secondary" size="lg">
                <EnvelopeIcon className="h-5 w-5 mr-2" />
                hello@volkovchain.dev
              </Button>
              <Button variant="outline" size="lg" className="text-white border-white hover:bg-white hover:text-primary">
                <DocumentTextIcon className="h-5 w-5 mr-2" />
                Заказать консультацию
              </Button>
            </div>
          </Card>
        </section>
      </div>
    </div>
  )
}