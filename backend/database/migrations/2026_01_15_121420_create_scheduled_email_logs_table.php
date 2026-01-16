<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  /**
   * Run the migrations.
   */
  public function up(): void
  {
    Schema::create('scheduled_email_logs', function (Blueprint $table) {
      $table->id();
      $table->string('type');
      $table->integer('recipients_count');
      $table->integer('absent_count')->default(0);
      $table->integer('expiring_contracts_count')->default(0);
      $table->integer('birthdays_count')->default(0);
      $table->integer('probation_endings_count')->default(0);
      $table->string('status');
      $table->text('error_message')->nullable();
      $table->timestamp('executed_at')->useCurrent();
      $table->timestamps();
    });
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::dropIfExists('scheduled_email_logs');
  }
};
