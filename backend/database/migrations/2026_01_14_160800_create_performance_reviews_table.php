<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('performance_reviews', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->foreignId('reviewer_id')->constrained('users')->onDelete('cascade');
      $table->string('review_period'); // e.g., "Q1 2026", "Annual 2025"
      $table->enum('type', ['quarterly', 'annual', 'probation', 'project'])->default('quarterly');
      $table->enum('status', ['draft', 'submitted', 'in_review', 'completed', 'acknowledged'])->default('draft');

      // Ratings (1-5 scale)
      $table->decimal('overall_rating', 3, 2)->nullable();
      $table->decimal('quality_rating', 3, 2)->nullable();
      $table->decimal('productivity_rating', 3, 2)->nullable();
      $table->decimal('communication_rating', 3, 2)->nullable();
      $table->decimal('teamwork_rating', 3, 2)->nullable();
      $table->decimal('initiative_rating', 3, 2)->nullable();

      $table->text('strengths')->nullable();
      $table->text('areas_for_improvement')->nullable();
      $table->text('reviewer_comments')->nullable();
      $table->text('employee_comments')->nullable();

      $table->date('review_date')->nullable();
      $table->date('next_review_date')->nullable();

      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('performance_reviews');
  }
};
