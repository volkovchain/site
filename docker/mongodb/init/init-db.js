// MongoDB initialization script for development
// This script creates a user and database for the application

db = db.getSiblingDB('volkovchain');

// Create application user
db.createUser({
  user: 'volkovchain_user',
  pwd: 'volkovchain_password',
  roles: [
    { role: 'readWrite', db: 'volkovchain' }
  ]
});

// Create collections with initial data if needed
db.createCollection('orders');
db.createCollection('analytics');
db.createCollection('invoices');

// Insert sample data for development (optional)
db.orders.insertOne({
  _id: ObjectId(),
  orderId: 'dev-sample-001',
  service: 'blockchain-consultation',
  status: 'pending',
  createdAt: new Date(),
  customerEmail: 'dev@example.com'
});

print('Database initialization complete!');