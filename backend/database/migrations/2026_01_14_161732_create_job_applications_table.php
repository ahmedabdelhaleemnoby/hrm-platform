<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('job_applications', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_posting_id')->constrained()->onDelete('cascade');
      $table->foreignId('candidate_id')->constrained()->onDelete('cascade');

      // Application Pipeline Stages
      $table->enum('stage', [
        'applied',
        'screening',
        'phone_interview',
        'technical_interview',
        'onsite_interview',
        'offer',
        'hired',
        'rejected',
        'withdrawn'
      ])->default('applied');

      $table->enum('status', ['active', 'on_hold', 'closed'])->default('active');
      $table->text('cover_letter')->nullable();
      $table->decimal('expected_salary', 12, 2)->nullable();
      $table->date('available_from')->nullable();

      // Evaluation
      $table->integer('rating')->nullable(); // 1-5 stars
      $table->text('evaluation_notes')->nullable();
      $table->foreignId('evaluated_by')->nullable()->constrained('users')->onDelete('set null');

      $table->date('applied_date');
      $table->date('last_activity_date')->nullable();

      $table->timestamps();

      $table->unique(['job_posting_id', 'candidate_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('job_applications');
  }
};
