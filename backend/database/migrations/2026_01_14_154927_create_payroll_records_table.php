<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('payroll_records', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->foreignId('payroll_period_id')->constrained()->onDelete('cascade');

      // Earnings
      $table->decimal('basic_salary', 12, 2);
      $table->decimal('allowances', 12, 2)->default(0);
      $table->decimal('bonuses', 12, 2)->default(0);
      $table->decimal('overtime_pay', 12, 2)->default(0);
      $table->decimal('gross_salary', 12, 2);

      // Deductions
      $table->decimal('tax_deduction', 12, 2)->default(0);
      $table->decimal('insurance_deduction', 12, 2)->default(0);
      $table->decimal('other_deductions', 12, 2)->default(0);
      $table->decimal('total_deductions', 12, 2);

      // Net
      $table->decimal('net_salary', 12, 2);

      // Attendance-based
      $table->integer('days_worked')->default(0);
      $table->integer('days_absent')->default(0);
      $table->decimal('overtime_hours', 6, 2)->default(0);

      $table->enum('status', ['draft', 'approved', 'paid'])->default('draft');
      $table->text('notes')->nullable();

      $table->timestamps();

      $table->unique(['employee_id', 'payroll_period_id']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('payroll_records');
  }
};
