<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Attendance extends Model
{
  use HasFactory;

  protected $fillable = [
    'employee_id',
    'record_date',
    'clock_in_time',
    'clock_out_time',
    'clock_in_ip',
    'clock_out_ip',
    'shift_id',
    'status',
    'total_hours',
    'overtime_hours',
    'late_minutes',
    'notes',
  ];

  protected $casts = [
    'record_date' => 'date',
    'clock_in_time' => 'datetime',
    'clock_out_time' => 'datetime',
    'total_hours' => 'decimal:2',
    'overtime_hours' => 'decimal:2',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function shift()
  {
    return $this->belongsTo(Shift::class);
  }
}
