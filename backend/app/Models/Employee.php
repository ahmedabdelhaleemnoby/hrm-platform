<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class Employee extends Model
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
    'employee_code',
    'first_name',
    'last_name',
    'email',
    'phone',
    'date_of_birth',
    'gender',
    'department',
    'position',
    'employment_status',
    'employment_type',
    'hire_date',
    'salary',
    'address',
    'avatar_url',
    'contract_end_date',
    'probation_end_date',
    'manager_id',
  ];

  protected $casts = [
    'date_of_birth' => 'date',
    'hire_date' => 'date',
    'salary' => 'decimal:2',
    'contract_end_date' => 'date',
    'probation_end_date' => 'date',
  ];

  protected $appends = ['full_name'];

  public function getFullNameAttribute()
  {
    return "{$this->first_name} {$this->last_name}";
  }

  public function documents()
  {
    return $this->hasMany(EmployeeDocument::class);
  }

  public function attendances()
  {
    return $this->hasMany(Attendance::class);
  }

  public function manager()
  {
    return $this->belongsTo(Employee::class, 'manager_id');
  }

  public function directReports()
  {
    return $this->hasMany(Employee::class, 'manager_id');
  }

  public function user()
  {
    return $this->hasOne(User::class);
  }
}
