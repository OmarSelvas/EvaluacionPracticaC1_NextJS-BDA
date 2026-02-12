import { CoursePerformance, TeacherLoad, StudentRisk, AttendanceGroup, StudentRanking } from '@/types';

const API_URL = process.env.API_URL || 'http://backend:4000';

interface PaginatedResponse<T> {
  data: T[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    totalPages: number;
  };
}

const fetchAPI = async <T>(endpoint: string, params: Record<string, any> = {}): Promise<PaginatedResponse<T>> => {
  const query = new URLSearchParams(params).toString();
  const res = await fetch(`${API_URL}/api/reports/${endpoint}?${query}`, { cache: 'no-store' });
  
  if (!res.ok) {
    return { data: [], pagination: { total: 0, page: 1, limit: 10, totalPages: 0 } };
  }
  return res.json();
};

export const getCoursePerformance = (term?: string) => 
  fetchAPI<CoursePerformance>('course', { term });

export const getTeacherLoad = (page: number = 1) => 
  fetchAPI<TeacherLoad>('teacher', { page, limit: 6 });

export const getStudentsAtRisk = (search: string = '', page: number = 1) => 
  fetchAPI<StudentRisk>('students', { search, page, limit: 9 });

export const getAttendanceByGroup = () => 
  fetchAPI<AttendanceGroup>('attendance');

export const getStudentRankings = () => 
  fetchAPI<StudentRanking>('rank');