import 'package:hrm_mobile/core/api/api_client.dart';
import 'package:hrm_mobile/features/attendance/models/attendance.dart';

class AttendanceService {
  Future<Attendance?> getTodayStatus() async {
    try {
      final response = await apiClient.get('/attendance/status');
      if (response.statusCode == 200 && response.data['success'] == true) {
        if (response.data['data'] != null) {
          return Attendance.fromJson(response.data['data']);
        }
      }
      return null;
    } catch (e) {
      print('Error fetching attendance status: $e');
      return null;
    }
  }

  Future<bool> clockIn(double lat, double lng) async {
    try {
      final response = await apiClient.post('/attendance/clock-in', data: {
        'latitude': lat,
        'longitude': lng,
      });
      return response.statusCode == 200 || response.statusCode == 201;
    } catch (e) {
      print('Clock-in error: $e');
      return false;
    }
  }

  Future<bool> clockOut(double lat, double lng) async {
    try {
      final response = await apiClient.post('/attendance/clock-out', data: {
        'latitude': lat,
        'longitude': lng,
      });
      return response.statusCode == 200;
    } catch (e) {
      print('Clock-out error: $e');
      return false;
    }
  }

  Future<List<Attendance>> getAttendanceHistory() async {
    try {
      final response = await apiClient.get('/attendance/history');
      if (response.statusCode == 200 && response.data['success'] == true) {
        final List<dynamic> data = response.data['data'];
        return data.map((e) => Attendance.fromJson(e)).toList();
      }
      return [];
    } catch (e) {
      print('Error fetching attendance history: $e');
      return [];
    }
  }
}

final attendanceService = AttendanceService();
