<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class SalaryStructure extends Model
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
    'basic_salary',
    'housing_allowance',
    'transport_allowance',
    'other_allowances',
    'tax_rate',
    'social_insurance',
    'currency',
    'effective_from',
    'effective_to',
    'active',
  ];

  protected $casts = [
    'effective_from' => 'date',
    'effective_to' => 'date',
    'basic_salary' => 'decimal:2',
    'housing_allowance' => 'decimal:2',
    'transport_allowance' => 'decimal:2',
    'other_allowances' => 'decimal:2',
    'tax_rate' => 'decimal:2',
    'social_insurance' => 'decimal:2',
    'active' => 'boolean',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function getTotalAllowancesAttribute()
  {
    return $this->housing_allowance + $this->transport_allowance + $this->other_allowances;
  }
}
