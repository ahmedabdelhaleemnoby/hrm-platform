<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Candidate extends Model
{
  use HasFactory;

  protected $fillable = [
    'first_name',
    'last_name',
    'email',
    'phone',
    'linkedin_url',
    'portfolio_url',
    'resume_path',
    'current_company',
    'current_position',
    'years_of_experience',
    'skills',
    'notes',
    'source',
  ];

  protected $casts = [
    'skills' => 'array',
  ];

  protected $appends = ['full_name'];

  public function getFullNameAttribute()
  {
    return $this->first_name . ' ' . $this->last_name;
  }

  public function applications()
  {
    return $this->hasMany(JobApplication::class);
  }
}
