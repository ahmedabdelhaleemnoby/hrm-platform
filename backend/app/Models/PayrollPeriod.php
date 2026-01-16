<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PayrollPeriod extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'start_date',
    'end_date',
    'status',
    'working_days',
    'total_gross',
    'total_deductions',
    'total_net',
    'approved_by',
    'approved_at',
  ];

  protected $casts = [
    'start_date' => 'date',
    'end_date' => 'date',
    'approved_at' => 'datetime',
    'total_gross' => 'decimal:2',
    'total_deductions' => 'decimal:2',
    'total_net' => 'decimal:2',
  ];

  public function payrollRecords()
  {
    return $this->hasMany(PayrollRecord::class);
  }

  public function approver()
  {
    return $this->belongsTo(User::class, 'approved_by');
  }
}
