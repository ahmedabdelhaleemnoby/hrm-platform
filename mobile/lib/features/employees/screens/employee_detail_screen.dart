import 'package:flutter/material.dart';
import 'package:hrm_mobile/features/employees/models/employee.dart';
import 'package:hrm_mobile/core/localization/app_localizations.dart';

class EmployeeDetailScreen extends StatelessWidget {
  final Employee employee;

  const EmployeeDetailScreen({super.key, required this.employee});

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.translate('employee_details')),
      ),
      body: SingleChildScrollView(
        child: Column(
          children: [
            const SizedBox(height: 24),
            _buildProfileHeader(context),
            const SizedBox(height: 24),
            _buildInfoSection(context),
          ],
        ),
      ),
    );
  }

  Widget _buildProfileHeader(BuildContext context) {
    return Column(
      children: [
        CircleAvatar(
          radius: 50,
          backgroundColor: Theme.of(context).colorScheme.primary.withOpacity(0.1),
          backgroundImage: employee.avatarUrl != null ? NetworkImage(employee.avatarUrl!) : null,
          child: employee.avatarUrl == null
              ? Text(
                  employee.firstName[0] + employee.lastName[0],
                  style: TextStyle(
                    color: Theme.of(context).colorScheme.primary,
                    fontSize: 32,
                    fontWeight: FontWeight.bold,
                  ),
                )
              : null,
        ),
        const SizedBox(height: 16),
        Text(
          employee.fullName,
          style: const TextStyle(fontSize: 24, fontWeight: FontWeight.bold),
        ),
        Text(
          employee.position ?? 'No Position',
          style: TextStyle(fontSize: 16, color: Colors.grey[600]),
        ),
        const SizedBox(height: 12),
        Container(
          padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
          decoration: BoxDecoration(
            color: _getStatusColor(employee.employmentStatus).withOpacity(0.1),
            borderRadius: BorderRadius.circular(20),
          ),
          child: Text(
            employee.employmentStatus.toUpperCase(),
            style: TextStyle(
              color: _getStatusColor(employee.employmentStatus),
              fontWeight: FontWeight.bold,
              fontSize: 12,
            ),
          ),
        ),
      ],
    );
  }

  Widget _buildInfoSection(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            AppLocalizations.of(context)!.translate('contact_info').toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoTile(Icons.email_outlined, AppLocalizations.of(context)!.translate('email'), employee.email),
          _buildInfoTile(Icons.phone_outlined, AppLocalizations.of(context)!.translate('phone'), employee.phone ?? 'Not provided'),
          const SizedBox(height: 32),
          Text(
            AppLocalizations.of(context)!.translate('employment_info').toUpperCase(),
            style: const TextStyle(
              fontSize: 12,
              fontWeight: FontWeight.bold,
              color: Colors.grey,
              letterSpacing: 1.2,
            ),
          ),
          const SizedBox(height: 16),
          _buildInfoTile(Icons.work_outline, AppLocalizations.of(context)!.translate('department'), employee.department ?? 'Not assigned'),
          _buildInfoTile(Icons.badge_outlined, 'Employee ID', employee.employeeCode),
          _buildInfoTile(Icons.category_outlined, 'Type', employee.employmentType.replaceAll('_', ' ')),
          const SizedBox(height: 40),
        ],
      ),
    );
  }

  Widget _buildInfoTile(IconData icon, String label, String value) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 20),
      child: Row(
        children: [
          Icon(icon, color: Colors.grey[600], size: 24),
          const SizedBox(width: 16),
          Expanded(
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  label,
                  style: TextStyle(color: Colors.grey[600], fontSize: 13),
                ),
                Text(
                  value,
                  style: const TextStyle(fontSize: 16, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Color _getStatusColor(String status) {
    switch (status.toLowerCase()) {
      case 'active':
        return Colors.green;
      case 'on_leave':
        return Colors.orange;
      case 'terminated':
        return Colors.red;
      default:
        return Colors.grey;
    }
  }
}
