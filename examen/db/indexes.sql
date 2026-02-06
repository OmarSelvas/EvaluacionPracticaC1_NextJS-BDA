#1: Búsqueda de estudiantes por nombre/email 
CREATE INDEX IF NOT EXISTS idx_students_name_email 
ON students USING gin (
    to_tsvector('spanish', name || ' ' || email)
);

-- Indice alternativo para búsquedas con ILIKE
CREATE INDEX IF NOT EXISTS idx_students_name_lower 
ON students (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_students_email_lower 
ON students (LOWER(email));

#2: Filtrado por periodo (term) en grupos
CREATE INDEX IF NOT EXISTS idx_groups_term 
ON groups (term);

#3: Filtrado por programa en estudiantes
CREATE INDEX IF NOT EXISTS idx_students_program 
ON students (program);


#4: Combinado para enrollments (student + group)
CREATE INDEX IF NOT EXISTS idx_enrollments_student_group 
ON enrollments (student_id, group_id);

#5: Asistencia por enrollment y fecha
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment_date 
ON attendance (enrollment_id, date);

#6: Calificaciones con valores no nulos
CREATE INDEX IF NOT EXISTS idx_grades_final_notnull 
ON grades (enrollment_id, final) 
WHERE final IS NOT NULL;

EXPLAIN ANALYZE
SELECT * FROM vw_students_at_risk 
WHERE LOWER(nombre_estudiante) LIKE '%juan%'
LIMIT 10;

-- CONSULTA 2: Rendimiento de cursos filtrado por periodo
EXPLAIN ANALYZE
SELECT * FROM vw_course_performance 
WHERE periodo = '2024-1'
ORDER BY promedio_general DESC;

-- CONSULTA 3: Ranking de estudiantes por programa
EXPLAIN ANALYZE
SELECT * FROM vw_rank_students 
WHERE programa = 'Ingeniería en Sistemas' 
  AND periodo = '2024-2'
ORDER BY ranking_programa;

-- CONSULTA 4: Carga de docentes con múltiples grupos
EXPLAIN ANALYZE
SELECT * FROM vw_teacher_load 
WHERE numero_grupos >= 2
ORDER BY total_alumnos DESC;

-- CONSULTA 5: Asistencia por grupo en un periodo
EXPLAIN ANALYZE
SELECT * FROM vw_attendance_by_group 
WHERE periodo = '2024-2'
ORDER BY asistencia_promedio_porcentaje ASC;
