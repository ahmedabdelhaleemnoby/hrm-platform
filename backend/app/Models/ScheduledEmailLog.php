<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ScheduledEmailLog extends Model
{
  protected $fillable = [
    'type',
    'recipients_count',
    'absent_count',
    'expiring_contracts_count',
    'birthdays_count',
    'probation_endings_count',
    'status',
    'error_message',
    'executed_at',
  ];

  protected $casts = [
    'executed_at' => 'datetime',
  ];
}
