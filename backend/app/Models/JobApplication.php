<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class JobApplication extends Model
{
  use HasFactory;

  protected $fillable = [
    'job_posting_id',
    'candidate_id',
    'stage',
    'status',
    'cover_letter',
    'expected_salary',
    'available_from',
    'rating',
    'evaluation_notes',
    'evaluated_by',
    'applied_date',
    'last_activity_date',
  ];

  protected $casts = [
    'applied_date' => 'date',
    'available_from' => 'date',
    'last_activity_date' => 'date',
    'expected_salary' => 'decimal:2',
  ];

  public function jobPosting()
  {
    return $this->belongsTo(JobPosting::class);
  }

  public function candidate()
  {
    return $this->belongsTo(Candidate::class);
  }

  public function evaluator()
  {
    return $this->belongsTo(User::class, 'evaluated_by');
  }
}
