class Attendance {
  final int? id;
  final int employeeId;
  final DateTime date;
  final String? clockIn;
  final String? clockOut;
  final double? latitudeIn;
  final double? longitudeIn;
  final double? latitudeOut;
  final double? longitudeOut;
  final String status;

  Attendance({
    this.id,
    required this.employeeId,
    required this.date,
    this.clockIn,
    this.clockOut,
    this.latitudeIn,
    this.longitudeIn,
    this.latitudeOut,
    this.longitudeOut,
    required this.status,
  });

  factory Attendance.fromJson(Map<String, dynamic> json) {
    return Attendance(
      id: json['id'],
      employeeId: json['employee_id'],
      date: DateTime.parse(json['date']),
      clockIn: json['clock_in'],
      clockOut: json['clock_out'],
      latitudeIn: json['latitude_in']?.toDouble(),
      longitudeIn: json['longitude_in']?.toDouble(),
      latitudeOut: json['latitude_out']?.toDouble(),
      longitudeOut: json['longitude_out']?.toDouble(),
      status: json['status'] ?? 'absent',
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_id': employeeId,
      'date': date.toIso8601String().split('T')[0],
      'clock_in': clockIn,
      'clock_out': clockOut,
      'latitude_in': latitudeIn,
      'longitude_in': longitudeIn,
      'latitude_out': latitudeOut,
      'longitude_out': longitudeOut,
      'status': status,
    };
  }
}
