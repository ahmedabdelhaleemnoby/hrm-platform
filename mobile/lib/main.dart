import 'package:flutter/material.dart';
import 'package:flutter_localizations/flutter_localizations.dart';
import 'package:google_fonts/google_fonts.dart';
import 'package:hrm_mobile/core/auth/auth_service.dart';
import 'package:hrm_mobile/core/localization/app_localizations.dart';
import 'package:hrm_mobile/core/localization/locale_provider.dart';
import 'package:hrm_mobile/features/auth/screens/login_screen.dart';
import 'package:hrm_mobile/shared/widgets/main_navigation.dart';
import 'package:provider/provider.dart';

void main() async {
  WidgetsFlutterBinding.ensureInitialized();
  
  // Check if user is already authenticated
  final bool isAuthenticated = await authService.checkAuthStatus();
  
  runApp(
    MultiProvider(
      providers: [
        ChangeNotifierProvider(create: (_) => LocaleProvider()),
      ],
      child: HRMApp(initialScreen: isAuthenticated ? const MainNavigation() : const LoginScreen()),
    ),
  );
}

class HRMApp extends StatelessWidget {
  final Widget initialScreen;
  const HRMApp({super.key, required this.initialScreen});

  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);

    return MaterialApp(
      title: 'HRM Platform',
      debugShowCheckedModeBanner: false,
      locale: localeProvider.locale,
      supportedLocales: const [
        Locale('en', ''),
        Locale('ar', ''),
      ],
      localizationsDelegates: const [
        AppLocalizations.delegate,
        GlobalMaterialLocalizations.delegate,
        GlobalWidgetsLocalizations.delegate,
        GlobalCupertinoLocalizations.delegate,
      ],
      theme: ThemeData(
        useMaterial3: true,
        colorScheme: ColorScheme.fromSeed(
          seedColor: const Color(0xFF667EEA),
          primary: const Color(0xFF667EEA),
        ),
        textTheme: GoogleFonts.interTextTheme(),
            fontSize: 20,
            fontWeight: FontWeight.bold,
          ),
          iconTheme: IconThemeData(color: Colors.black),
        ),
      ),
      home: initialScreen,
    );
  }
}
