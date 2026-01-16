<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingTask extends Model
{
  use HasFactory;

  protected $fillable = [
    'checklist_id',
    'title',
    'description',
    'category',
    'order',
    'day_due',
    'is_required',
    'status',
    'assigned_to',
    'completed_at',
    'completed_by',
    'notes',
  ];

  protected $casts = [
    'is_required' => 'boolean',
    'completed_at' => 'datetime',
  ];

  public function checklist()
  {
    return $this->belongsTo(OnboardingChecklist::class);
  }

  public function assignee()
  {
    return $this->belongsTo(User::class, 'assigned_to');
  }

  public function completedByUser()
  {
    return $this->belongsTo(User::class, 'completed_by');
  }
}
