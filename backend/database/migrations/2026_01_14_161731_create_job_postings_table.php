<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('job_postings', function (Blueprint $table) {
      $table->id();
      $table->string('title');
      $table->text('description');
      $table->text('requirements')->nullable();
      $table->text('responsibilities')->nullable();
      $table->string('department')->nullable();
      $table->string('location');
      $table->enum('employment_type', ['full_time', 'part_time', 'contract', 'internship', 'remote'])->default('full_time');
      $table->enum('experience_level', ['entry', 'mid', 'senior', 'lead', 'executive'])->default('mid');
      $table->decimal('salary_min', 12, 2)->nullable();
      $table->decimal('salary_max', 12, 2)->nullable();
      $table->string('currency', 3)->default('USD');
      $table->enum('status', ['draft', 'published', 'closed', 'on_hold'])->default('draft');
      $table->integer('positions_available')->default(1);
      $table->date('posted_date')->nullable();
      $table->date('closing_date')->nullable();
      $table->foreignId('created_by')->constrained('users')->onDelete('cascade');
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('job_postings');
  }
};
