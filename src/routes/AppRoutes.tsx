import { Suspense, lazy } from 'react';
import { BrowserRouter, Route, Routes } from 'react-router-dom';

import { AppShell } from '../features/layout/components/AppShell';

import { LoginPage } from '../features/auth/LoginPage';
import { RegisterPage } from '../features/auth/RegisterPage';
import { ForgotPasswordPage } from '../features/auth/ForgotPasswordPage';
import { ResetPasswordPage } from '../features/auth/ResetPasswordPage';
import { VerifyEmailPage } from '../features/auth/VerifyEmailPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CoursesPage } from '../features/courses/CoursesPage';
import { PublicCoursesFrame } from '../features/courses/PublicCoursesFrame';
import { StudyModePage } from '../features/study-mode/StudyModePage';
import { CourseDetailsPage } from '../features/courses/CourseDetailsPage';
import { LessonPage } from '../features/lessons/LessonPage';
import { AnalyticsPage } from '../features/analytics/pages/AnalyticsPage';
import { CommunityPage } from '../features/community/CommunityPage';
import { ProfilePage } from '../features/profile/ProfilePage';
import { RankingPage } from '../features/ranking/RankingPage';
import { RevisionPage } from '../features/revision/RevisionPage';
import { ToolsPage } from '../features/tools/ToolsPage';
import { LandingPage } from '../features/landing/LandingPage';
import { PrivacyPage } from '../features/legal/PrivacyPage';
import { TermsPage } from '../features/legal/TermsPage';
import { TeacherDashboardPage } from '../features/teacher/TeacherDashboardPage';
import { AdminDashboardPage } from '../features/admin/AdminDashboardPage';
import { PageLoader } from '../components/loaders/PageLoader';

import { PrivateRoute } from './PrivateRoute';
import { RoleRoute } from './RoleRoute';

const CalculatorsPage = lazy(() =>
  import('../features/calculators/CalculatorsPage').then((module) => ({
    default: module.CalculatorsPage,
  })),
);

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<LandingPage />} />
        <Route path="/landing" element={<LandingPage />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/register" element={<RegisterPage />} />
        <Route path="/forgot-password" element={<ForgotPasswordPage />} />
        <Route path="/reset-password" element={<ResetPasswordPage />} />
        <Route path="/verify-email" element={<VerifyEmailPage />} />
        <Route path="/terms" element={<TermsPage />} />
        <Route path="/privacy" element={<PrivacyPage />} />
        <Route
          path="/courses"
          element={
            <PublicCoursesFrame>
              <CoursesPage />
            </PublicCoursesFrame>
          }
        />
        <Route
          path="/courses/:slug"
          element={
            <PublicCoursesFrame>
              <CourseDetailsPage />
            </PublicCoursesFrame>
          }
        />
        <Route
          path="/preview/lessons/:id"
          element={
            <PublicCoursesFrame>
              <LessonPage />
            </PublicCoursesFrame>
          }
        />

        <Route element={<PrivateRoute />}>
          <Route element={<AppShell />}>
            <Route path="/dashboard" element={<DashboardPage />} />
            <Route
              path="/calculators"
              element={
                <Suspense fallback={<PageLoader />}>
                  <CalculatorsPage />
                </Suspense>
              }
            />
            <Route path="/study-mode" element={<StudyModePage />} />
            <Route path="/lessons/:id" element={<LessonPage />} />
            <Route path="/analytics" element={<AnalyticsPage />} />
            <Route path="/profile" element={<ProfilePage />} />
            <Route path="/ranking" element={<RankingPage />} />
            <Route path="/revision" element={<RevisionPage />} />
            <Route path="/tools" element={<ToolsPage />} />
            <Route path="/community" element={<CommunityPage />} />

            <Route
              element={
                <RoleRoute allowedRoles={['PROFESSOR', 'ADMIN']} />
              }
            >
              <Route path="/teacher" element={<TeacherDashboardPage />} />
            </Route>

            <Route element={<RoleRoute allowedRoles={['ADMIN']} />}>
              <Route path="/admin" element={<AdminDashboardPage />} />
            </Route>
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}
