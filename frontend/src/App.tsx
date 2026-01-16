import { CssBaseline } from '@mui/material';
import React, { lazy, Suspense } from 'react';
import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import { ThemeContextProvider } from './contexts/ThemeContext';
import './i18n';

// Pages
import AuditLogPage from './pages/admin/AuditLogPage';
import RoleManagementPage from './pages/admin/RoleManagementPage';
import UserRoleManagementPage from './pages/admin/UserRoleManagementPage';
import AttendancePage from './pages/attendance/AttendancePage';
import LoginPage from './pages/auth/LoginPage';
import CalendarPage from './pages/calendar/CalendarPage';
import DashboardPage from './pages/dashboard/DashboardPage';
import EmployeeListPage from './pages/employees/EmployeeListPage';
import EmployeeProfilePage from './pages/employees/EmployeeProfilePage';
import NewEmployeePage from './pages/employees/NewEmployeePage';
import MyLeavesPage from './pages/ess/MyLeavesPage';
import MyPayslipsPage from './pages/ess/MyPayslipsPage';
import MyProfilePage from './pages/ess/MyProfilePage';
import LeavePage from './pages/leave/LeavePage';
import LeaveApprovalsPage from './pages/leaves/LeaveApprovalsPage';
import NotificationsPage from './pages/notifications/NotificationsPage';
import OnboardingPage from './pages/onboarding/OnboardingPage';
import PayrollPage from './pages/payroll/PayrollPage';
import PerformancePage from './pages/performance/PerformancePage';
import RecruitmentPage from './pages/recruitment/RecruitmentPage';
import ReportsPage from './pages/reports/ReportsPage';
import SettingsPage from './pages/settings/SettingsPage';
const ScheduledEmailHistoryPage = lazy(() => import('./pages/admin/ScheduledEmailHistoryPage'));

// Protected Route Component
const ProtectedRoute: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isAuthenticated, isLoading } = useAuth();

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return isAuthenticated ? <>{children}</> : <Navigate to="/login" />;
};

function App() {
  return (
    <ThemeContextProvider>
      <CssBaseline />
      <AuthProvider>
        <BrowserRouter>
          <Routes>
            {/* Public Routes */}
            <Route path="/login" element={<LoginPage />} />

            {/* Protected Routes */}
            <Route
              path="/dashboard"
              element={
                <ProtectedRoute>
                  <DashboardPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees"
              element={
                <ProtectedRoute>
                  <EmployeeListPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/new"
              element={
                <ProtectedRoute>
                  <NewEmployeePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/employees/:id"
              element={
                <ProtectedRoute>
                  <EmployeeProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/attendance"
              element={
                <ProtectedRoute>
                  <AttendancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/leave"
              element={
                <ProtectedRoute>
                  <LeavePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/calendar"
              element={
                <ProtectedRoute>
                  <CalendarPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/payroll"
              element={
                <ProtectedRoute>
                  <PayrollPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/performance"
              element={
                <ProtectedRoute>
                  <PerformancePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/reports"
              element={
                <ProtectedRoute>
                  <ReportsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/recruitment"
              element={
                <ProtectedRoute>
                  <RecruitmentPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/onboarding"
              element={
                <ProtectedRoute>
                  <OnboardingPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/settings"
              element={
                <ProtectedRoute>
                  <SettingsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/notifications"
              element={
                <ProtectedRoute>
                  <NotificationsPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/audit-logs"
              element={
                <ProtectedRoute>
                  <AuditLogPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/roles"
              element={
                <ProtectedRoute>
                  <RoleManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/user-roles"
              element={
                <ProtectedRoute>
                  <UserRoleManagementPage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/scheduled-email-history"
              element={
                <ProtectedRoute>
                  <Suspense fallback={<div>Loading...</div>}>
                    <ScheduledEmailHistoryPage />
                  </Suspense>
                </ProtectedRoute>
              }
            />

            {/* ESS Routes */}
            <Route
              path="/my-profile"
              element={
                <ProtectedRoute>
                  <MyProfilePage />
                </ProtectedRoute>
              }
            />
            <Route
              path="/my-payslips"
              element={
                <ProtectedRoute>
                  <MyPayslipsPage />
                </ProtectedRoute>
              }
            />
             <Route
              path="/my-leaves"
              element={
                <ProtectedRoute>
                  <MyLeavesPage />
                </ProtectedRoute>
              }
            />

            <Route
              path="/leave-approvals"
              element={
                <ProtectedRoute>
                  <LeaveApprovalsPage />
                </ProtectedRoute>
              }
            />
            <Route path="/" element={<Navigate to="/dashboard" />} />
            <Route path="*" element={<Navigate to="/dashboard" />} />
          </Routes>
        </BrowserRouter>
      </AuthProvider>
    </ThemeContextProvider>
  );
}

export default App;
