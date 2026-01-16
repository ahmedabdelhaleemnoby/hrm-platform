# HRM Platform - Mobile App

Flutter-based mobile application for HRM Platform (iOS & Android).

## 🚀 Tech Stack

- **Framework:** Flutter 3+
- **Language:** Dart
- **State Management:** Bloc / Provider
- **API Client:** Dio
- **Local Storage:** Hive / SharedPreferences
- **Navigation:** GoRouter

## 📁 Project Structure

```
mobile/
├── android/              # Android native code
├── ios/                  # iOS native code
├── lib/
│   ├── core/            # Core functionality
│   │   ├── api/         # API client
│   │   ├── auth/        # Authentication
│   │   ├── theme/       # App theming
│   │   └── utils/       # Utilities
│   ├── features/        # Feature modules
│   │   ├── auth/
│   │   │   ├── bloc/
│   │   │   ├── models/
│   │   │   └── screens/
│   │   ├── attendance/
│   │   ├── leave/
│   │   ├── profile/
│   │   └── dashboard/
│   ├── shared/          # Shared widgets
│   │   ├── widgets/
│   │   └── styles/
│   └── main.dart
├── test/
├── pubspec.yaml
└── README.md
```

## 🛠️ Installation

### Prerequisites

- Flutter SDK 3.0+
- Dart 3.0+
- Android Studio / Xcode
- iOS Simulator / Android Emulator

### 1. Install Flutter

```bash
# macOS
brew install flutter

# Or download from: https://flutter.dev
```

### 2. Check Installation

```bash
flutter doctor
```

### 3. Install Dependencies

```bash
flutter pub get
```

### 4. Run App

```bash
# iOS
flutter run -d ios

# Android
flutter run -d android

# Web (for testing)
flutter run -d chrome
```

## 📦 Available Commands

```bash
# Run app
flutter run

# Build APK (Android)
flutter build apk

# Build App Bundle (Android)
flutter build appbundle

# Build iOS
flutter build ios

# Run tests
flutter test

# Analyze code
flutter analyze

# Format code
dart format .

# Clean build
flutter clean
```

## 📱 Features

### Current Features
- ✅ Authentication (Login, Logout)
- ✅ Employee Profile
- ✅ Attendance (Clock In/Out)
- ✅ Leave Requests
- ✅ Attendance History
- ✅ Push Notifications
- ✅ Biometric Authentication

### Upcoming Features
- 🔄 Payslip Viewing
- 🔄 Performance Reviews
- 🔄 Team Directory
- 🔄 Offline Mode

## 🔐 Authentication

```dart
import 'package:hrm_mobile/core/auth/auth_service.dart';

class LoginScreen extends StatelessWidget {
  final AuthService _authService = AuthService();

  Future<void> login() async {
    try {
      await _authService.login(
        email: 'user@example.com',
        password: 'password',
      );
      // Navigate to dashboard
    } catch (e) {
      // Handle error
    }
  }
}
```

## 🌐 API Integration

```dart
import 'package:dio/dio.dart';

class ApiClient {
  final Dio _dio = Dio(
    BaseOptions(
      baseUrl: 'http://localhost:8000/api',
      headers: {'Content-Type': 'application/json'},
    ),
  );

  Future<List<Employee>> getEmployees() async {
    final response = await _dio.get('/employees');
    return (response.data as List)
        .map((e) => Employee.fromJson(e))
        .toList();
  }
}
```

## 📊 State Management (Bloc)

```dart
// attendance_bloc.dart
import 'package:flutter_bloc/flutter_bloc.dart';

class AttendanceBloc extends Bloc<AttendanceEvent, AttendanceState> {
  AttendanceBloc() : super(AttendanceInitial()) {
    on<ClockInEvent>((event, emit) async {
      emit(AttendanceLoading());
      try {
        await _attendanceService.clockIn();
        emit(AttendanceSuccess());
      } catch (e) {
        emit(AttendanceError(e.toString()));
      }
    });
  }
}

// Usage in widget
BlocProvider(
  create: (context) => AttendanceBloc(),
  child: AttendanceScreen(),
)
```

## 🎨 Theming

```dart
// theme.dart
import 'package:flutter/material.dart';

final ThemeData appTheme = ThemeData(
  primarySwatch: Colors.blue,
  fontFamily: 'Inter',
  elevatedButtonTheme: ElevatedButtonThemeData(
    style: ElevatedButton.styleFrom(
      padding: EdgeInsets.symmetric(vertical: 16),
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(8),
      ),
    ),
  ),
);
```

## 🧪 Testing

```bash
# Unit tests
flutter test

# Widget tests
flutter test test/widgets/

# Integration tests
flutter test integration_test/
```

Example test:

```dart
testWidgets('Login screen test', (WidgetTester tester) async {
  await tester.pumpWidget(MyApp());
  
  expect(find.text('Login'), findsOneWidget);
  expect(find.byType(TextField), findsNWidgets(2));
  
  await tester.tap(find.text('Login'));
  await tester.pump();
});
```

## 📱 Platform-Specific Configuration

### Android

```gradle
// android/app/build.gradle
android {
    defaultConfig {
        minSdkVersion 21
        targetSdkVersion 34
        versionCode 1
        versionName "1.0.0"
    }
}
```

### iOS

```swift
// ios/Runner/Info.plist
<key>NSCameraUsageDescription</key>
<string>Camera is needed for profile photos</string>
<key>NSLocationWhenInUseUsageDescription</key>
<string>Location is needed for attendance tracking</string>
```

## 🚀 Deployment

### Android (Google Play)

```bash
# Build release APK
flutter build apk --release

# Build App Bundle (recommended)
flutter build appbundle --release
```

### iOS (App Store)

```bash
# Build iOS release
flutter build ios --release

# Create archive in Xcode
open ios/Runner.xcworkspace
```

## 🔔 Push Notifications

Using Firebase Cloud Messaging:

```dart
import 'package:firebase_messaging/firebase_messaging.dart';

class NotificationService {
  final FirebaseMessaging _fcm = FirebaseMessaging.instance;

  Future<void> initialize() async {
    await _fcm.requestPermission();
    String? token = await _fcm.getToken();
    print('FCM Token: $token');
    
    FirebaseMessaging.onMessage.listen((RemoteMessage message) {
      // Handle foreground notification
    });
  }
}
```

## 📚 Resources

- [Flutter Documentation](https://flutter.dev/docs)
- [Dart Documentation](https://dart.dev/guides)
- [Flutter Bloc](https://bloclibrary.dev)
- [Dio HTTP Client](https://pub.dev/packages/dio)
