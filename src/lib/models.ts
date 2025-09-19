import { Schema, model, models, Document } from 'mongoose'
import type {
  ServiceCategory as IServiceCategory,
  Service as IService,
  Order as IOrder,
  Invoice as IInvoice,
  OrderFormData,
  OrderStatus,
  InvoiceStatus
} from '@/types'

// ServiceCategory Schema
const ServiceCategorySchema = new Schema<IServiceCategory & Document>({
  categoryId: { type: String, required: true, unique: true },
  name: {
    ru: { type: String, required: true },
    en: { type: String, required: true }
  },
  description: {
    ru: { type: String, required: true },
    en: { type: String, required: true }
  },
  icon: { type: String, required: true },
  displayOrder: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true },
  services: [{ type: Schema.Types.ObjectId, ref: 'Service' }]
}, {
  timestamps: true
})

// Service Schema
const ServiceSchema = new Schema<IService & Document>({
  serviceId: { type: String, required: true, unique: true },
  categoryId: { type: String, required: true, ref: 'ServiceCategory' },
  name: {
    ru: { type: String, required: true },
    en: { type: String, required: true }
  },
  shortDescription: {
    ru: { type: String, required: true },
    en: { type: String, required: true }
  },
  fullDescription: {
    ru: { type: String, required: true },
    en: { type: String, required: true }
  },
  features: [{ type: String }],
  deliverables: [{ type: String }],
  timeline: { type: String, required: true },
  priceRange: {
    min: { type: Number, required: true },
    max: { type: Number, required: true },
    currency: { type: String, enum: ['USD', 'RUB'], default: 'USD' },
    note: {
      ru: { type: String },
      en: { type: String }
    }
  },
  complexity: { 
    type: String, 
    enum: ['Basic', 'Advanced', 'Enterprise'], 
    required: true 
  },
  tags: [{ type: String }],
  isPopular: { type: Boolean, default: false },
  isCustomizable: { type: Boolean, default: true },
  isActive: { type: Boolean, default: true },
  metadata: {
    estimatedDeliveryDays: { type: Number, required: true },
    requiresDiscovery: { type: Boolean, default: false },
    teamSize: { type: String },
    supportLevel: { 
      type: String, 
      enum: ['Basic', 'Standard', 'Premium'], 
      default: 'Standard' 
    },
    displayOrder: { type: Number, default: 0 }
  }
}, {
  timestamps: true
})

// Customer Schema
const CustomerSchema = new Schema({
  customerId: { type: String, required: true, unique: true },
  firstName: { type: String, required: true },
  lastName: { type: String, required: true },
  email: { type: String, required: true },
  company: { type: String },
  position: { type: String },
  timezone: { type: String, required: true },
  preferredContactTime: { type: String },
  communicationChannels: {
    telegram: { type: String },
    discord: { type: String },
    linkedin: { type: String }
  },
  orders: [{ type: Schema.Types.ObjectId, ref: 'Order' }],
  totalOrderValue: { type: Number, default: 0 },
  isActive: { type: Boolean, default: true }
}, {
  timestamps: true
})

