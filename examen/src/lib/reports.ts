import { query } from './db';
import {
  CoursePerformanceFilters,
  TeacherLoadFilters,
  StudentsAtRiskFilters,
  AttendanceByGroupFilters,
  RankStudentsFilters,
  calculateOffset,
  buildWhereClause,
} from './validation';

export interface CoursePerformance {
  course_id: number;
  codigo_curso: string;
  nombre_curso: string;
  periodo: string;
  programa: string;
  total_estudiantes: number;
  promedio_general: number;
  estudiantes_aprobados: number;
  estudiantes_reprobados: number;
  tasa_aprobacion_porcentaje: number;
}

export interface TeacherLoad {
  teacher_id: number;
  nombre_docente: string;
  email_docente: string;
  periodo: string;
  numero_grupos: number;
  total_alumnos: number;
  promedio_general_alumnos: number;
  creditos_totales_impartidos: number;
}

export interface StudentAtRisk {
  student_id: number;
  nombre_estudiante: string;
  email_estudiante: string;
  programa: string;
  anio_ingreso: number;
  promedio_final: number;
  total_materias: number;
  porcentaje_asistencia: number;
  nivel_riesgo: string;
}

export interface AttendanceByGroup {
  group_id: number;
  codigo_curso: string;
  nombre_curso: string;
  nombre_docente: string;
  periodo: string;
  total_estudiantes: number;
  total_registros_asistencia: number;
  total_asistencias: number;
  asistencia_promedio_porcentaje: number;
  estudiantes_buena_asistencia: number;
  estudiantes_mala_asistencia: number;
}

export interface RankStudent {
  student_id: number;
  nombre_estudiante: string;
  email_estudiante: string;
  programa: string;
  periodo: string;
  promedio_periodo: number;
  materias_cursadas: number;
  ranking_programa: number;
  posicion_programa: number;
  clasificacion_rendimiento: string;
  diferencia_vs_promedio_programa: number;
}

export interface PaginatedResult<T> {
  data: T[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    totalPages: number;
  };
}

// Rendimiento por curso 
export async function getCoursePerformance(
  filters: CoursePerformanceFilters
): Promise<CoursePerformance[]> {
  const conditions: string[] = ['periodo = $1'];
  const params: any[] = [filters.term];

  if (filters.program) {
    conditions.push('programa = $2');
    params.push(filters.program);
  }

  const whereClause = buildWhereClause(conditions);

  const sql = `
    SELECT * FROM vw_course_performance
    ${whereClause}
    ORDER BY promedio_general DESC
  `;

  return query<CoursePerformance>(sql, params);
}

// Carga de maestros
export async function getTeacherLoad(
  filters: TeacherLoadFilters
): Promise<PaginatedResult<TeacherLoad>> {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;

  if (filters.term) {
    conditions.push(`periodo = $${paramIndex}`);
    params.push(filters.term);
    paramIndex++;
  }

  const whereClause = buildWhereClause(conditions);
  const countSql = `
    SELECT COUNT(*) as total
    FROM vw_teacher_load
    ${whereClause}`
    ;

  const countResult = await query<{ total: string }>(countSql, params);
  const total = parseInt(countResult[0]?.total || '0');
  const offset = calculateOffset(filters.page, filters.limit);
  const dataSql = `
    SELECT * FROM vw_teacher_load
    ${whereClause}
    ORDER BY total_alumnos DESC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, offset);
  const data = await query<TeacherLoad>(dataSql, params);

  return {
    data,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

// Estudiantes en riesgo
export async function getStudentsAtRisk(
  filters: StudentsAtRiskFilters
): Promise<PaginatedResult<StudentAtRisk>> {
  const conditions: string[] = [];
  const params: any[] = [];
  let paramIndex = 1;
  if (filters.search) {
    conditions.push(
      `(LOWER(nombre_estudiante) LIKE LOWER($${paramIndex}) OR LOWER(email_estudiante) LIKE LOWER($${paramIndex}))`
    );
    params.push(`%${filters.search}%`);
    paramIndex++;
  }

  const whereClause = buildWhereClause(conditions);
  const countSql = `
    SELECT COUNT(*) as total
    FROM vw_students_at_risk
    ${whereClause}
  `;

  const countResult = await query<{ total: string }>(countSql, params);
  const total = parseInt(countResult[0]?.total || '0');
  const offset = calculateOffset(filters.page, filters.limit);
  const dataSql = `
    SELECT * FROM vw_students_at_risk
    ${whereClause}
    ORDER BY 
      CASE nivel_riesgo
        WHEN 'Riesgo Alto - Rendimiento y Asistencia' THEN 1
        WHEN 'Riesgo Alto - Rendimiento Académico' THEN 2
        WHEN 'Riesgo Medio - Baja Asistencia' THEN 3
        ELSE 4
      END,
      promedio_final ASC
    LIMIT $${paramIndex} OFFSET $${paramIndex + 1}
  `;

  params.push(filters.limit, offset);
  const data = await query<StudentAtRisk>(dataSql, params);

  return {
    data,
    pagination: {
      page: filters.page,
      limit: filters.limit,
      total,
      totalPages: Math.ceil(total / filters.limit),
    },
  };
}

//Asistencia por grupo
export async function getAttendanceByGroup(
  filters: AttendanceByGroupFilters
): Promise<AttendanceByGroup[]> {
  const conditions: string[] = [];
  const params: any[] = [];

  if (filters.term) {
    conditions.push('periodo = $1');
    params.push(filters.term);
  }

  const whereClause = buildWhereClause(conditions);

  const sql = `
    SELECT * FROM vw_attendance_by_group
    ${whereClause}
    ORDER BY asistencia_promedio_porcentaje ASC
  `;

  return query<AttendanceByGroup>(sql, params);
}

// Ranking de estudiantes
export async function getRankStudents(
  filters: RankStudentsFilters
): Promise<RankStudent[]> {
  const conditions: string[] = ['programa = $1'];
  const params: any[] = [filters.program];

  if (filters.term) {
    conditions.push('periodo = $2');
    params.push(filters.term);
  }

  const whereClause = buildWhereClause(conditions);

  const sql = `
    SELECT * FROM vw_rank_students
    ${whereClause}
    ORDER BY ranking_programa ASC
  `;

  return query<RankStudent>(sql, params);
}

export function calculateKPIs(data: CoursePerformance[]) {
  if (data.length === 0) {
    return {
      promedioGeneral: 0,
      totalEstudiantes: 0,
      tasaAprobacionPromedio: 0,
      cursoMejorRendimiento: null,
    };
  }

  const totalEstudiantes = data.reduce((sum, item) => sum + item.total_estudiantes, 0);
  const promedioGeneral =
    data.reduce((sum, item) => sum + item.promedio_general, 0) / data.length;
  const tasaAprobacionPromedio =
    data.reduce((sum, item) => sum + item.tasa_aprobacion_porcentaje, 0) / data.length;
  const cursoMejorRendimiento = data[0]; // Ya está ordenado por promedio DESC

  return {
    promedioGeneral: Math.round(promedioGeneral * 100) / 100,
    totalEstudiantes,
    tasaAprobacionPromedio: Math.round(tasaAprobacionPromedio * 100) / 100,
    cursoMejorRendimiento,
  };
}