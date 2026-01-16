class Employee {
  final int id;
  final String employeeCode;
  final String firstName;
  final String lastName;
  final String fullName;
  final String email;
  final String? phone;
  final String? department;
  final String? position;
  final String employmentStatus;
  final String employmentType;
  final String? avatarUrl;

  Employee({
    required this.id,
    required this.employeeCode,
    required this.firstName,
    required this.lastName,
    required this.fullName,
    required this.email,
    this.phone,
    this.department,
    this.position,
    required this.employmentStatus,
    required this.employmentType,
    this.avatarUrl,
  });

  factory Employee.fromJson(Map<String, dynamic> json) {
    return Employee(
      id: json['id'],
      employeeCode: json['employee_code'] ?? '',
      firstName: json['first_name'] ?? '',
      lastName: json['last_name'] ?? '',
      fullName: json['full_name'] ?? '',
      email: json['email'] ?? '',
      phone: json['phone'],
      department: json['department'],
      position: json['position'],
      employmentStatus: json['employment_status'] ?? 'active',
      employmentType: json['employment_type'] ?? 'full_time',
      avatarUrl: json['avatar_url'],
    );
  }

  Map<String, dynamic> toJson() {
    return {
      'id': id,
      'employee_code': employeeCode,
      'first_name': firstName,
      'last_name': lastName,
      'full_name': fullName,
      'email': email,
      'phone': phone,
      'department': department,
      'position': position,
      'employment_status': employmentStatus,
      'employment_type': employmentType,
      'avatar_url': avatarUrl,
    };
  }
}
