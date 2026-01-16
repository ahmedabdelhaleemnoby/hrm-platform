<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingTemplate extends Model
{
  use HasFactory;

  protected $fillable = [
    'name',
    'description',
    'department',
    'position',
    'duration_days',
    'active',
  ];

  protected $casts = [
    'active' => 'boolean',
  ];

  public function checklists()
  {
    return $this->hasMany(OnboardingChecklist::class, 'template_id');
  }
}
