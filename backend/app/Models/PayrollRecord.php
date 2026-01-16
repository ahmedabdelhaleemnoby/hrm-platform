<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class PayrollRecord extends Model
{
  use HasFactory, LogsActivity;

  public function getActivitylogOptions(): LogOptions
  {
    return LogOptions::defaults()
      ->logFillable()
      ->logOnlyDirty()
      ->dontSubmitEmptyLogs();
  }

  protected $fillable = [
    'employee_id',
    'payroll_period_id',
    'basic_salary',
    'allowances',
    'bonuses',
    'overtime_pay',
    'gross_salary',
    'tax_deduction',
    'insurance_deduction',
    'other_deductions',
    'total_deductions',
    'net_salary',
    'days_worked',
    'days_absent',
    'overtime_hours',
    'status',
    'notes',
  ];

  protected $casts = [
    'basic_salary' => 'decimal:2',
    'allowances' => 'decimal:2',
    'bonuses' => 'decimal:2',
    'overtime_pay' => 'decimal:2',
    'gross_salary' => 'decimal:2',
    'tax_deduction' => 'decimal:2',
    'insurance_deduction' => 'decimal:2',
    'other_deductions' => 'decimal:2',
    'total_deductions' => 'decimal:2',
    'net_salary' => 'decimal:2',
    'overtime_hours' => 'decimal:2',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function payrollPeriod()
  {
    return $this->belongsTo(PayrollPeriod::class);
  }
}
