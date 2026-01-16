<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('onboarding_checklists', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->foreignId('template_id')->nullable()->constrained('onboarding_templates')->onDelete('set null');
      $table->string('title');
      $table->date('start_date');
      $table->date('target_completion_date');
      $table->date('actual_completion_date')->nullable();
      $table->enum('status', ['not_started', 'in_progress', 'completed', 'overdue'])->default('not_started');
      $table->integer('progress')->default(0); // 0-100%
      $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
      $table->text('notes')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('onboarding_checklists');
  }
};
