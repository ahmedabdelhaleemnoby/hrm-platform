import 'package:flutter/material.dart';
import 'package:dio/dio.dart';
import 'package:hrm_mobile/core/api/api_client.dart';
import 'package:hrm_mobile/core/auth/auth_service.dart';
import 'package:hrm_mobile/features/auth/screens/login_screen.dart';
import 'package:hrm_mobile/features/employees/models/employee.dart';
import 'package:hrm_mobile/features/employees/screens/employee_detail_screen.dart';
import 'package:hrm_mobile/core/localization/app_localizations.dart';

class EmployeeListScreen extends StatefulWidget {
  const EmployeeListScreen({super.key});

  @override
  State<EmployeeListScreen> createState() => _EmployeeListScreenState();
}

class _EmployeeListScreenState extends State<EmployeeListScreen> {
  List<Employee> _employees = [];
  bool _isLoading = true;
  String _searchQuery = '';

  @override
  void initState() {
    super.initState();
    _fetchEmployees();
  }

  Future<void> _fetchEmployees() async {
    setState(() => _isLoading = true);
    try {
      final response = await apiClient.get('/employees', queryParameters: {
        'search': _searchQuery,
      });
      
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        setState(() {
          _employees = data.map((e) => Employee.fromJson(e)).toList();
          _isLoading = false;
        });
      }
    } catch (e) {
      debugPrint('Error fetching employees: $e');
      setState(() => _isLoading = false);
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Failed to load employees')),
        );
      }
    }
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.translate('employees')),
        actions: [
          IconButton(
            icon: const Icon(Icons.logout),
            onPressed: () async {
              await authService.logout();
              if (mounted) {
                Navigator.of(context).pushReplacement(
                  MaterialPageRoute(builder: (_) => const LoginScreen()),
                );
              }
            },
          ),
        ],
        bottom: PreferredSize(
          preferredSize: const Size.fromHeight(60),
          child: Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            child: TextField(
              onChanged: (value) {
                _searchQuery = value;
                _fetchEmployees();
              },
              decoration: InputDecoration(
                hintText: AppLocalizations.of(context)!.translate('search_employees'),
                prefixIcon: const Icon(Icons.search),
                filled: true,
                fillColor: Colors.grey[200],
                border: OutlineInputBorder(
                  borderRadius: BorderRadius.circular(12),
                  borderSide: BorderSide.none,
                ),
                contentPadding: const EdgeInsets.symmetric(vertical: 0),
              ),
            ),
          ),
        ),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : _employees.isEmpty
              ? const Center(child: Text('No employees found'))
              : RefreshIndicator(
                  onRefresh: _fetchEmployees,
                  child: ListView.separated(
                    padding: const EdgeInsets.all(16),
                    itemCount: _employees.length,
                    separatorBuilder: (context, index) => const SizedBox(height: 12),
                    itemBuilder: (context, index) {
                      final employee = _employees[index];
                      return _EmployeeCard(employee: employee);
                    },
                  ),
                ),
    );
  }
}

class _EmployeeCard extends StatelessWidget {
  final Employee employee;

  const _EmployeeCard({required this.employee});

  @override
  Widget build(BuildContext context) {
    return Card(
      elevation: 0,
      shape: RoundedRectangleBorder(
        borderRadius: BorderRadius.circular(12),
        side: BorderSide(color: Colors.grey[300]!),
      ),
      child: ListTile(
        contentPadding: const EdgeInsets.all(12),
        leading: CircleAvatar(
          radius: 28,
          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
          backgroundImage: employee.avatarUrl != null ? NetworkImage(employee.avatarUrl!) : null,
          child: employee.avatarUrl == null
              ? Text(
                  employee.firstName[0] + employee.lastName[0],
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                    fontWeight: FontWeight.bold,
                  ),
                )
              : null,
        ),
        title: Text(
          employee.fullName,
          style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16),
        ),
        subtitle: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(employee.position ?? 'No Position'),
            Text(
              employee.department ?? 'No Department',
              style: TextStyle(color: Colors.grey[600], fontSize: 12),
            ),
          ],
        ),
        trailing: const Icon(Icons.chevron_right),
        onTap: () {
          Navigator.push(
            context,
            MaterialPageRoute(
              builder: (context) => EmployeeDetailScreen(employee: employee),
            ),
          );
        },
      ),
    );
  }
}
