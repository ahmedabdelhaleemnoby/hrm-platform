import 'package:flutter/material.dart';
import 'package:geolocator/geolocator.dart';
import 'package:intl/intl.dart';
import 'package:hrm_mobile/features/attendance/models/attendance.dart';
import 'package:hrm_mobile/features/attendance/services/attendance_service.dart';
import 'package:hrm_mobile/core/localization/app_localizations.dart';

class AttendanceScreen extends StatefulWidget {
  const AttendanceScreen({super.key});

  @override
  State<AttendanceScreen> createState() => _AttendanceScreenState();
}

class _AttendanceScreenState extends State<AttendanceScreen> {
  Attendance? _todayStatus;
  bool _isLoading = true;
  bool _isClocking = false;
  String _currentTime = '';

  @override
  void initState() {
    super.initState();
    _fetchStatus();
    _updateTime();
  }

  void _updateTime() {
    setState(() {
      _currentTime = DateFormat('hh:mm:ss a').format(DateTime.now());
    });
    Future.delayed(const Duration(seconds: 1), _updateTime);
  }

  Future<void> _fetchStatus() async {
    setState(() => _isLoading = true);
    final status = await attendanceService.getTodayStatus();
    setState(() {
      _todayStatus = status;
      _isLoading = false;
    });
  }

