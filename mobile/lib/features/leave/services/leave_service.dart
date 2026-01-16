import 'package:hrm_mobile/core/api/api_client.dart';
import 'package:hrm_mobile/features/leave/models/leave_request.dart';

class LeaveService {
  Future<List<LeaveRequest>> getLeaveHistory() async {
    try {
      final response = await apiClient.get('/leaves');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final List<dynamic> data = response.data['data'];
        return data.map((e) => LeaveRequest.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching leave history: $e');
      return [];
    }
  }

  Future<bool> submitLeaveRequest({
    required String leaveType,
    required DateTime startDate,
    required DateTime endDate,
    required String reason,
  }) async {
    try {
      final response = await apiClient.post('/leaves', data: {
        'leave_type': leaveType,
        'start_date': startDate.toIso8601String().split('T')[0],
        'end_date': endDate.toIso8601String().split('T')[0],
        'reason': reason,
      });
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('Error submitting leave request: $e');
      return false;
    }
  }

  Future<Map<String, dynamic>> getLeaveTypes() async {
    try {
      final response = await apiClient.get('/leave-types');
      if (response.statusCode == 200 && response.data['success'] == true) {
        return response.data['data'];
      }
      return {};
    } catch (e) {
      print('Error fetching leave types: $e');
      return {};
    }
  }
}

final leaveService = LeaveService();
