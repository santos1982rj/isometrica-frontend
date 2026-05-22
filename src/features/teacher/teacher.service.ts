import { api } from '../../core/api/client';

import type {
  CourseManagementInput,
  ExerciseManagementInput,
  LessonManagementInput,
  ModuleManagementInput,
  TeacherKpis,
  TeacherCoursesResponse,
} from './teacher.types';

export async function listTeacherCourses() {
  const response = await api.get<TeacherCoursesResponse>(
    '/teacher/courses',
  );

  return response.data.courses;
}

export async function getTeacherKpis(periodDays: 7 | 30 | 90) {
  const response = await api.get<{ kpis: TeacherKpis }>(
    `/teacher/kpis?periodDays=${periodDays}`,
  );

  return response.data.kpis;
}

export async function createTeacherCourse(data: CourseManagementInput) {
  const response = await api.post('/teacher/courses', data);

  return response.data.course;
}

export async function updateTeacherCourse(
  courseId: string,
  data: CourseManagementInput,
) {
  const response = await api.put(`/teacher/courses/${courseId}`, data);

  return response.data.course;
}

export async function createTeacherModule(
  courseId: string,
  data: ModuleManagementInput,
) {
  const response = await api.post(
    `/teacher/courses/${courseId}/modules`,
    data,
  );

  return response.data.module;
}

export async function updateTeacherModule(
  moduleId: string,
  data: ModuleManagementInput,
) {
  const response = await api.put(`/teacher/modules/${moduleId}`, data);

  return response.data.module;
}

export async function createTeacherLesson(
  moduleId: string,
  data: LessonManagementInput,
) {
  const response = await api.post(
    `/teacher/modules/${moduleId}/lessons`,
    data,
  );

  return response.data.lesson;
}

export async function updateTeacherLesson(
  lessonId: string,
  data: LessonManagementInput,
) {
  const response = await api.put(`/teacher/lessons/${lessonId}`, data);

  return response.data.lesson;
}

export async function deleteTeacherCourse(courseId: string) {
  await api.delete(`/teacher/courses/${courseId}`);
}

export async function deleteTeacherModule(moduleId: string) {
  await api.delete(`/teacher/modules/${moduleId}`);
}

export async function deleteTeacherLesson(lessonId: string) {
  await api.delete(`/teacher/lessons/${lessonId}`);
}

export async function createTeacherExercise(
  lessonId: string,
  data: ExerciseManagementInput,
) {
  const response = await api.post(
    `/teacher/lessons/${lessonId}/exercises`,
    data,
  );

  return response.data.exercise;
}

export async function uploadTeacherAttachment(
  lessonId: string,
  file: File,
) {
  const formData = new FormData();
  formData.append('file', file);

  const response = await api.post(
    `/uploads/lessons/${lessonId}/attachments`,
    formData,
  );

  return response.data.attachment;
}
