# 🚀 HRM Platform - Setup Guide

## ⚠️ Docker Issue Fixed!

ملف `composer.lock` تم إنشاؤه. جرب Docker مرة أخرى أو استخدم التشغيل المحلي.

---

## 🔧 الطريقة 1: التشغيل المحلي (أسرع وأسهل)

### المتطلبات:
```bash
# تثبيت PHP 8.3
brew install php@8.3

# تثبيت Composer
brew install composer

# تثبيت PostgreSQL
brew install postgresql@15

# تثبيت Node.js
brew install node
```

### خطوات التشغيل:

#### 1️⃣ Backend (Laravel):

```bash
cd backend

# تثبيت Dependencies
composer install

# نسخ ملف البيئة
cp .env.example .env

# تعديل ملف .env:
# DB_CONNECTION=pgsql
# DB_HOST=127.0.0.1
# DB_PORT=5432
# DB_DATABASE=hrm_platform
# DB_USERNAME=postgres
# DB_PASSWORD=

# توليد مفتاح
php artisan key:generate

# إنشاء قاعدة البيانات
createdb hrm_platform

# تشغيل Migrations
php artisan migrate

# ملء البيانات التجريبية
php artisan db:seed

# تشغيل السيرفر
php artisan serve
```

**Backend سيعمل على:** http://localhost:8000

#### 2️⃣ Frontend (React):

في terminal جديد:

```bash
cd frontend

# تثبيت Dependencies
npm install

# تشغيل السيرفر
npm run dev
```

**Frontend سيعمل على:** http://localhost:3000

---

## 🐳 الطريقة 2: Docker (البديل)

```bash
# بناء وتشغيل Containers
docker compose up -d --build

# الدخول للـ backend
docker compose exec backend sh

# داخل الـ container:
composer install
php artisan key:generate
php artisan migrate
php artisan db:seed
exit
```

---

## 🔐 بيانات الدخول التجريبية:

```
Email: admin@democorp.com
Password: admin123

أو أي موظف:
Email: [any-employee]@democorp.com
Password: password
```

---

## ✅ التحقق من التشغيل:

1. افتح http://localhost:3000
2. قم بتسجيل الدخول بالبيانات أعلاه
3. استكشف الصفحات:
   - Dashboard
   - Employees
   - Attendance
   - Leave
   - Payroll
   - Performance
   - Reports

---

## 🆘 حل المشاكل الشائعة:

### مشكلة قاعدة البيانات:
```bash
# إنشاء قاعدة البيانات
createdb hrm_platform

# أو باستخدام psql:
psql postgres
CREATE DATABASE hrm_platform;
\q
```

### مشكلة Port مستخدم:
```bash
# إيقاف العملية على port 8000
lsof -ti:8000 | xargs kill -9

# إيقاف العملية على port 3000
lsof -ti:3000 | xargs kill -9
```

### إعادة تعيين قاعدة البيانات:
```bash
cd backend
php artisan migrate:fresh --seed
```

---

## 📊 البيانات التجريبية:

النظام يحتوي على:
- ✅ 1 شركة مع 3 فروع
- ✅ 7 أقسام
- ✅ 110 موظف
- ✅ 10 حسابات مستخدمين
- ✅ بيانات واقعية للاختبار

---

## 💡 نصائح سريعة:

1. استخدم **التشغيل المحلي** للتطوير (أسرع)
2. استخدم **Docker** للنشر والإنتاج
3. تحقق من ملف `.env` في backend
4. تأكد من تشغيل PostgreSQL
5. افتح termin منفصلة للـ backend والـ frontend

---

## 📞 تحتاج مساعدة؟

1. تحقق من الـ logs:
   ```bash
   # Backend logs
   tail -f backend/storage/logs/laravel.log
   
   # Docker logs
   docker compose logs -f
   ```

2. أعد تشغيل الخدمات:
   ```bash
   # Local
   php artisan serve
   npm run dev
   
   # Docker
   docker compose restart
   ```

---

**🎉 الآن نظامك جاهز للاستخدام!**
