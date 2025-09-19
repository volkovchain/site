# Docker Development Environment

This project includes a complete Docker Compose setup for development with the following services:

## Services

### 🚀 Next.js Application (`app`)
- **Port**: 3000
- **Features**: Hot reloading, TypeScript support, Tailwind CSS
- **Environment**: Development mode with file watching

### 🗄️ MongoDB (`mongodb`)
- **Port**: 27017
- **Version**: MongoDB 7.0
- **Credentials**: 
  - Root: `admin` / `adminpassword`
  - App User: `volkovchain_user` / `volkovchain_password`
- **Database**: `volkovchain`

### 🌐 Mongo Express (`mongo-express`)
- **Port**: 8081
- **Purpose**: Web-based MongoDB administration
- **Access**: http://localhost:8081
- **Credentials**: `admin` / `admin`

### 🔴 Redis (`redis`)
- **Port**: 6379
- **Purpose**: Caching and session storage
- **Version**: Redis 7.2

### 🔄 Nginx (`nginx`) - Optional
- **Ports**: 80, 443
- **Purpose**: Reverse proxy with load balancing
- **Usage**: Enable with `--profile nginx`

## Quick Start

### 1. Environment Setup
```bash
# Copy environment template
cp .env.docker .env.local

# Edit .env.local with your actual values
nano .env.local
```

### 2. Start Development Environment
```bash
# Start all services
docker-compose up --build

# Or start in background
docker-compose up -d --build
```

### 3. Access Your Application
- **Next.js App**: http://localhost:3000
- **MongoDB Admin**: http://localhost:8081
- **MongoDB Direct**: mongodb://localhost:27017

## Useful Commands

### Development
```bash
# Start development environment
docker-compose up --build

# Start with nginx proxy
docker-compose --profile nginx up --build

# View logs
docker-compose logs -f app

# Stop services
docker-compose down
```

### Database Management
```bash
# Access MongoDB shell
docker-compose exec mongodb mongosh

# Backup database
docker-compose exec mongodb mongodump --out /data/db/backup

# Access application shell
docker-compose exec app sh
```

### Maintenance
```bash
# Clean up everything (containers, networks, volumes)
docker-compose down -v --remove-orphans

# Rebuild specific service
docker-compose build app

# View service status
docker-compose ps
```

## File Structure

```
docker/
├── mongodb/
│   └── init/
│       └── init-db.js      # Database initialization
├── nginx/
│   ├── nginx.conf          # Nginx configuration
│   └── ssl/                # SSL certificates (if needed)
└── scripts.md              # Additional helper scripts
```

## Environment Variables

The Docker setup uses these key environment variables:

```bash
# Database
MONGODB_URI=mongodb://admin:adminpassword@mongodb:27017/volkovchain?authSource=admin

# Application
NEXT_PUBLIC_SITE_URL=http://localhost:3000
NODE_ENV=development

# Optional services
REDIS_URL=redis://redis:6379
```

## Production Build

For production deployment:

```bash
# Build production image
docker build -t volkovchain-site:latest .

# Run production container
docker run -p 3000:3000 \
  -e MONGODB_URI="your_production_mongodb_uri" \
  -e NEXT_PUBLIC_SITE_URL="https://your-domain.com" \
  volkovchain-site:latest
```

## Troubleshooting

### Common Issues

1. **Port conflicts**: Make sure ports 3000, 27017, 8081, 6379 are not in use
2. **File watching**: On Windows/macOS, file watching might need polling enabled
3. **Database connection**: Wait for MongoDB to fully start before the app connects

### Health Checks

```bash
# Check if MongoDB is ready
docker-compose exec mongodb mongosh --eval "db.adminCommand('ping')"

# Check Next.js app
curl http://localhost:3000/api/services

# View container logs
docker-compose logs -f [service_name]
```

### Performance Tips

1. **Volume mounting**: Use bind mounts for development, volumes for data
2. **Build caching**: Docker will cache layers for faster subsequent builds
3. **Resource limits**: Adjust Docker Desktop memory/CPU if needed

## Integration with Existing Project

This Docker setup integrates seamlessly with your existing:
- ✅ Next.js 15 configuration
- ✅ TypeScript setup
- ✅ Tailwind CSS v4
- ✅ MongoDB connections
- ✅ Testing framework (Vitest + Playwright)
- ✅ Service registry and Zustand stores

The development environment preserves all your current features while providing a consistent, isolated development experience.