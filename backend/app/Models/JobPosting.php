<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobPosting extends Model
{
  use HasFactory;

  protected $fillable = [
    'title',
    'description',
    'requirements',
    'responsibilities',
    'department',
    'location',
    'employment_type',
    'experience_level',
    'salary_min',
    'salary_max',
    'currency',
    'status',
    'positions_available',
    'posted_date',
    'closing_date',
    'created_by',
  ];

  protected $casts = [
    'posted_date' => 'date',
    'closing_date' => 'date',
    'salary_min' => 'decimal:2',
    'salary_max' => 'decimal:2',
  ];

  public function creator()
  {
    return $this->belongsTo(User::class, 'created_by');
  }

  public function applications()
  {
    return $this->hasMany(JobApplication::class);
  }

  public function getApplicationsCountAttribute()
  {
    return $this->applications()->count();
  }
}
