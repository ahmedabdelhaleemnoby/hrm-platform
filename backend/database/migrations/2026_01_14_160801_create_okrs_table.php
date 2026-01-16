<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('okrs', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->string('title');
      $table->text('description')->nullable();
      $table->enum('type', ['objective', 'key_result'])->default('objective');
      $table->foreignId('parent_id')->nullable()->constrained('okrs')->onDelete('cascade');

      $table->string('period'); // e.g., "Q1 2026"
      $table->date('start_date');
      $table->date('end_date');

      $table->integer('target_value')->nullable();
      $table->integer('current_value')->default(0);
      $table->integer('progress')->default(0); // 0-100

      $table->enum('status', ['not_started', 'on_track', 'at_risk', 'completed', 'cancelled'])->default('not_started');
      $table->enum('priority', ['low', 'medium', 'high', 'critical'])->default('medium');

      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('okrs');
  }
};
