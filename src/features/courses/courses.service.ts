import { api } from '../../core/api/client';

import type {
  CoursesResponse,
  CourseDetailsResponse,
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