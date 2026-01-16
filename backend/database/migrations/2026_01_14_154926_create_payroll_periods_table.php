<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('payroll_periods', function (Blueprint $table) {
      $table->id();
      $table->string('name'); // e.g., "January 2026"
      $table->date('start_date');
      $table->date('end_date');
      $table->enum('status', ['draft', 'processing', 'approved', 'paid', 'cancelled'])->default('draft');
      $table->integer('working_days');
      $table->decimal('total_gross', 15, 2)->default(0);
      $table->decimal('total_deductions', 15, 2)->default(0);
      $table->decimal('total_net', 15, 2)->default(0);
      $table->foreignId('approved_by')->nullable()->constrained('users')->onDelete('set null');
      $table->timestamp('approved_at')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('payroll_periods');
  }
};