  Future<Position?> _determinePosition() async {
    bool serviceEnabled;
    LocationPermission permission;

    serviceEnabled = await Geolocator.isLocationServiceEnabled();
    if (!serviceEnabled) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Location services are disabled.')),
        );
      }
      return null;
    }

    permission = await Geolocator.checkPermission();
    if (permission == LocationPermission.denied) {
      permission = await Geolocator.requestPermission();
      if (permission == LocationPermission.denied) {
        if (mounted) {
          ScaffoldMessenger.of(context).showSnackBar(
            const SnackBar(content: Text('Location permissions are denied.')),
          );
        }
        return null;
      }
    }

    if (permission == LocationPermission.deniedForever) {
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          const SnackBar(content: Text('Location permissions are permanently denied.')),
        );
      }
      return null;
    }

    return await Geolocator.getCurrentPosition();
  }

  Future<void> _handleClockInOut() async {
    setState(() => _isClocking = true);
    
    final position = await _determinePosition();
    if (position == null) {
      setState(() => _isClocking = false);
      return;
    }

    bool success = false;
    if (_todayStatus?.clockIn == null) {
      success = await attendanceService.clockIn(position.latitude, position.longitude);
    } else {
      success = await attendanceService.clockOut(position.latitude, position.longitude);
    }

    if (success) {
      await _fetchStatus();
      if (mounted) {
        ScaffoldMessenger.of(context).showSnackBar(
          SnackBar(
            content: Text(_todayStatus?.clockOut == null 
                ? AppLocalizations.of(context)!.translate('clocked_in_successfully') 
                : AppLocalizations.of(context)!.translate('clocked_out_successfully')),
            backgroundColor: Colors.green,
          ),
        );
      }
    } else if (mounted) {
      ScaffoldMessenger.of(context).showSnackBar(
        const SnackBar(content: Text('Action failed. Please try again.')),
      );
    }
    
    setState(() => _isClocking = false);
  }

  @override
  Widget build(BuildContext context) {
    final bool isClockedIn = _todayStatus?.clockIn != null && _todayStatus?.clockOut == null;
    final bool isFinished = _todayStatus?.clockIn != null && _todayStatus?.clockOut != null;

    return Scaffold(
      appBar: AppBar(
        title: Text(AppLocalizations.of(context)!.translate('attendance')),
      ),
      body: _isLoading
          ? const Center(child: CircularProgressIndicator())
          : SingleChildScrollView(
              padding: const EdgeInsets.all(24.0),
              child: Column(
                children: [
                  _buildStatusCard(isClockedIn, isFinished),
                  const SizedBox(height: 48),
                  _buildClockButton(isClockedIn, isFinished),
                  const SizedBox(height: 48),
                  _buildHistorySection(),
                ],
              ),
            ),
    );
  }

  Widget _buildStatusCard(bool isClockedIn, bool isFinished) {
    return Container(
      padding: const EdgeInsets.all(24),
      decoration: BoxDecoration(
        color: Colors.white,
        borderRadius: BorderRadius.circular(24),
        boxShadow: [
          BoxShadow(
            color: Colors.black.withOpacity(0.05),
            blurRadius: 20,
            offset: const Offset(0, 10),
          ),
        ],
      ),
      child: Column(
        children: [
          Text(
            DateFormat('EEEE, d MMMM yyyy').format(DateTime.now()),
            style: TextStyle(color: Colors.grey[600], fontSize: 16),
          ),
          const SizedBox(height: 8),
          Text(
            _currentTime,
            style: const TextStyle(fontSize: 32, fontWeight: FontWeight.bold, color: Color(0xFF1A237E)),
          ),
          const SizedBox(height: 24),
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: [
              _buildTimeInfo(AppLocalizations.of(context)!.translate('clock_in'), _todayStatus?.clockIn ?? '--:--'),
              _buildTimeInfo(AppLocalizations.of(context)!.translate('clock_out'), _todayStatus?.clockOut ?? '--:--'),
            ],
          ),
        ],
      ),
    );
  }

  Widget _buildTimeInfo(String label, String time) {
    return Column(
      children: [
        Text(label, style: TextStyle(color: Colors.grey[600], fontSize: 14)),
        const SizedBox(height: 4),
        Text(time, style: const TextStyle(fontSize: 18, fontWeight: FontWeight.bold)),
      ],
    );
  }

  Widget _buildClockButton(bool isClockedIn, bool isFinished) {
    if (isFinished) {
      return Container(
        padding: const EdgeInsets.symmetric(horizontal: 24, vertical: 12),
        decoration: BoxDecoration(
          color: Colors.green.withOpacity(0.1),
          borderRadius: BorderRadius.circular(12),
        ),
        child: Text(
          AppLocalizations.of(context)!.translate('day_completed'),
          style: const TextStyle(color: Colors.green, fontWeight: FontWeight.bold),
        ),
      );
    }

    return GestureDetector(
      onTap: _isClocking ? null : _handleClockInOut,
      child: Container(
        width: 200,
        height: 200,
        decoration: BoxDecoration(
          shape: BoxShape.circle,
          color: isClockedIn ? Colors.red.withOpacity(0.1) : const Color(0xFF667EEA).withOpacity(0.1),
          border: Border.all(
            color: isClockedIn ? Colors.red : const Color(0xFF667EEA),
            width: 4,
          ),
        ),
        child: Center(
          child: _isClocking
              ? const CircularProgressIndicator()
              : Column(
                  mainAxisAlignment: MainAxisAlignment.center,
                  children: [
                    Icon(
                      Icons.fingerprint,
                      size: 64,
                      color: isClockedIn ? Colors.red : const Color(0xFF667EEA),
                    ),
                    const SizedBox(height: 8),
                    Text(
                      isClockedIn 
                          ? AppLocalizations.of(context)!.translate('clock_out') 
                          : AppLocalizations.of(context)!.translate('clock_in'),
                      style: TextStyle(
                        fontSize: 18,
                        fontWeight: FontWeight.bold,
                        color: isClockedIn ? Colors.red : const Color(0xFF667EEA),
                      ),
                    ),
                  ],
                ),
        ),
      ),
    );
  }

  Widget _buildHistorySection() {
    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        const Text(
          'YOUR LOCATION INFO',
          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.grey, letterSpacing: 1.2),
        ),
        const SizedBox(height: 16),
        ListTile(
          leading: const Icon(Icons.location_on, color: Color(0xFF667EEA)),
          title: const Text('Live Tracking Enabled'),
          subtitle: Text(
            _todayStatus?.latitudeIn != null 
                ? 'Last captured at ${_todayStatus?.latitudeIn}, ${_todayStatus?.longitudeIn}'
                : 'Your location will be captured on clock-in',
            style: const TextStyle(fontSize: 12),
          ),
          trailing: const Icon(Icons.check_circle, color: Colors.green, size: 20),
        ),
      ],
    );
  }
}
