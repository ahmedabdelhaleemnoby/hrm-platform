<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('employees', function (Blueprint $table) {
      $table->id();
      $table->string('employee_code')->unique();
      $table->string('first_name');
      $table->string('last_name');
      $table->string('email')->unique();
      $table->string('phone')->nullable();
      $table->date('date_of_birth')->nullable();
      $table->enum('gender', ['male', 'female', 'other'])->nullable();
      $table->string('department')->nullable();
      $table->string('position')->nullable();
      $table->enum('employment_status', ['active', 'on_leave', 'terminated'])->default('active');
      $table->enum('employment_type', ['full_time', 'part_time', 'contract'])->default('full_time');
      $table->date('hire_date')->nullable();
      $table->decimal('salary', 10, 2)->nullable();
      $table->text('address')->nullable();
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('employees');
  }
};
