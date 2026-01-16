<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Shift extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'start_time',
    'end_time',
    'grace_period_minutes',
    'min_hours',
    'is_overnight',
    'color',
    'active',
  ];

  protected $casts = [
    'is_overnight' => 'boolean',
    'active' => 'boolean',
    'min_hours' => 'decimal:1',
  ];

  public function attendances()
  {
    return $this->hasMany(Attendance::class);
  }
}
