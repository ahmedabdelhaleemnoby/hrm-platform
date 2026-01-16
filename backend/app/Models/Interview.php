<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class Interview extends Model
{
  use HasFactory;

  protected $fillable = [
    'job_application_id',
    'interviewer_id',
    'title',
    'start_time',
    'end_time',
    'location',
    'notes',
    'status',
  ];

  protected $casts = [
    'start_time' => 'datetime',
    'end_time' => 'datetime',
  ];

  public function jobApplication()
  {
    return $this->belongsTo(JobApplication::class);
  }

  public function interviewer()
  {
    return $this->belongsTo(User::class, 'interviewer_id');
  }
}