// Order Schema
const OrderSchema = new Schema<IOrder & Document>({
  orderId: { type: String, required: true, unique: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer' },
  status: {
    type: String,
    enum: ['submitted', 'reviewed', 'invoice_sent', 'payment_pending', 'paid', 'in_progress', 'completed', 'cancelled'],
    default: 'submitted'
  },
  orderData: {
    selectedServices: [{
      serviceId: { type: String, required: true, ref: 'Service' },
      customizations: { type: Schema.Types.Mixed },
      priority: { type: String, enum: ['Low', 'Medium', 'High'], default: 'Medium' },
      estimatedPrice: {
        min: { type: Number },
        max: { type: Number },
        currency: { type: String, default: 'USD' }
      }
    }],
    projectDetails: {
      title: { type: String, required: true },
      description: { type: String, required: true },
      objectives: [{ type: String }],
      targetAudience: { type: String },
      existingAssets: { type: String },
      constraints: [{ type: String }]
    },
    contactInfo: {
      firstName: { type: String, required: true },
      lastName: { type: String, required: true },
      email: { type: String, required: true },
      company: { type: String },
      position: { type: String },
      timezone: { type: String, required: true },
      preferredContactTime: { type: String },
      communicationChannels: {
        telegram: { type: String },
        discord: { type: String },
        linkedin: { type: String }
      }
    },
    technicalInfo: {
      hasExistingCode: { type: Boolean, default: false },
      existingCodeUrl: { type: String },
      existingCodeDescription: { type: String },
      preferredTechStack: [{ type: String }],
      requiredIntegrations: [{ type: String }],
      performanceRequirements: { type: String },
      securityRequirements: { type: String },
      scalabilityNeeds: { type: String }
    },
    additionalRequirements: { type: String },
    agreesToTerms: { type: Boolean, required: true },
    marketingOptIn: { type: Boolean, default: false },
    preferredCommunication: {
      type: String,
      enum: ['email', 'telegram', 'discord', 'video_call'],
      default: 'email'
    },
    estimatedBudget: {
      type: String,
      enum: ['under_1k', '1k_5k', '5k_15k', '15k_plus', 'enterprise']
    },
    timeline: {
      type: String,
      enum: ['rush', 'standard', 'flexible', 'long_term'],
      default: 'standard'
    }
  },
  calculatedTotal: {
    minPrice: { type: Number },
    maxPrice: { type: Number },
    currency: { type: String, default: 'USD' }
  },
  priority: {
    type: String,
    enum: ['normal', 'medium', 'high'],
    default: 'normal'
  },
  assignedManager: { type: String },
  notes: [{
    content: { type: String },
    author: { type: String },
    timestamp: { type: Date, default: Date.now },
    type: { type: String, enum: ['internal', 'customer'], default: 'internal' }
  }]
}, {
  timestamps: true
})

// Invoice Schema
const InvoiceSchema = new Schema<IInvoice & Document>({
  invoiceId: { type: String, required: true, unique: true },
  invoiceNumber: { type: String, required: true, unique: true },
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  customerId: { type: Schema.Types.ObjectId, ref: 'Customer', required: true },
  status: {
    type: String,
    enum: ['draft', 'sent', 'viewed', 'paid', 'overdue', 'cancelled'],
    default: 'draft'
  },
  issueDate: { type: Date, required: true },
  dueDate: { type: Date, required: true },
  lineItems: [{
    description: { type: String, required: true },
    quantity: { type: Number, default: 1 },
    unitPrice: { type: Number, required: true },
    adjustments: [{
      type: { type: String },
      description: { type: String },
      amount: { type: Number }
    }],
    total: { type: Number, required: true }
  }],
  subtotal: { type: Number, required: true },
  taxAmount: { type: Number, default: 0 },
  totalAmount: { type: Number, required: true },
  currency: { type: String, required: true, default: 'USD' },
  bankingDetails: {
    bankName: { type: String, required: true },
    accountNumber: { type: String, required: true },
    routingNumber: { type: String },
    swiftCode: { type: String },
    iban: { type: String },
    beneficiaryName: { type: String, required: true },
    beneficiaryAddress: { type: String, required: true },
    correspondentBank: { type: String },
    notes: {
      ru: { type: String },
      en: { type: String }
    }
  },
  paymentInstructions: {
    ru: { type: String, required: true },
    en: { type: String, required: true }
  }
}, {
  timestamps: true
})

// Order Tracking Schema
const OrderTrackingSchema = new Schema({
  orderId: { type: Schema.Types.ObjectId, ref: 'Order', required: true },
  status: { type: String, required: true },
  message: { type: String },
  author: { type: String },
  metadata: { type: Schema.Types.Mixed },
  timestamp: { type: Date, default: Date.now }
}, {
  timestamps: true
})

// Create indexes for better performance
ServiceCategorySchema.index({ categoryId: 1 })
ServiceSchema.index({ serviceId: 1, categoryId: 1 })
OrderSchema.index({ orderId: 1, status: 1, customerId: 1 })
InvoiceSchema.index({ invoiceId: 1, orderId: 1, status: 1 })
CustomerSchema.index({ customerId: 1, email: 1 })
OrderTrackingSchema.index({ orderId: 1, timestamp: -1 })

// Export models
export const ServiceCategoryModel = models.ServiceCategory || model('ServiceCategory', ServiceCategorySchema)
export const ServiceModel = models.Service || model('Service', ServiceSchema)
export const CustomerModel = models.Customer || model('Customer', CustomerSchema)
export const OrderModel = models.Order || model('Order', OrderSchema)
export const InvoiceModel = models.Invoice || model('Invoice', InvoiceSchema)
export const OrderTrackingModel = models.OrderTracking || model('OrderTracking', OrderTrackingSchema)

// Export types for better TypeScript support
export type ServiceCategoryDocument = IServiceCategory & Document
export type ServiceDocument = IService & Document
export type OrderDocument = IOrder & Document
export type InvoiceDocument = IInvoice & Document