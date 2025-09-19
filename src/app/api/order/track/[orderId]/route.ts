import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { OrderModel, OrderTrackingModel } from '@/lib/models'

/**
 * GET /api/order/track/[orderId]
 * Track order status and get order details
 */
export async function GET(
  request: NextRequest,
  { params }: { params: { orderId: string } }
) {
  try {
    const { orderId } = params
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required', success: false },
        { status: 400 }
      )
    }
    
    // Connect to database
    await connectToDatabase()
    
    // Find order
    const order = await OrderModel.findOne({ orderId })
      .populate('customerId')
      .select('-orderData.contactInfo.email -orderData.contactInfo.communicationChannels') // Hide sensitive data
    
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found', success: false },
        { status: 404 }
      )
    }
    
    // Get order tracking history
    const trackingHistory = await OrderTrackingModel
      .find({ orderId: order._id })
      .sort({ timestamp: -1 })
      .select('-metadata') // Hide internal metadata
    
    // Calculate order progress
    const progress = calculateOrderProgress(order.status)
    
    return NextResponse.json({
      success: true,
      order: {
        orderId: order.orderId,
        status: order.status,
        priority: order.priority,
        calculatedTotal: order.calculatedTotal,
        createdAt: order.createdAt,
        updatedAt: order.updatedAt,
        progress,
        selectedServices: order.orderData.selectedServices,
        projectDetails: order.orderData.projectDetails
      },
      trackingHistory: trackingHistory.map(entry => ({
        status: entry.status,
        message: entry.message,
        author: entry.author === 'system' ? 'System' : entry.author,
        timestamp: entry.timestamp
      })),
      estimatedCompletion: getEstimatedCompletion(order)
    })
    
  } catch (error) {
    console.error('Order tracking error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to track order',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * Calculate order progress percentage
 */
function calculateOrderProgress(status: string): number {
  const statusProgress: Record<string, number> = {
    'submitted': 10,
    'reviewed': 25,
    'invoice_sent': 40,
    'payment_pending': 40,
    'paid': 60,
    'in_progress': 80,
    'completed': 100,
    'cancelled': 0
  }
  
  return statusProgress[status] || 0
}

/**
 * Get estimated completion date
 */
function getEstimatedCompletion(order: any): string | null {
  if (order.status === 'completed' || order.status === 'cancelled') {
    return null
  }
  
  // Calculate based on services and timeline
  const maxDeliveryDays = order.orderData.selectedServices.reduce((max: number, service: any) => {
    // This would need to fetch service details
    // For now, return a default estimate
    return Math.max(max, 30) // 30 days default
  }, 0)
  
  const estimatedDate = new Date(order.createdAt)
  estimatedDate.setDate(estimatedDate.getDate() + maxDeliveryDays)
  
  return estimatedDate.toISOString()
}