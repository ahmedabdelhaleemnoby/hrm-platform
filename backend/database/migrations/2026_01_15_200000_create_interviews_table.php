<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('interviews', function (Blueprint $table) {
      $table->id();
      $table->foreignId('job_application_id')->constrained()->onDelete('cascade');
      $table->foreignId('interviewer_id')->constrained('users')->onDelete('cascade');
      $table->string('title');
      $table->dateTime('start_time');
      $table->dateTime('end_time');
      $table->string('location')->nullable();
      $table->text('notes')->nullable();
      $table->enum('status', ['scheduled', 'completed', 'cancelled'])->default('scheduled');
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('interviews');
  }
};
