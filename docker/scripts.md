# Docker Development Scripts
# Add these scripts to your package.json for easier Docker management

# Start development environment
docker:dev: "docker-compose up --build"

# Start development environment in background
docker:dev:detached: "docker-compose up -d --build"

# Stop development environment
docker:stop: "docker-compose down"

# View logs
docker:logs: "docker-compose logs -f"

# Clean up (remove containers, networks, and volumes)
docker:clean: "docker-compose down -v --remove-orphans"

# Build production image
docker:build:prod: "docker build -t volkovchain-site:latest ."

# Start with nginx proxy
docker:dev:nginx: "docker-compose --profile nginx up --build"

# Database operations
docker:db:backup: "docker-compose exec mongodb mongodump --out /data/db/backup"
docker:db:restore: "docker-compose exec mongodb mongorestore /data/db/backup"

# Access containers
docker:shell:app: "docker-compose exec app sh"
docker:shell:db: "docker-compose exec mongodb mongosh"