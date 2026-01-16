<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Okr extends Model
{
  use HasFactory;

  protected $fillable = [
    'employee_id',
    'title',
    'description',
    'type',
    'parent_id',
    'period',
    'start_date',
    'end_date',
    'target_value',
    'current_value',
    'progress',
    'status',
    'priority',
  ];

  protected $casts = [
    'start_date' => 'date',
    'end_date' => 'date',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function parent()
  {
    return $this->belongsTo(Okr::class, 'parent_id');
  }

  public function keyResults()
  {
    return $this->hasMany(Okr::class, 'parent_id')->where('type', 'key_result');
  }
}
