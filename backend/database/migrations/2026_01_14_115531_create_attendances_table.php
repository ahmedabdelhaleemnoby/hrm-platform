<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('attendances', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->date('record_date');

      $table->timestamp('clock_in_time')->nullable();
      $table->timestamp('clock_out_time')->nullable();

      $table->string('clock_in_ip', 45)->nullable();
      $table->string('clock_out_ip', 45)->nullable();

      $table->foreignId('shift_id')->nullable()->constrained();

      $table->enum('status', ['present', 'late', 'absent', 'half_day', 'on_leave'])->default('present');
      $table->decimal('total_hours', 5, 2)->nullable();
      $table->decimal('overtime_hours', 5, 2)->default(0);
      $table->integer('late_minutes')->default(0);

      $table->text('notes')->nullable();
      $table->timestamps();

      $table->unique(['employee_id', 'record_date']);
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('attendances');
  }
};
