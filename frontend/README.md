# HRM Platform - Frontend Dashboard

React-based web dashboard for the Enterprise HRM Platform, built with focus on speed, accessibility, and global support.

## 🚀 Key Features

- **Full Localization**: Automatic LTR/RTL switching based on selected locale (Arabic/English).
- **Interactive Reports**: Dynamic BarCharts for department-wise employee distribution and payroll expenses.
- **Responsive Design**: Mobile-first UI using Material-UI (MUI).
- **Security**: Permission-based UI elements and secure JWT authentication.
- **Modern Stack**: Built with React 18 and Vite for blazing fast development.

## 🛠️ Tech Stack

- **Framework**: React 18+ (Vite)
- **Language**: TypeScript
- **UI Architecture**: Material-UI (MUI) 6.0
- **State Management**: Redux Toolkit (RTK Query ready)
- **Localization**: i18next + react-i18next
- **Charts**: Recharts (with localized axes and tooltips)

## 📁 Project Structure

```
frontend/
├── src/
│   ├── api/              # Centralized API definitions
│   ├── components/       # UI Components (Layout, Sidebar, StatCards)
│   ├── contexts/         # Theme & Auth Contexts
│   ├── locales/          # Translation JSON files (en/ar)
│   ├── pages/            # View-level components (Dashboard, Reports, Employees)
│   ├── utils/            # Shared utilities (currency formatting, date helpers)
│   └── main.tsx
├── package.json
└── vite.config.ts
```

## 🛠️ Installation

### 1. Install Dependencies
```bash
npm install
```

### 2. Environment Setup
```bash
cp .env.example .env
```
Ensure `VITE_API_URL` points to your running backend.

### 3. Start Development
```bash
npm run dev
```
Accessible at: `http://localhost:3000`

## 🌍 Localization & RTL

The application uses `i18next` for translations. The layout automatically switches to RTL (Right-to-Left) when Arabic is selected.

**Translation keys** are stored in:
- `src/locales/en.json`
- `src/locales/ar.json`

## 📊 Charts & Analytics

We use `Recharts` for data visualization. All charts are integrated with the localization system to provide localized labels and currency symbols (`ج.م` for Arabic, `$` for English).

## 🧪 Development Scripts

```bash
npm run dev      # Dev server
npm run build    # Production build
npm run lint     # Linting (ESLint)
```

---
**Crafted with excellence for HR Professionals**
