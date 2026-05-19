import { BrowserRouter, Navigate, Route, Routes } from 'react-router-dom';

import { AppShell } from '../components/layout/AppShell';

import { LoginPage } from '../features/auth/LoginPage';
import { DashboardPage } from '../features/dashboard/DashboardPage';
import { CoursesPage } from '../features/courses/CoursesPage';
import { CalculatorsPage } from '../features/calculators/CalculatorsPage';
import { StudyModePage } from '../features/study-mode/StudyModePage';
import { CourseDetailsPage } from '../features/courses/CourseDetailsPage';
import { LessonPage } from '../features/lessons/LessonPage';

import { PrivateRoute } from './PrivateRoute';

export function AppRoutes() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/login" element={<LoginPage />} />

        <Route element={<PrivateRoute />}>
          <Route element={<AppShell />}>
            <Route
              path="/"
              element={<Navigate to="/dashboard" replace />}
            />

            <Route path="/dashboard" element={<DashboardPage />} />
            <Route path="/courses" element={<CoursesPage />} />
            <Route path="/courses/:slug" element={<CourseDetailsPage />} />
            <Route path="/calculators" element={<CalculatorsPage />} />
            <Route path="/study-mode" element={<StudyModePage />} />
            <Route path="/lessons/:id" element={<LessonPage />} />
          </Route>
        </Route>
      </Routes>
    </BrowserRouter>
  );
}