<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('goals', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->string('title');
      $table->text('description')->nullable();
      $table->enum('category', ['career', 'skill', 'project', 'personal', 'team'])->default('career');

      $table->date('target_date');
      $table->integer('progress')->default(0); // 0-100
      $table->enum('status', ['pending', 'in_progress', 'completed', 'on_hold', 'cancelled'])->default('pending');
      $table->enum('priority', ['low', 'medium', 'high'])->default('medium');

      $table->text('milestones')->nullable(); // JSON array of milestones
      $table->text('notes')->nullable();

      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('goals');
  }
};
