'use client'

import { useEffect, useState, Suspense } from 'react'
import { useSearchParams } from 'next/navigation'
import Link from 'next/link'
import { CheckCircleIcon, CalendarIcon, EnvelopeIcon } from '@heroicons/react/24/solid'

interface SessionData {
  id: string
  customerEmail: string
  amount: number
  packageName: string
  customerName: string
  timezone: string
  preferredDate?: string
}

function PaymentSuccessContent() {
  const searchParams = useSearchParams()
  const sessionId = searchParams.get('session_id')
  const [sessionData, setSessionData] = useState<SessionData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    async function fetchSession() {
      if (!sessionId) {
        setError('No session ID provided')
        setLoading(false)
        return
      }

      try {
        // Mock session data since stripe is not available
        setSessionData({
          id: sessionId,
          customerEmail: 'customer@example.com',
          amount: 299,
          packageName: 'Quick Consultation',
          customerName: 'Customer Name',
          timezone: 'UTC',
          preferredDate: new Date().toLocaleDateString()
        })
      } catch (err) {
        console.error('Error fetching session:', err)
        setError('Failed to load payment information')
      } finally {
        setLoading(false)
      }
    }

    fetchSession()
  }, [sessionId])

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    )
  }

  if (error || !sessionData) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
        <div className="max-w-md w-full">
          <div className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 text-red-500">
              <svg fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L4.268 18.5c-.77.833.192 2.5 1.732 2.5z" />
              </svg>
            </div>
            <h1 className="text-2xl font-bold text-gray-900 mb-2">Payment Error</h1>
            <p className="text-gray-600 mb-6">{error || 'Unable to load payment information'}</p>
            <Link
              href="/consulting"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md shadow-sm text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Consulting
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gray-50 px-4 py-12">
      <div className="max-w-3xl mx-auto">
        {/* Success Header */}
        <div className="text-center mb-8">
          <CheckCircleIcon className="w-16 h-16 text-green-500 mx-auto mb-4" />
          <h1 className="text-3xl font-bold text-gray-900 mb-2">
            Payment Successful!
          </h1>
          <p className="text-lg text-gray-600">
            Thank you for booking a consultation with VolkovChain
          </p>
        </div>

        {/* Payment Details */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">Payment Details</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <p className="text-sm font-medium text-gray-500">Package</p>
              <p className="text-lg text-gray-900">{sessionData.packageName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Amount Paid</p>
              <p className="text-lg text-gray-900">${sessionData.amount}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Customer</p>
              <p className="text-lg text-gray-900">{sessionData.customerName}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Email</p>
              <p className="text-lg text-gray-900">{sessionData.customerEmail}</p>
            </div>
            <div>
              <p className="text-sm font-medium text-gray-500">Timezone</p>
              <p className="text-lg text-gray-900">{sessionData.timezone}</p>
            </div>
            {sessionData.preferredDate && (
              <div>
                <p className="text-sm font-medium text-gray-500">Preferred Date</p>
                <p className="text-lg text-gray-900">{sessionData.preferredDate}</p>
              </div>
            )}
          </div>
        </div>

        {/* Next Steps */}
        <div className="bg-white rounded-lg shadow-md p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-4">What's Next?</h2>
          <div className="space-y-4">
            <div className="flex items-start">
              <EnvelopeIcon className="w-6 h-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Confirmation Email</h3>
                <p className="text-gray-600">
                  You'll receive a confirmation email within 5 minutes with your payment receipt and next steps.
                </p>
              </div>
            </div>
            <div className="flex items-start">
              <CalendarIcon className="w-6 h-6 text-indigo-600 mt-1 mr-3 flex-shrink-0" />
              <div>
                <h3 className="font-medium text-gray-900">Schedule Your Session</h3>
                <p className="text-gray-600">
                  I'll contact you within 24 hours to schedule your consultation session based on your preferred timezone and availability.
                </p>
              </div>
            </div>
          </div>
        </div>

        {/* Contact Information */}
        <div className="bg-indigo-50 rounded-lg p-6 mb-8">
          <h2 className="text-xl font-semibold text-gray-900 mb-2">Have Questions?</h2>
          <p className="text-gray-600 mb-4">
            If you have any questions about your consultation or need to reschedule, feel free to reach out:
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <a
              href="mailto:hello@volkovchain.dev"
              className="inline-flex items-center px-4 py-2 border border-transparent text-sm font-medium rounded-md text-indigo-700 bg-indigo-100 hover:bg-indigo-200"
            >
              <EnvelopeIcon className="w-4 h-4 mr-2" />
              hello@volkovchain.dev
            </a>
          </div>
        </div>

        {/* Actions */}
        <div className="text-center">
          <div className="space-y-3 sm:space-y-0 sm:space-x-3 sm:flex sm:justify-center">
            <Link
              href="/blog"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50"
            >
              Read Blog Articles
            </Link>
            <Link
              href="/"
              className="w-full sm:w-auto inline-flex justify-center items-center px-6 py-3 border border-transparent text-sm font-medium rounded-md text-white bg-indigo-600 hover:bg-indigo-700"
            >
              Return to Homepage
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default function PaymentSuccessPage() {
  return (
    <Suspense fallback={
      <div className="min-h-screen flex items-center justify-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-indigo-600"></div>
      </div>
    }>
      <PaymentSuccessContent />
    </Suspense>
  )
}