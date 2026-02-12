import { CoursePerformance, TeacherLoad, StudentRisk, AttendanceGroup, StudentRanking } from '@/types';

const API_URL = process.env.API_URL || 'http://backend:4000';

const fetchAPI = async (endpoint: string) => {
  const res = await fetch(`${API_URL}/api/reports/${endpoint}`, { cache: 'no-store' });
  if (!res.ok) return [];
  return res.json();
};

export const getCoursePerformance = async (): Promise<CoursePerformance[]> => fetchAPI('course');
export const getTeacherLoad = async (): Promise<TeacherLoad[]> => fetchAPI('teacher');
export const getStudentsAtRisk = async (): Promise<StudentRisk[]> => fetchAPI('students');
export const getAttendanceByGroup = async (): Promise<AttendanceGroup[]> => fetchAPI('attendance');
export const getStudentRankings = async (): Promise<StudentRanking[]> => fetchAPI('rank');