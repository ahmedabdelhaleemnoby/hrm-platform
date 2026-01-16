<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class PerformanceReview extends Model
{
  use HasFactory;

  protected $fillable = [
    'employee_id',
    'reviewer_id',
    'review_period',
    'type',
    'status',
    'overall_rating',
    'quality_rating',
    'productivity_rating',
    'communication_rating',
    'teamwork_rating',
    'initiative_rating',
    'strengths',
    'areas_for_improvement',
    'reviewer_comments',
    'employee_comments',
    'review_date',
    'next_review_date',
  ];

  protected $casts = [
    'review_date' => 'date',
    'next_review_date' => 'date',
    'overall_rating' => 'decimal:2',
    'quality_rating' => 'decimal:2',
    'productivity_rating' => 'decimal:2',
    'communication_rating' => 'decimal:2',
    'teamwork_rating' => 'decimal:2',
    'initiative_rating' => 'decimal:2',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function reviewer()
  {
    return $this->belongsTo(User::class, 'reviewer_id');
  }
}
