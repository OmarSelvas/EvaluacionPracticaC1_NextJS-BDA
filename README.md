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
