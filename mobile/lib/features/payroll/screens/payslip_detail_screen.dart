import 'package:intl/intl.dart';
import 'package:open_filex/open_filex.dart';
import 'package:hrm_mobile/features/payroll/models/payslip.dart';
import 'package:hrm_mobile/features/payroll/services/payroll_service.dart';
import 'package:hrm_mobile/core/localization/app_localizations.dart';

class PayslipDetailScreen extends StatefulWidget {
  final Payslip payslip;

  const PayslipDetailScreen({super.key, required this.payslip});

  @override
  State<PayslipDetailScreen> createState() => _PayslipDetailScreenState();
}

class _PayslipDetailScreenState extends State<PayslipDetailScreen> {
  bool _isDownloading = false;

  Future<void> _downloadPdf() async {
    final t = AppLocalizations.of(context)!;
    final locale = Localizations.localeOf(context).languageCode;
    final filename = "payslip_${widget.payslip.payrollPeriod.name}_${widget.payslip.id}.pdf";

    setState(() => _isDownloading = true);

    ScaffoldMessenger.of(context).showSnackBar(
      SnackBar(content: Text(t.translate('downloading'))),
    );

    final filePath = await payrollService.downloadPayslipPdf(
      widget.payslip.id,
      filename,
      locale,
    );

    setState(() => _isDownloading = false);

    if (filePath != null) {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(t.translate('download_success')), backgroundColor: Colors.green),
      );
      
      // Open the file
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(t.translate('opening_file'))),
      );
      await OpenFilex.open(filePath);
    } else {
      ScaffoldMessenger.of(context).showSnackBar(
        SnackBar(content: Text(t.translate('download_failed')), backgroundColor: Colors.red),
      );
    }
  }

  @override
  Widget build(BuildContext context) {
    final t = AppLocalizations.of(context)!;
    final locale = Localizations.localeOf(context).languageCode;
    final currency = locale == 'ar' ? ' ج.م' : '$';

    return Scaffold(
      backgroundColor: Colors.grey[50],
      appBar: AppBar(
        title: Text(t.translate('employee_details')),
        actions: [
          IconButton(
            icon: _isDownloading 
                ? const SizedBox(width: 24, height: 24, child: CircularProgressIndicator(strokeWidth: 2, color: Colors.white))
                : const Icon(Icons.download_outlined),
            onPressed: _isDownloading ? null : _downloadPdf,
          ),
        ],
      ),
      body: SingleChildScrollView(
        padding: const EdgeInsets.all(20),
        child: Column(
          children: [
            _buildSummaryHeader(t, currency, widget.payslip),
            const SizedBox(height: 24),
            _buildSection(
              t,
              t.translate('earnings'),
              [
                _buildDetailRow(t.translate('basic_salary'), widget.payslip.basicSalary, currency),
                _buildDetailRow(t.translate('allowances'), widget.payslip.allowances, currency),
                _buildDetailRow(t.translate('bonuses'), widget.payslip.bonuses, currency),
                _buildDetailRow(t.translate('overtime'), widget.payslip.overtimePay, currency),
              ],
              const Color(0xFF667EEA),
            ),
            const SizedBox(height: 20),
            _buildSection(
              t,
              t.translate('deductions'),
              [
                _buildDetailRow(t.translate('tax'), widget.payslip.taxDeduction, currency, isDeduction: true),
                _buildDetailRow(t.translate('insurance'), widget.payslip.insuranceDeduction, currency, isDeduction: true),
                _buildDetailRow(t.translate('other'), widget.payslip.otherDeductions, currency, isDeduction: true),
              ],
              Colors.red[400]!,
            ),
            const SizedBox(height: 20),
            _buildAttendanceInfo(t, widget.payslip),
            const SizedBox(height: 40),
          ],
        ),
      ),
    );
  }

  Widget _buildSummaryHeader(AppLocalizations t, String currency, Payslip payslip) {
    return Container(
      width: double.infinity,
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        gradient: const LinearGradient(
          colors: [Color(0xFF667EEA), Color(0xFF764BA2)],
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
        ),
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: const Color(0xFF667EEA).withOpacity(0.3),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            payslip.payrollPeriod.name,
            style: const TextStyle(color: Colors.white70, fontSize: 16),
          ),
          const SizedBox(height: 8),
          Text(
            '${payslip.netSalary.toStringAsFixed(2)}$currency',
            style: const TextStyle(
              color: Colors.white,
              fontSize: 36,
              fontWeight: FontWeight.bold,
            ),
          ),
          const SizedBox(height: 4),
          Text(
            t.translate('net_salary'),
            style: const TextStyle(color: Colors.white70, fontSize: 14, fontWeight: FontWeight.w500),
          ),
          const SizedBox(height: 24),
          Container(
            padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 8),
            decoration: BoxDecoration(
              color: Colors.white.withOpacity(0.2),
              borderRadius: BorderRadius.circular(12),
            ),
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                const Icon(Icons.calendar_month, color: Colors.white, size: 18),
                const SizedBox(width: 8),
                Text(
                  '${DateFormat('MMM d').format(payslip.payrollPeriod.startDate)} - ${DateFormat('MMM d, yyyy').format(payslip.payrollPeriod.endDate)}',
                  style: const TextStyle(color: Colors.white, fontWeight: FontWeight.w500),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildSection(AppLocalizations t, String title, List<Widget> items, Color accentColor) {
    return Container(
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
      ),
      padding: const EdgeInsets.all(20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                width: 4,
                height: 16,
                decoration: BoxDecoration(
                  color: accentColor,
                  borderRadius: BorderRadius.circular(2),
                ),
              ),
              const SizedBox(width: 8),
              Text(
                title,
                style: const TextStyle(fontSize: 16, fontWeight: FontWeight.bold),
              ),
            ],
          ),
          const SizedBox(height: 20),
          ...items,
        ],
      ),
    );
  }

  Widget _buildDetailRow(String label, double amount, String currency, {bool isDeduction = false}) {
    if (amount == 0) return const SizedBox.shrink();
    return Padding(
      padding: const EdgeInsets.only(bottom: 12),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
          Text(
            '${isDeduction ? '-' : '+'}${amount.toStringAsFixed(2)}$currency',
            style: TextStyle(
              fontWeight: FontWeight.w600,
              color: isDeduction ? Colors.red[600] : Colors.green[600],
              fontSize: 15,
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildAttendanceInfo(AppLocalizations t, Payslip payslip) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(20),
        border: Border.all(color: Colors.grey[200]!),
      ),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceAround,
        children: [
          _buildStat(t.translate('days_worked'), payslip.daysWorked.toString()),
          Container(width: 1, height: 30, color: Colors.grey[200]),
          _buildStat(t.translate('status'), payslip.status.toUpperCase()),
        ],
      ),
    );
  }

  Widget _buildStat(String label, String value) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 12)),
        const SizedBox(height: 4),
        Text(value, style: const TextStyle(fontWeight: FontWeight.bold, fontSize: 16)),
      ],
    );
  }
}
