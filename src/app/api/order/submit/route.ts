import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { OrderModel, CustomerModel, OrderTrackingModel } from '@/lib/models'
import type { OrderFormData } from '@/types'
import { serviceRegistry } from '@/lib/serviceRegistry'

/**
 * POST /api/order/submit
 * Submit a new order with manual payment processing
 */
export async function POST(request: NextRequest) {
  try {
    // Parse request body
    const orderData: OrderFormData = await request.json()
    
    // Validate order data
    const validation = serviceRegistry.validateOrderData(orderData)
    if (!validation.isValid) {
      return NextResponse.json(
        { 
          error: 'Invalid order data', 
          details: validation.errors,
          success: false 
        },
        { status: 400 }
      )
    }

    // Connect to database
    await connectToDatabase()
    
    // Generate unique order ID
    const orderId = serviceRegistry.generateOrderId()
    
    // Calculate total price
    const calculatedTotal = serviceRegistry.calculateTotalPrice(orderData.selectedServices)
    
    // Create or find customer
    let customer = await CustomerModel.findOne({ email: orderData.contactInfo.email })
    
    if (!customer) {
      // Create new customer
      const customerId = `CUST-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
      customer = new CustomerModel({
        customerId,
        firstName: orderData.contactInfo.firstName,
        lastName: orderData.contactInfo.lastName,
        email: orderData.contactInfo.email,
        company: orderData.contactInfo.company,
        position: orderData.contactInfo.position,
        timezone: orderData.contactInfo.timezone,
        preferredContactTime: orderData.contactInfo.preferredContactTime,
        communicationChannels: orderData.contactInfo.communicationChannels
      })
      await customer.save()
    }
    
    // Create order record
    const order = new OrderModel({
      orderId,
      customerId: customer._id,
      status: 'submitted',
      orderData,
      calculatedTotal,
      priority: determinePriority(orderData, calculatedTotal),
      notes: []
    })
    
    await order.save()
    
    // Update customer's order list and total value
    await CustomerModel.findByIdAndUpdate(
      customer._id,
      {
        $push: { orders: order._id },
        $inc: { totalOrderValue: calculatedTotal.maxPrice }
      }
    )
    
    // Create initial order tracking entry
    await OrderTrackingModel.create({
      orderId: order._id,
      status: 'submitted',
      message: 'Order submitted successfully',
      author: 'system',
      metadata: {
        ip: request.headers.get('x-forwarded-for') || 'unknown',
        userAgent: request.headers.get('user-agent') || 'unknown'
      }
    })
    
    // Send confirmation email to customer
    await sendOrderConfirmationEmail(orderData.contactInfo.email, order.toObject())
    
    // Notify management team
    await notifyManagementTeam(order.toObject())
    
    // Schedule invoice generation
    await scheduleInvoiceGeneration(orderId)
    
    return NextResponse.json({
      success: true,
      orderId: order.orderId,
      message: 'Order submitted successfully. You will receive an invoice within 24-48 hours.',
      estimatedTotal: calculatedTotal,
      trackingUrl: `/order/track/${order.orderId}`
    })
    
  } catch (error) {
    console.error('Order submission error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to submit order',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * Determine order priority based on order data and total
 */
function determinePriority(orderData: OrderFormData, total: { min: number; max: number; currency: string }): 'normal' | 'medium' | 'high' {
  // High priority for enterprise budget or rush timeline
  if (orderData.estimatedBudget === 'enterprise' || orderData.timeline === 'rush') {
    return 'high'
  }
  
  // Medium priority for high-value orders or medium-priority services
  if (total.maxPrice > 10000 || orderData.estimatedBudget === '15k_plus') {
    return 'medium'
  }
  
  return 'normal'
}

/**
 * Send order confirmation email to customer
 */
async function sendOrderConfirmationEmail(email: string, order: any): Promise<void> {
  // TODO: Implement email service integration
  // For now, just log the action
  console.log(`Sending order confirmation email to ${email} for order ${order.orderId}`)
  
  // This would integrate with services like:
  // - SendGrid
  // - Mailgun
  // - AWS SES
  // - Resend
}

/**
 * Notify management team of new order
 */
async function notifyManagementTeam(order: any): Promise<void> {
  // TODO: Implement management notification system
  // This could include:
  // - Slack webhook
  // - Discord webhook
  // - Telegram bot
  // - Email to management
  
  console.log(`New order notification for ${order.orderId} - Priority: ${order.priority}`)
}

/**
 * Schedule invoice generation (async)
 */
async function scheduleInvoiceGeneration(orderId: string): Promise<void> {
  // TODO: Implement queue system for invoice generation
  // This could use:
  // - Redis Queue
  // - AWS SQS
  // - Simple setTimeout for immediate processing
  
  console.log(`Scheduling invoice generation for order ${orderId}`)
  
  // For demo purposes, trigger immediate processing
  setTimeout(async () => {
    try {
      const response = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL}/api/invoice/generate`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ orderId })
      })
      
      if (!response.ok) {
        console.error(`Failed to generate invoice for order ${orderId}`)
      }
    } catch (error) {
      console.error(`Error scheduling invoice generation:`, error)
    }
  }, 5000) // 5-second delay for demo
}