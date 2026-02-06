import { z } from 'zod';

export const paginationSchema = z.object({
  page: z.coerce.number().int().min(1).default(1),
  limit: z.coerce.number().int().min(1).max(100).default(10),
});

export type PaginationParams = z.infer<typeof paginationSchema>;
export const VALID_PROGRAMS = [
  'Ingeniería en Sistemas',
  'Administración de Empresas',
  'Medicina',
] as const;

export const VALID_TERMS = [
  '2024-1',
  '2024-2',
  '2025-1',
] as const;

export const coursePerformanceFiltersSchema = z.object({
  term: z.enum(VALID_TERMS), // obligatorio
  program: z.enum(VALID_PROGRAMS).optional(),
});

export type CoursePerformanceFilters = z.infer<typeof coursePerformanceFiltersSchema>;

export const teacherLoadFiltersSchema = z.object({
  term: z.enum(VALID_TERMS).optional(),
  ...paginationSchema.shape,
});

export type TeacherLoadFilters = z.infer<typeof teacherLoadFiltersSchema>;
export const studentsAtRiskFiltersSchema = z.object({
  search: z.string().max(100).optional(), // búsqueda por name/email
  ...paginationSchema.shape,
});

export type StudentsAtRiskFilters = z.infer<typeof studentsAtRiskFiltersSchema>;
export const attendanceByGroupFiltersSchema = z.object({
  term: z.enum(VALID_TERMS).optional(),
});

export type AttendanceByGroupFilters = z.infer<typeof attendanceByGroupFiltersSchema>;
export const rankStudentsFiltersSchema = z.object({
  program: z.enum(VALID_PROGRAMS), // obligatorio
  term: z.enum(VALID_TERMS).optional(),
});

export type RankStudentsFilters = z.infer<typeof rankStudentsFiltersSchema>;
export function buildWhereClause(conditions: string[]): string {
  return conditions.length > 0 ? `WHERE ${conditions.join(' AND ')}` : '';
}

export function calculateOffset(page: number, limit: number): number {
  return (page - 1) * limit;
}

export function validateAndParse<T>(
  schema: z.ZodSchema<T>,
  data: unknown
): { success: true; data: T } | { success: false; error: string } {
  try {
    const parsed = schema.parse(data);
    return { success: true, data: parsed };
  } catch (error) {
    if (error instanceof z.ZodError) {
      return {
        success: false,
        error: error.issues
          .map((e: z.ZodIssue) => `${e.path.join('.')}: ${e.message}`)
          .join(', '),
      };
    }
    return { success: false, error: 'Validation error' };
  }
}
