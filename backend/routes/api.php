<?php

use App\Http\Controllers\Api\V1\Auth\AuthController;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Route;

Route::prefix('v1')->group(function () {
  Route::get('/test', function () {
    return response()->json(['message' => 'API is working!']);
  });

  Route::prefix('auth')->group(function () {
    Route::post('/login', [AuthController::class, 'login']);

    Route::middleware('auth:sanctum')->group(function () {
      Route::post('/logout', [AuthController::class, 'logout']);
      Route::get('/me', [AuthController::class, 'user']);
      Route::put('/profile', [AuthController::class, 'updateProfile']);
      Route::put('/notification-settings', [AuthController::class, 'updateNotificationSettings']);
    });
  });

  // Other API routes can go here
  Route::middleware('auth:sanctum')->group(function () {
    Route::get('dashboard/stats', [\App\Http\Controllers\Api\V1\DashboardController::class, 'stats']);
    Route::get('dashboard/export/excel', [\App\Http\Controllers\Api\V1\DashboardExportController::class, 'exportExcel']);
    Route::post('attendance/clock-in', [\App\Http\Controllers\Api\V1\AttendanceController::class, 'clockIn']);
    Route::post('attendance/clock-out', [\App\Http\Controllers\Api\V1\AttendanceController::class, 'clockOut']);
    Route::apiResource('attendance', \App\Http\Controllers\Api\V1\AttendanceController::class);

    Route::get('leaves/types', [\App\Http\Controllers\Api\V1\LeaveController::class, 'types']);
    Route::apiResource('leaves', \App\Http\Controllers\Api\V1\LeaveController::class);

    Route::get('payroll/periods', [\App\Http\Controllers\Api\V1\PayrollController::class, 'periods']);
    Route::post('payroll/periods', [\App\Http\Controllers\Api\V1\PayrollController::class, 'createPeriod']);
    Route::put('payroll/periods/{id}/approve', [\App\Http\Controllers\Api\V1\PayrollController::class, 'approvePeriod']);
    Route::get('payroll/records', [\App\Http\Controllers\Api\V1\PayrollController::class, 'records']);
    Route::post('payroll/calculate', [\App\Http\Controllers\Api\V1\PayrollController::class, 'calculate']);
    Route::get('payroll/my-payslips', [\App\Http\Controllers\Api\V1\PayrollController::class, 'myPayslips']);
    Route::get('payroll/records/{id}/pdf', [\App\Http\Controllers\Api\V1\PayrollController::class, 'downloadPdf']);

    // Performance Management
    Route::get('performance/summary', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'summary']);
    Route::get('performance/reviews', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'reviews']);
    Route::post('performance/reviews', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'createReview']);
    Route::put('performance/reviews/{id}', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'updateReview']);
    Route::get('performance/okrs', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'okrs']);
    Route::post('performance/okrs', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'createOkr']);
    Route::put('performance/okrs/{id}', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'updateOkr']);
    Route::get('performance/goals', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'goals']);
    Route::post('performance/goals', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'createGoal']);
    Route::put('performance/goals/{id}', [\App\Http\Controllers\Api\V1\PerformanceController::class, 'updateGoal']);

    // Recruitment / ATS
    Route::get('recruitment/summary', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'summary']);
    Route::get('recruitment/jobs', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'jobs']);
    Route::post('recruitment/jobs', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'createJob']);
    Route::put('recruitment/jobs/{id}', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'updateJob']);
    Route::get('recruitment/candidates', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'candidates']);
    Route::post('recruitment/candidates', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'createCandidate']);
    Route::get('recruitment/applications', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'applications']);
    Route::post('recruitment/applications', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'createApplication']);
    Route::put('recruitment/applications/{id}', [\App\Http\Controllers\Api\V1\RecruitmentController::class, 'updateApplication']);

    // Onboarding
    Route::get('onboarding/summary', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'summary']);
    Route::get('onboarding/templates', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'templates']);
    Route::post('onboarding/templates', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'createTemplate']);
    Route::get('onboarding/checklists', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'checklists']);
    Route::post('onboarding/checklists', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'createChecklist']);
    Route::get('onboarding/tasks', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'tasks']);
    Route::post('onboarding/tasks', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'createTask']);
    Route::put('onboarding/tasks/{id}', [\App\Http\Controllers\Api\V1\OnboardingController::class, 'updateTask']);

    // Reports & Analytics
    Route::get('reports/employees', [\App\Http\Controllers\Api\V1\ReportsController::class, 'employeeReports']);
    Route::get('reports/attendance', [\App\Http\Controllers\Api\V1\ReportsController::class, 'attendanceReports']);
    Route::get('reports/payroll', [\App\Http\Controllers\Api\V1\ReportsController::class, 'payrollReports']);
    Route::get('reports/recruitment', [\App\Http\Controllers\Api\V1\ReportsController::class, 'recruitmentReports']);

    // Notifications
    Route::get('notifications', [\App\Http\Controllers\Api\V1\NotificationController::class, 'index']);
    Route::put('notifications/{id}/read', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAsRead']);
    Route::put('notifications/read-all', [\App\Http\Controllers\Api\V1\NotificationController::class, 'markAllAsRead']);

    // Global Search
    Route::get('search', [\App\Http\Controllers\Api\V1\SearchController::class, 'search']);

    // Audit Logs
    Route::get('audit-logs', [\App\Http\Controllers\Api\V1\AuditLogController::class, 'index']);
    Route::get('audit-logs/{id}', [\App\Http\Controllers\Api\V1\AuditLogController::class, 'show']);

    // Role Management (Admin only)
    Route::get('roles/permissions', [\App\Http\Controllers\Api\V1\RoleController::class, 'permissions']);
    Route::apiResource('roles', \App\Http\Controllers\Api\V1\RoleController::class);

    // User Role Management
    Route::get('user-roles', [\App\Http\Controllers\Api\V1\UserRoleController::class, 'index']);
    Route::get('user-roles/{userId}', [\App\Http\Controllers\Api\V1\UserRoleController::class, 'show']);
    Route::put('user-roles/{userId}', [\App\Http\Controllers\Api\V1\UserRoleController::class, 'update']);

    Route::post('employees/{id}/avatar', [\App\Http\Controllers\Api\V1\EmployeeController::class, 'uploadAvatar']);
    Route::post('employees/{id}/documents', [\App\Http\Controllers\Api\V1\EmployeeController::class, 'uploadDocument']);
    Route::delete('documents/{id}', [\App\Http\Controllers\Api\V1\EmployeeController::class, 'deleteDocument']);

    Route::apiResource('employees', \App\Http\Controllers\Api\V1\EmployeeController::class);

    Route::get('scheduled-email-logs', [\App\Http\Controllers\Api\V1\ScheduledEmailLogController::class, 'index']);

    Route::get('calendar/events', [\App\Http\Controllers\Api\V1\CalendarController::class, 'index']);
  });
});
