import 'dart:io';
import 'package:path_provider/path_provider.dart';
import 'package:hrm_mobile/core/api/api_client.dart';
import 'package:hrm_mobile/features/payroll/models/payslip.dart';

class PayrollService {
  Future<List<Payslip>> getMyPayslips() async {
    try {
      final response = await apiClient.get('/payroll/my-payslips');
      if (response.statusCode == 200) {
        final List<dynamic> data = response.data['data'];
        return data.map((json) => Payslip.fromJson(json)).toList();
      }
      return [];
    }
  }

  Future<String?> downloadPayslipPdf(int id, String filename, String locale) async {
    try {
      final directory = await getTemporaryDirectory();
      final savePath = '${directory.path}/$filename';
      
      final response = await apiClient.download(
        '/payroll/records/$id/pdf',
        savePath,
        queryParameters: {'locale': locale},
      );

      if (response.statusCode == 200) {
        return savePath;
      }
      return null;
    } catch (e) {
      print('Error downloading payslip: $e');
      return null;
    }
  }
}

final payrollService = PayrollService();
