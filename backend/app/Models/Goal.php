<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Goal extends Model
{
  use HasFactory;

  protected $fillable = [
    'employee_id',
    'title',
    'description',
    'category',
    'target_date',
    'progress',
    'status',
    'priority',
    'milestones',
    'notes',
  ];

  protected $casts = [
    'target_date' => 'date',
    'milestones' => 'array',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }
}
