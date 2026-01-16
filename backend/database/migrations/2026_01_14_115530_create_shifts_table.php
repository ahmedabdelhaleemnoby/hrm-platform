<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration {
  public function up(): void
  {
    Schema::create('shifts', function (Blueprint $table) {
      $table->id();
      $table->string('name');
      $table->time('start_time');
      $table->time('end_time');
      $table->integer('grace_period_minutes')->default(15);
      $table->decimal('min_hours', 4, 1)->default(8.0);
      $table->boolean('is_overnight')->default(false);
      $table->string('color', 7)->nullable();
      $table->boolean('active')->default(true);
      $table->timestamps();
    });
  }

  public function down(): void
  {
    Schema::dropIfExists('shifts');
  }
};
