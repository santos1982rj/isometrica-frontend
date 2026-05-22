import { api } from '../../core/api/client';

import type {
  EnrollCourseResponse,
  CoursesResponse,
  CourseDetailsResponse,
  MyCoursesResponse,
} from './courses.types';

export async function listCourses() {
  const response = await api.get<CoursesResponse>('/courses');

  return response.data.courses;
}

export async function getCourseBySlug(slug: string) {
  const response = await api.get<CourseDetailsResponse>(
    `/courses/${slug}`,
  );

  return response.data.course;
}

export async function enrollFreeCourse(courseId: string) {
  const response = await api.post<EnrollCourseResponse>(
    `/courses/${courseId}/enroll`,
  );

  return response.data.enrollment;
}

export async function listMyCourses() {
  const response = await api.get<MyCoursesResponse>('/students/me/courses');

  return response.data.enrollments;
}
