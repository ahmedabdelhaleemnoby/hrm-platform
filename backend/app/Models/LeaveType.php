<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class LeaveType extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'code',
    'description',
    'is_paid',
    'max_days_per_year',
    'color',
    'active',
  ];

  protected $casts = [
    'is_paid' => 'boolean',
    'active' => 'boolean',
  ];

  public function leaveRequests()
  {
    return $this->hasMany(LeaveRequest::class);
  }
}
