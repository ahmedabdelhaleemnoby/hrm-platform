# HRM Platform - Mobile App

Cross-platform Flutter application for the Enterprise HRM Platform, providing employees with essential HR tools on the go.

## 🚀 Key Features

- **Full Localization**: Complete Arabic and English support with automatic RTL (Right-to-Left) layout switching.
- **Payslip Management**: View monthly salary breakdowns and **download official PDF payslips** directly to your device.
- **Attendance**: Secure clock-in/out functionality with location tracking.
- **Leave Requests**: Submit and track leave requests with real-time status updates.
- **Biometric Security**: Secure access using Fingerprint or Face ID (supported devices).

## 🛠️ Tech Stack

- **Framework**: Flutter 3.x
- **Localization**: `flutter_localizations` & `intl`
- **Networking**: `Dio` with secure interceptors
- **State Management**: `Provider` (Locale management)
- **PDF & Local Storage**: `path_provider`, `open_filex`, `shared_preferences`

## 📁 Project Structure

```
mobile/
├── assets/
│   ├── translations/    # en.json and ar.json files
│   └── images/
├── lib/
│   ├── core/
│   │   ├── api/         # API Interceptors & Clients
│   │   ├── auth/        # Secure Token Storage
│   │   └── localization/# AppLocalizations & LocaleProvider
│   ├── features/
│   │   ├── attendance/  # Clock in/out screens
│   │   ├── leave/       # Leave request & history
│   │   ├── payroll/     # Payslip list & PDF download logic
│   │   └── auth/        # Localized login flow
│   └── main.dart
└── pubspec.yaml
```

## 🛠️ Installation

### 1. Prerequisites
- Flutter SDK (stable channel)
- Android Studio / Xcode

### 2. Setup
```bash
flutter pub get
```

### 3. Running
```bash
flutter run
```

## 🌍 Localization

The app uses a JSON-based localization system. 
- **Language Toggle**: Found in the Profile tab.
- **RTL Support**: The UI automatically mirrors when switching to Arabic, ensuring a native experience for RTL users.

## 📄 Payslip Downloads

The app communicates with the backend to generate official payslip PDFs.
- **Service**: `PayrollService.downloadPayslipPdf()`
- **Feedback**: Provides real-time "Downloading" and "Opening" status to the user.

## 🧪 Development

```bash
flutter analyze      # Static analysis
flutter format .     # Code formatting
```

---
**Mobilizing the workforce, one tap at a time**
