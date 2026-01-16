class PayrollPeriod {
  final int id;
  final String name;
  final DateTime startDate;
  final DateTime endDate;

  PayrollPeriod({
    required this.id,
    required this.name,
    required this.startDate,
    required this.endDate,
  });

  factory PayrollPeriod.fromJson(Map<String, dynamic> json) {
    return PayrollPeriod(
      id: json['id'],
      name: json['name'],
      startDate: DateTime.parse(json['start_date']),
      endDate: DateTime.parse(json['end_date']),
    );
  }
}

class Payslip {
  final int id;
  final double basicSalary;
  final double allowances;
  final double bonuses;
  final double overtimePay;
  final double grossSalary;
  final double taxDeduction;
  final double insuranceDeduction;
  final double otherDeductions;
  final double totalDeductions;
  final double netSalary;
  final int daysWorked;
  final int daysAbsent;
  final String status;
  final PayrollPeriod payrollPeriod;

  Payslip({
    required this.id,
    required this.basicSalary,
    required this.allowances,
    required this.bonuses,
    required this.overtimePay,
    required this.grossSalary,
    required this.taxDeduction,
    required this.insuranceDeduction,
    required this.otherDeductions,
    required this.totalDeductions,
    required this.netSalary,
    required this.daysWorked,
    required this.daysAbsent,
    required this.status,
    required this.payrollPeriod,
  });

  factory Payslip.fromJson(Map<String, dynamic> json) {
    return Payslip(
      id: json['id'],
      basicSalary: (json['basic_salary'] ?? 0).toDouble(),
      allowances: (json['allowances'] ?? 0).toDouble(),
      bonuses: (json['bonuses'] ?? 0).toDouble(),
      overtimePay: (json['overtime_pay'] ?? 0).toDouble(),
      grossSalary: (json['gross_salary'] ?? 0).toDouble(),
      taxDeduction: (json['tax_deduction'] ?? 0).toDouble(),
      insuranceDeduction: (json['insurance_deduction'] ?? 0).toDouble(),
      otherDeductions: (json['other_deductions'] ?? 0).toDouble(),
      totalDeductions: (json['total_deductions'] ?? 0).toDouble(),
      netSalary: (json['net_salary'] ?? 0).toDouble(),
      daysWorked: json['days_worked'] ?? 0,
      daysAbsent: json['days_absent'] ?? 0,
      status: json['status'] ?? 'draft',
      payrollPeriod: PayrollPeriod.fromJson(json['payroll_period']),
    );
  }
}
