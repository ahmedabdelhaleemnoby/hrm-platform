import 'package:hrm_mobile/features/attendance/screens/attendance_screen.dart';
import 'package:hrm_mobile/features/employees/screens/employee_list_screen.dart';
import 'package:hrm_mobile/features/leave/screens/leave_list_screen.dart';
import 'package:hrm_mobile/features/payroll/screens/payslip_list_screen.dart';
import 'package:hrm_mobile/core/localization/app_localizations.dart';
import 'package:hrm_mobile/core/localization/locale_provider.dart';
import 'package:hrm_mobile/core/auth/auth_service.dart';
import 'package:hrm_mobile/features/auth/screens/login_screen.dart';
import 'package:provider/provider.dart';

class MainNavigation extends StatefulWidget {
  const MainNavigation({super.key});

  @override
  State<MainNavigation> createState() => _MainNavigationState();
}

class _MainNavigationState extends State<MainNavigation> {
  int _selectedIndex = 0;

  final List<Widget> _screens = [
    const EmployeeListScreen(),
    const AttendanceScreen(),
    const LeaveListScreen(),
    const PayslipListScreen(),
    const _ProfileScreen(),
  ];

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      body: IndexedStack(
        index: _selectedIndex,
        children: _screens,
      ),
      bottomNavigationBar: BottomNavigationBar(
        currentIndex: _selectedIndex,
        onTap: (index) => setState(() => _selectedIndex = index),
        type: BottomNavigationBarType.fixed,
        items: [
          BottomNavigationBarItem(
            icon: const Icon(Icons.people_outline),
            activeIcon: const Icon(Icons.people),
            label: AppLocalizations.of(context)!.translate('employees'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.timer_outlined),
            activeIcon: const Icon(Icons.timer),
            label: AppLocalizations.of(context)!.translate('attendance'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.event_note_outlined),
            activeIcon: const Icon(Icons.event_note),
            label: AppLocalizations.of(context)!.translate('leaves'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.account_balance_wallet_outlined),
            activeIcon: const Icon(Icons.account_balance_wallet),
            label: AppLocalizations.of(context)!.translate('payslips'),
          ),
          BottomNavigationBarItem(
            icon: const Icon(Icons.person_outline),
            activeIcon: const Icon(Icons.person),
            label: AppLocalizations.of(context)!.translate('profile'),
          ),
        ],
      ),
    );
  }
}

class _ProfileScreen extends StatelessWidget {
  const _ProfileScreen();

  @override
  Widget build(BuildContext context) {
    final localeProvider = Provider.of<LocaleProvider>(context);

    return Scaffold(
      appBar: AppBar(title: Text(AppLocalizations.of(context)!.translate('profile'))),
      body: Padding(
        padding: const EdgeInsets.all(24),
        child: Column(
          children: [
            ListTile(
              title: Text(AppLocalizations.of(context)!.translate('language')),
              subtitle: Text(localeProvider.locale.languageCode == 'en' ? 'English' : 'العربية'),
              trailing: const Icon(Icons.language),
              onTap: () => localeProvider.toggleLocale(),
            ),
            const Divider(),
            ListTile(
              title: Text(AppLocalizations.of(context)!.translate('logout'), style: const TextStyle(color: Colors.red)),
              leading: const Icon(Icons.logout, color: Colors.red),
              onTap: () async {
                await authService.logout();
                if (context.mounted) {
                  Navigator.of(context).pushAndRemoveUntil(
                    MaterialPageRoute(builder: (_) => const LoginScreen()),
                    (route) => false,
                  );
                }
              },
            ),
          ],
        ),
      ),
    );
  }
}
