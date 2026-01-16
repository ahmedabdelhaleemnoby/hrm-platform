<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('onboarding_tasks', function (Blueprint $table) {
      $table->id();
      $table->foreignId('checklist_id')->constrained('onboarding_checklists')->onDelete('cascade');
      $table->string('title');
      $table->text('description')->nullable();
      $table->enum('category', ['documentation', 'training', 'it_setup', 'orientation', 'compliance', 'other'])->default('other');
      $table->integer('order')->default(0);
      $table->integer('day_due')->default(1); // Day number from start
      $table->boolean('is_required')->default(true);
      $table->enum('status', ['pending', 'in_progress', 'completed', 'skipped'])->default('pending');
      $table->foreignId('assigned_to')->nullable()->constrained('users')->onDelete('set null');
      $table->timestamp('completed_at')->nullable();
      $table->foreignId('completed_by')->nullable()->constrained('users')->onDelete('set null');
      $table->text('notes')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('onboarding_tasks');
  }
};
