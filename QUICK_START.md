# HRM Platform - Quick Start Guide

## 🚀 Quick Setup

### Prerequisites
- Docker & Docker Compose
- Git

### 1. Clone and Setup

```bash
cd "/Users/ahmedabuzyad/Desktop/my Project/hrm-platform"
```

### 2. Start Services

```bash
# Start all services
docker-compose up -d

# Or use the quick start script
./scripts/quick-start.sh
```

### 3. Backend Setup

```bash
# Enter backend container
docker-compose exec backend sh

# Install dependencies
composer install

# Generate application key
php artisan key:generate

# Run migrations
php artisan migrate

# Seed database with demo data
php artisan db:seed

# Exit container
exit
```

### 4. Frontend Setup

```bash
# Install frontend dependencies
cd frontend
npm install

# Start development server
npm run dev
```

## 📍 Access Points

- **Frontend**: http://localhost:3000
- **Backend API**: http://localhost:8000/api
- **Database**: localhost:5432 (PostgreSQL)
- **Redis**: localhost:6379
- **MailHog**: http://localhost:8025

## 🔐 Demo Credentials

```
Email: admin@democorp.com
Password: admin123
```

Or use any employee email with password: `password`

## 📊 Seeded Data

The database will be populated with:
- ✅ 1 Demo Tenant (Demo Corporation)
- ✅ 1 Company with 3 Branches
- ✅ 7 Departments (Engineering, Sales, Marketing, HR, Finance, etc.)
- ✅ 3 Teams (Backend, Frontend, DevOps)
- ✅ 10 Positions
- ✅ ~110 Employees
- ✅ 10 User Accounts

## 🛠️ Useful Commands

### Backend

```bash
# Run migrations
php artisan migrate

# Rollback migrations
php artisan migrate:rollback

# Fresh migrate with seed
php artisan migrate:fresh --seed

# Create new seeder
php artisan make:seeder NameSeeder

# Run specific seeder
php artisan db:seed --class=EmployeeSeeder
```

### Frontend

```bash
# Install dependencies
npm install

# Development server
npm run dev

# Build for production
npm run build

# Preview production build
npm run preview
```

### Docker

```bash
# Start services
docker-compose up -d

# Stop services
docker-compose down

# View logs
docker-compose logs -f

# Restart a service
docker-compose restart backend

# Rebuild containers
docker-compose up -d --build
```

## 📁 Project Structure

```
hrm-platform/
├── backend/               # Laravel API
│   ├── app/
│   ├── database/
│   │   ├── migrations/   # Database schema
│   │   └── seeders/      # Demo data
│   └── routes/
├── frontend/              # React UI
│   ├── src/
│   │   ├── pages/        # Main pages
│   │   ├── components/   # Reusable components
│   │   └── api/          # API client
│   └── package.json
├── infrastructure/        # Docker configs
└── docker-compose.yml
```

## 🎯 Features Available

### Pages
- ✅ Dashboard
- ✅ Employees (List & Profile)
- ✅ Attendance Tracking
- ✅ Leave Management
- ✅ Payroll
- ✅ Performance (OKRs)
- ✅ Reports & Analytics

### API Endpoints
- ✅ Authentication (Login, Logout, Refresh)
- ✅ Employee CRUD
- ✅ Search & Filters
- ✅ Pagination

## 🐛 Troubleshooting

### Port Conflicts

If ports are already in use:

```bash
# Check what's using a port
lsof -i :3000
lsof -i :8000

# Kill the process
kill -9 <PID>
```

### Database Issues

```bash
# Reset database
docker-compose exec backend php artisan migrate:fresh --seed

# Check database connection
docker-compose exec backend php artisan tinker
>>> DB::connection()->getPdo();
```

### Frontend Not Loading

```bash
# Clear node modules
cd frontend
rm -rf node_modules package-lock.json
npm install
```

## 📚 Next Steps

1. **Customize**: Update company info, departments, positions
2. **Integrate**: Connect real authentication (SSO, LDAP)
3. **Deploy**: Set up staging/production environments
4. **Monitor**: Add logging and monitoring tools
5. **Test**: Write unit and integration tests

## 💡 Tips

- Use `admin@democorp.com` for full access
- All demo users have password `password`
- Check MailHog (http://localhost:8025) for emails
- Database is seeded with realistic data for testing
- Frontend hot reloads on file changes

## 🆘 Need Help?

Check the documentation:
- `README.md` - Project overview
- `backend/README.md` - Backend details
- `frontend/README.md` - Frontend details
- `CONTRIBUTING.md` - Development guidelines

---

**Happy Coding! 🚀**
