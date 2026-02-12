import { CoursePerformance, TeacherLoad, StudentRisk, AttendanceGroup, StudentRanking } from '@/types';

const API_URL = process.env.API_URL || 'http://localhost:4000';

export const getCoursePerformance = async (): Promise<CoursePerformance[]> => {
  const res = await fetch(`${API_URL}/api/reports/course`, { cache: 'no-store' });
  if (!res.ok) throw new Error('Fallo al obtener cursos');
  return res.json();
};

export const getTeacherLoad = async (): Promise<TeacherLoad[]> => {
  const res = await fetch(`${API_URL}/api/reports/teacher`, { cache: 'no-store' });
  return res.json();
};

export const getStudentsAtRisk = async (): Promise<StudentRisk[]> => {
  const res = await fetch(`${API_URL}/api/reports/students`, { cache: 'no-store' });
  return res.json();
};

export const getAttendanceByGroup = async (): Promise<AttendanceGroup[]> => {
  const res = await fetch(`${API_URL}/api/reports/attendance`, { cache: 'no-store' });
  return res.json();
};

export const getStudentRankings = async (): Promise<StudentRanking[]> => {
  const res = await fetch(`${API_URL}/api/reports/rank`, { cache: 'no-store' });
  return res.json();
};