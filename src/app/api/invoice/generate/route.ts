import { NextRequest, NextResponse } from 'next/server'
import connectToDatabase from '@/lib/mongodb'
import { OrderModel, InvoiceModel, CustomerModel } from '@/lib/models'
import type { Invoice, BankingDetails } from '@/types'

/**
 * POST /api/invoice/generate
 * Generate invoice for an order with banking details
 */
export async function POST(request: NextRequest) {
  try {
    const { orderId } = await request.json()
    
    if (!orderId) {
      return NextResponse.json(
        { error: 'Order ID is required', success: false },
        { status: 400 }
      )
    }
    
    // Connect to database
    await connectToDatabase()
    
    // Find order
    const order = await OrderModel.findOne({ orderId }).populate('customerId')
    if (!order) {
      return NextResponse.json(
        { error: 'Order not found', success: false },
        { status: 404 }
      )
    }
    
    // Check if invoice already exists
    const existingInvoice = await InvoiceModel.findOne({ orderId: order._id })
    if (existingInvoice) {
      return NextResponse.json(
        { 
          success: true, 
          invoiceId: existingInvoice.invoiceId,
          message: 'Invoice already exists'
        }
      )
    }
    
    // Generate invoice data
    const invoiceData = await generateInvoiceData(order)
    
    // Create invoice record
    const invoice = new InvoiceModel(invoiceData)
    await invoice.save()
    
    // Update order status
    await OrderModel.findByIdAndUpdate(
      order._id,
      { 
        status: 'invoice_sent',
        $push: {
          notes: {
            content: `Invoice ${invoice.invoiceNumber} generated and sent`,
            author: 'system',
            type: 'internal'
          }
        }
      }
    )
    
    // Send invoice to customer
    await sendInvoiceToCustomer(order.orderData.contactInfo.email, invoice.toObject())
    
    return NextResponse.json({
      success: true,
      invoiceId: invoice.invoiceId,
      invoiceNumber: invoice.invoiceNumber,
      totalAmount: invoice.totalAmount,
      currency: invoice.currency,
      dueDate: invoice.dueDate
    })
    
  } catch (error) {
    console.error('Invoice generation error:', error)
    return NextResponse.json(
      { 
        error: 'Failed to generate invoice',
        message: error instanceof Error ? error.message : 'Unknown error',
        success: false 
      },
      { status: 500 }
    )
  }
}

/**
 * Generate invoice data from order
 */
async function generateInvoiceData(order: any): Promise<any> {
  const invoiceId = `INV-${Date.now()}-${Math.random().toString(36).substring(2, 8).toUpperCase()}`
  const invoiceNumber = `VCC-${new Date().getFullYear()}-${String(Date.now()).slice(-6)}`
  
  const issueDate = new Date()
  const dueDate = new Date(issueDate)
  dueDate.setDate(dueDate.getDate() + 30) // 30 days payment terms
  
  // Generate line items from selected services
  const lineItems = await Promise.all(
    order.orderData.selectedServices.map(async (selectedService: any) => {
      const service = await import('@/lib/serviceRegistry').then(module => 
        module.serviceRegistry.getServiceById(selectedService.serviceId)
      )
      
      if (!service) {
        throw new Error(`Service not found: ${selectedService.serviceId}`)
      }
      
      const unitPrice = (service.priceRange.min + service.priceRange.max) / 2 // Average price
      
      return {
        description: `${service.name.en} - ${service.shortDescription.en}`,
        quantity: 1,
        unitPrice,
        adjustments: [],
        total: unitPrice
      }
    })
  )
  
  const subtotal = lineItems.reduce((sum, item) => sum + item.total, 0)
  const taxAmount = 0 // No tax for international services
  const totalAmount = subtotal + taxAmount
  
  // Banking details (this would come from configuration)
  const bankingDetails: BankingDetails = {
    bankName: 'Example International Bank',
    accountNumber: '1234567890',
    swiftCode: 'EXAMPLEXX',
    iban: 'GB29 EXAMPLE 60161331926819',
    beneficiaryName: 'VolkovChain Consulting Ltd',
    beneficiaryAddress: '123 Blockchain Street, Crypto City, BC 12345',
    notes: {
      ru: 'Укажите номер заказа в назначении платежа',
      en: 'Please include order number in payment reference'
    }
  }
  
  return {
    invoiceId,
    invoiceNumber,
    orderId: order._id,
    customerId: order.customerId._id,
    status: 'sent',
    issueDate,
    dueDate,
    lineItems,
    subtotal,
    taxAmount,
    totalAmount,
    currency: 'USD',
    bankingDetails,
    paymentInstructions: {
      ru: `Пожалуйста, переведите ${totalAmount} USD на указанные банковские реквизиты. Обязательно укажите номер заказа ${order.orderId} в назначении платежа.`,
      en: `Please transfer ${totalAmount} USD to the provided banking details. Make sure to include order number ${order.orderId} in the payment reference.`
    }
  }
}

/**
 * Send invoice to customer
 */
async function sendInvoiceToCustomer(email: string, invoice: any): Promise<void> {
  // TODO: Implement invoice email service
  // This would:
  // 1. Generate PDF invoice
  // 2. Send email with invoice attachment
  // 3. Include payment instructions
  
  console.log(`Sending invoice ${invoice.invoiceNumber} to ${email}`)
  
  // Mock implementation - in production this would integrate with:
  // - PDF generation library (puppeteer, jsPDF, etc.)
  // - Email service (SendGrid, Mailgun, etc.)
  // - Template engine for invoice formatting
}