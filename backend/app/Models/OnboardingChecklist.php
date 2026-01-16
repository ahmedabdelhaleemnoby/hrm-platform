<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Factories\HasFactory;
use Illuminate\Database\Eloquent\Model;

class OnboardingChecklist extends Model
{
  use HasFactory;

  protected $fillable = [
    'employee_id',
    'template_id',
    'title',
    'start_date',
    'target_completion_date',
    'actual_completion_date',
    'status',
    'progress',
    'assigned_to',
    'notes',
  ];

  protected $casts = [
    'start_date' => 'date',
    'target_completion_date' => 'date',
    'actual_completion_date' => 'date',
  ];

  public function employee()
  {
    return $this->belongsTo(Employee::class);
  }

  public function template()
  {
    return $this->belongsTo(OnboardingTemplate::class);
  }

  public function assignee()
  {
    return $this->belongsTo(User::class, 'assigned_to');
  }

  public function tasks()
  {
    return $this->hasMany(OnboardingTask::class, 'checklist_id');
  }

  public function updateProgress()
  {
    $total = $this->tasks()->where('is_required', true)->count();
    $completed = $this->tasks()->where('is_required', true)->where('status', 'completed')->count();

    $this->progress = $total > 0 ? round(($completed / $total) * 100) : 0;
    $this->status = $this->progress >= 100 ? 'completed' : ($this->progress > 0 ? 'in_progress' : 'not_started');
    $this->save();
  }
}
