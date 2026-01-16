# Enterprise HRM Platform

**Version:** 1.1.0  
**Status:** In Development (MVP Feature Complete)  
**Architecture:** Modular Monolith → Microservices Ready

## 🎯 Project Overview

Enterprise-level Human Resource Management (HRM) SaaS platform designed to serve medium to large organizations globally. Built with modern technologies and best practices, featuring a responsive web dashboard and a fully functional mobile application.

## 🌟 Key Recent Updates
- **Full Localization (Arabic & English):** Complete RTL (Right-to-Left) support for both Web and Mobile.
- **Mobile Payslips:** Employees can now view and download their monthly payslips as official PDFs from the mobile app.
- **Attendance GPS:** Real-time location tracking for employee clock-in/out on mobile.
- **Reporting Analytics:** Interactive localized charts for payroll and department distribution.

## 🏗️ Project Structure

```
hrm-platform/
├── backend/              # Laravel API (PHP 8.3+)
├── frontend/             # React Dashboard (TypeScript)
├── mobile/               # Flutter App (iOS & Android)
├── infrastructure/       # Docker, Nginx Configuration
├── docs/                 # Documentation & Architecture
└── README.md
```

## 🚀 Tech Stack

### Backend
- **Framework:** Laravel 12.0
- **PDF Generation:** Laravel DomPDF (with Arabic/RTL support)
- **Database:** PostgreSQL
- **Security:** Laravel Sanctum (JWT), RBAC (Roles/Permissions)
- **Documentation:** L5-Swagger

### Frontend
- **Framework:** React 18+ (Vite)
- **Language:** TypeScript
- **UI Library:** Material-UI (MUI)
- **Charts:** Recharts (Localized)
- **i18n:** i18next (Arabic/English/RTL)

### Mobile
- **Framework:** Flutter 3.x
- **Localization:** flutter_localizations + intl
- **Network:** Dio
- **File Handling:** path_provider + open_filex

## 📋 Prerequisites

- PHP 8.2+
- Composer 2.x
- Node.js 18+
- Flutter SDK (stable)
- Docker & Docker Compose

## 🛠️ Quick Start

### 1. Clone & Setup
```bash
git clone https://github.com/ahmedabdelhaleemnoby/hrm-platform.git
cd hrm-platform
```

### 2. Manual Setup (Development)

**Backend:**
```bash
cd backend
cp .env.example .env
composer install
php artisan key:generate
php artisan migrate --seed
php artisan serve
```

**Frontend:**
```bash
cd frontend
npm install
npm run dev
```

**Mobile:**
```bash
cd mobile
flutter pub get
flutter run
```

### 3. Docker Setup
```bash
docker-compose up -d
```

## 📊 Modules

- ✅ **Employee Management** - Full lifecycle with document management.
- ✅ **Attendance & Time Tracking** - GPS-based mobile clock-in/out + Web dashboard.
- ✅ **Payroll** - Period-based calculation, payslip list, and official PDF generation.
- ✅ **Leave Management** - Multi-level approval workflows and history tracking.
- ✅ **Reporting & Analytics** - Departmental stats, payroll expenses, and data exports.
- ✅ **Localization** - Seamless switching between English (LTR) and Arabic (RTL).

## 🧪 Testing

```bash
# Backend
cd backend
php artisan test

# Frontend
cd frontend
npm run lint

# Mobile
cd mobile
flutter analyze
```

## 🤝 Contributing

We welcome contributions! Please check [CONTRIBUTING.md](CONTRIBUTING.md) for our standards and submission process.

## 📝 License

This project is proprietary. All rights reserved.

---

**Built with ❤️ for a digitized HR experience**
