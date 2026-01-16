#!/bin/bash

# HRM Platform - Quick Start Script
# This script sets up the entire project for local development

set -e

echo "🚀 HRM Platform - Quick Start"
echo "=============================="
echo ""

# Check prerequisites
echo "📋 Checking prerequisites..."

command -v docker >/dev/null 2>&1 || { echo "❌ Docker is not installed. Please install Docker first."; exit 1; }
command -v docker-compose >/dev/null 2>&1 || { echo "❌ Docker Compose is not installed. Please install Docker Compose first."; exit 1; }

echo "✅ Prerequisites check passed"
echo ""

# Create necessary directories
echo "📁 Creating directories..."
mkdir -p backend/storage/{app,framework,logs}
mkdir -p backend/bootstrap/cache
mkdir -p frontend/node_modules
mkdir -p infrastructure/nginx

echo "✅ Directories created"
echo ""

# Build and start Docker containers
echo "🐳 Building and starting Docker containers..."
echo "This may take a few minutes on first run..."
docker-compose up -d --build

echo ""
echo "⏳ Waiting for services to be ready..."
sleep 10

# Check if services are running
if docker-compose ps | grep -q "Up"; then
    echo "✅ Docker services are running"
else
    echo "❌ Some services failed to start. Check logs with: docker-compose logs"
    exit 1
fi

echo ""
echo "🎉 Setup complete!"
echo ""
echo "📍 Access Points:"
echo "   - Frontend: http://localhost:3000"
echo "   - Backend API: http://localhost:8000"
echo "   - Database: localhost:5432"
echo "   - Redis: localhost:6379"
echo "   - Meilisearch: http://localhost:7700"
echo "   - MailHog: http://localhost:8025"
echo ""
echo "📚 Next Steps:"
echo "   1. Backend setup: cd backend && composer install"
echo "   2. Run migrations: docker-compose exec backend php artisan migrate"
echo "   3. Seed database: docker-compose exec backend php artisan db:seed"
echo "   4. Frontend setup: cd frontend && npm install"
echo ""
echo "🛠️  Useful Commands:"
echo "   - View logs: docker-compose logs -f"
echo "   - Stop services: docker-compose down"
echo "   - Restart services: docker-compose restart"
echo "   - Run tests: ./scripts/run-tests.sh"
echo ""
echo "Happy coding! 🎉"
