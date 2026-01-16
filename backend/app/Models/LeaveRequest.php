<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;
use Spatie\Activitylog\LogOptions;
use Spatie\Activitylog\Traits\LogsActivity;

class LeaveRequest extends Model
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
    'leave_type_id',
    'start_date',
    'end_date',
    'total_days',
    'reason',
    'status',
    'approved_by',
    'approved_at',
    'rejection_reason',
  ];

  protected $casts = [
    'start_date' => 'date',
    'end_date' => 'date',
    'approved_at' => 'datetime',
    'total_days' => 'decimal:2',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function leaveType()
  {
    return $this->belongsTo(LeaveType::class);
  }

  public function approver()
  {
    return $this->belongsTo(User::class, 'approved_by');
  }
}
