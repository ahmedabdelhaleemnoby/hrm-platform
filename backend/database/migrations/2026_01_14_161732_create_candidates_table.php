<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('candidates', function (Blueprint $table) {
      $table->id();
      $table->string('first_name');
      $table->string('last_name');
      $table->string('email')->unique();
      $table->string('phone')->nullable();
      $table->string('linkedin_url')->nullable();
      $table->string('portfolio_url')->nullable();
      $table->text('resume_path')->nullable();
      $table->string('current_company')->nullable();
      $table->string('current_position')->nullable();
      $table->integer('years_of_experience')->nullable();
      $table->text('skills')->nullable(); // JSON array
      $table->text('notes')->nullable();
      $table->enum('source', ['website', 'linkedin', 'referral', 'job_board', 'agency', 'other'])->default('website');
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('candidates');
  }
};
