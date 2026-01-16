<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('salary_structures', function (Blueprint $table) {
      $table->id();
      $table->foreignId('employee_id')->constrained()->onDelete('cascade');
      $table->decimal('basic_salary', 12, 2);
      $table->decimal('housing_allowance', 10, 2)->default(0);
      $table->decimal('transport_allowance', 10, 2)->default(0);
      $table->decimal('other_allowances', 10, 2)->default(0);
      $table->decimal('tax_rate', 5, 2)->default(0);
      $table->decimal('social_insurance', 10, 2)->default(0);
      $table->string('currency', 3)->default('USD');
      $table->date('effective_from');
      $table->date('effective_to')->nullable();
      $table->boolean('active')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('salary_structures');
  }
};
