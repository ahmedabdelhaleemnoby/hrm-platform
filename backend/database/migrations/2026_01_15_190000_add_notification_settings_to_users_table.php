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
    Schema::table('users', function (Blueprint $table) {
      $table->json('notification_settings')->nullable()->after('employee_id');
    });

    // Initialize default settings for existing users
    $defaultSettings = json_encode([
      'attendance' => true,
      'leave' => true,
      'performance' => true,
      'system' => true,
    ]);

    \DB::table('users')->update(['notification_settings' => $defaultSettings]);
  }

  /**
   * Reverse the migrations.
   */
  public function down(): void
  {
    Schema::table('users', function (Blueprint $table) {
      $table->dropColumn('notification_settings');
    });
  }
};
