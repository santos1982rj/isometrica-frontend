import { api } from '../../core/api/client';

import type {
  AdminCourse,
  AdminOverview,
  AdminTransaction,
  AdminTrackingSettings,
  AdminPlatformSettings,
  AdminUser,
  UpdateAdminCourseStatusInput,
  UpdateAdminCourseCommercialInput,
  UpdateAdminCourseSalesInput,
  UpdateAdminTrackingSettingsInput,
  UpdateAdminPlatformSettingsInput,
} from './admin.types';

export async function getAdminOverview() {
  const response = await api.get<{ overview: AdminOverview }>(
    '/admin/overview',
  );

  return response.data.overview;
}

export async function listAdminUsers() {
  const response = await api.get<{ users: AdminUser[] }>(
    '/admin/users',
  );

  return response.data.users;
}

export async function listAdminCourses() {
  const response = await api.get<{ courses: AdminCourse[] }>(
    '/admin/courses',
  );

  return response.data.courses;
}

export async function listAdminTransactions() {
  const response = await api.get<{
    transactions: AdminTransaction[];
  }>('/admin/transactions');

  return response.data.transactions;
}

export async function updateAdminUserAccess(
  userId: string,
  data: Pick<AdminUser, 'role' | 'status'>,
) {
  const response = await api.put<{ user: AdminUser }>(
    `/admin/users/${userId}/access`,
    data,
  );

  return response.data.user;
}

export async function updateAdminCourseStatus(
  courseId: string,
  data: UpdateAdminCourseStatusInput,
) {
  const response = await api.patch<{ course: AdminCourse }>(
    `/admin/courses/${courseId}/status`,
    data,
  );

  return response.data.course;
}

export async function updateAdminCourseCommercial(
  courseId: string,
  data: UpdateAdminCourseCommercialInput,
) {
  const response = await api.patch<{ course: AdminCourse }>(
    `/admin/courses/${courseId}/commercial`,
    data,
  );

  return response.data.course;
}

export async function updateAdminCourseSales(
  courseId: string,
  data: UpdateAdminCourseSalesInput,
) {
  const response = await api.patch<{ course: AdminCourse }>(
    `/admin/courses/${courseId}/sales`,
    data,
  );

  return response.data.course;
}

export async function updateAdminLessonPreview(
  lessonId: string,
  isGratuita: boolean,
) {
  const response = await api.patch<{
    lesson: { id: string; titulo: string; isGratuita: boolean };
  }>(`/admin/lessons/${lessonId}/preview`, { isGratuita });

  return response.data.lesson;
}

export async function getAdminTrackingSettings() {
  const response = await api.get<{ settings: AdminTrackingSettings }>(
    '/admin/settings/tracking',
  );

  return response.data.settings;
}

export async function updateAdminTrackingSettings(
  data: UpdateAdminTrackingSettingsInput,
) {
  const response = await api.put<{ settings: AdminTrackingSettings }>(
    '/admin/settings/tracking',
    data,
  );

  return response.data.settings;
}

export async function getAdminPlatformSettings() {
  const response = await api.get<{ settings: AdminPlatformSettings }>(
    '/admin/settings/platform',
  );

  return response.data.settings;
}

export async function updateAdminPlatformSettings(
  data: UpdateAdminPlatformSettingsInput,
) {
  const response = await api.put<{ settings: AdminPlatformSettings }>(
    '/admin/settings/platform',
    data,
  );

  return response.data.settings;
}
