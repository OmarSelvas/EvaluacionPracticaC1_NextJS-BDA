--1 
-- Esta vista sirve para saber donde reprueban mas los alumnos
-- y cuáles tienen mejor promedio
CREATE OR REPLACE VIEW vw_course_performance AS
SELECT 
    c.id AS course_id,
    c.code AS codigo_curso,
    c.name AS nombre_curso,
    g.term AS periodo,
    s.program AS programa,
    COUNT(DISTINCT e.student_id) AS total_estudiantes,
    ROUND(AVG(gr.final), 2) AS promedio_general,
    COUNT(CASE WHEN gr.final >= 70 THEN 1 END) AS estudiantes_aprobados,
    COUNT(CASE WHEN gr.final < 70 THEN 1 END) AS estudiantes_reprobados,
    ROUND(
        COUNT(CASE WHEN gr.final >= 70 THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(DISTINCT e.student_id), 0) * 100, 
        2
    ) AS tasa_aprobacion_porcentaje
FROM courses c
INNER JOIN groups g ON c.id = g.course_id
INNER JOIN enrollments e ON g.id = e.group_id
INNER JOIN students s ON e.student_id = s.id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
GROUP BY c.id, c.code, c.name, g.term, s.program
ORDER BY g.term DESC, promedio_general DESC;

--2 
-- que tan cargado está un profesor
CREATE OR REPLACE VIEW vw_teacher_load AS
SELECT 
    t.id AS teacher_id,
    t.name AS nombre_docente,
    t.email AS email_docente,
    g.term AS periodo,
    COUNT(DISTINCT g.id) AS numero_grupos,
    COUNT(DISTINCT e.student_id) AS total_alumnos,
    ROUND(AVG(gr.final), 2) AS promedio_general_alumnos,
    COALESCE(SUM(c.credits), 0) AS creditos_totales_impartidos
FROM teachers t
INNER JOIN groups g ON t.id = g.teacher_id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN grades gr ON e.id = gr.enrollment_id
LEFT JOIN courses c ON g.course_id = c.id
GROUP BY t.id, t.name, t.email, g.term
HAVING COUNT(DISTINCT g.id) >= 1  
ORDER BY g.term DESC, total_alumnos DESC;

--3
-- Identifica alumnos que necesitan ayuda
CREATE OR REPLACE VIEW vw_students_at_risk AS
WITH student_performance AS (
    SELECT 
        s.id AS student_id,
        s.name AS nombre_estudiante,
        s.email AS email_estudiante,
        s.program AS programa,
        s.enrollment_year AS anio_ingreso,
        ROUND(AVG(gr.final), 2) AS promedio_final,
        COUNT(gr.id) AS total_materias
    FROM students s
    LEFT JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    GROUP BY s.id, s.name, s.email, s.program, s.enrollment_year
),
student_attendance AS (
    SELECT 
        s.id AS student_id,
        COUNT(a.id) AS total_clases,
        COUNT(CASE WHEN a.present = true THEN 1 END) AS clases_asistidas,
        ROUND(
            COUNT(CASE WHEN a.present = true THEN 1 END)::NUMERIC / 
            NULLIF(COUNT(a.id), 0) * 100,
            2
        ) AS porcentaje_asistencia
    FROM students s
    LEFT JOIN enrollments e ON s.id = e.student_id
    LEFT JOIN attendance a ON e.id = a.enrollment_id
    GROUP BY s.id
)
SELECT 
    sp.student_id,
    sp.nombre_estudiante,
    sp.email_estudiante,
    sp.programa,
    sp.anio_ingreso,
    sp.promedio_final,
    sp.total_materias,
    COALESCE(sa.porcentaje_asistencia, 0) AS porcentaje_asistencia,
    CASE 
        WHEN sp.promedio_final < 70 AND COALESCE(sa.porcentaje_asistencia, 0) < 70 THEN 'Riesgo Alto - Rendimiento y Asistencia'
        WHEN sp.promedio_final < 70 THEN 'Riesgo Alto - Rendimiento Académico'
        WHEN COALESCE(sa.porcentaje_asistencia, 0) < 70 THEN 'Riesgo Medio - Baja Asistencia'
        WHEN sp.promedio_final < 80 AND COALESCE(sa.porcentaje_asistencia, 0) < 85 THEN 'Riesgo Bajo - Monitorear'
        ELSE 'Sin Riesgo'
    END AS nivel_riesgo
FROM student_performance sp
LEFT JOIN student_attendance sa ON sp.student_id = sa.student_id
WHERE 
    sp.promedio_final < 80 
    OR COALESCE(sa.porcentaje_asistencia, 0) < 85
ORDER BY 
    CASE 
        WHEN sp.promedio_final < 70 AND COALESCE(sa.porcentaje_asistencia, 0) < 70 THEN 1
        WHEN sp.promedio_final < 70 THEN 2
        WHEN COALESCE(sa.porcentaje_asistencia, 0) < 70 THEN 3
        ELSE 4
    END,
    sp.promedio_final ASC;


--4 analiza asistencia por grupo
CREATE OR REPLACE VIEW vw_attendance_by_group AS
SELECT 
    g.id AS group_id,
    c.code AS codigo_curso,
    c.name AS nombre_curso,
    t.name AS nombre_docente,
    g.term AS periodo,
    COUNT(DISTINCT e.student_id) AS total_estudiantes,
    COUNT(a.id) AS total_registros_asistencia,
    COUNT(CASE WHEN a.present = true THEN 1 END) AS total_asistencias,
    ROUND(
        COUNT(CASE WHEN a.present = true THEN 1 END)::NUMERIC / 
        NULLIF(COUNT(a.id), 0) * 100,
        2
    ) AS asistencia_promedio_porcentaje,
    COUNT(DISTINCT CASE 
        WHEN (
            SELECT COUNT(CASE WHEN a2.present THEN 1 END)::NUMERIC / NULLIF(COUNT(a2.id), 0) * 100
            FROM attendance a2
            WHERE a2.enrollment_id = e.id
        ) >= 85 THEN e.student_id
    END) AS estudiantes_buena_asistencia,
    COUNT(DISTINCT CASE 
        WHEN (
            SELECT COUNT(CASE WHEN a2.present THEN 1 END)::NUMERIC / NULLIF(COUNT(a2.id), 0) * 100
            FROM attendance a2
            WHERE a2.enrollment_id = e.id
        ) < 70 THEN e.student_id
    END) AS estudiantes_mala_asistencia
FROM groups g
INNER JOIN courses c ON g.course_id = c.id
INNER JOIN teachers t ON g.teacher_id = t.id
LEFT JOIN enrollments e ON g.id = e.group_id
LEFT JOIN attendance a ON e.id = a.enrollment_id
GROUP BY g.id, c.code, c.name, t.name, g.term
HAVING COUNT(DISTINCT e.student_id) > 0  -- Solo grupos con estudiantes
ORDER BY g.term DESC, asistencia_promedio_porcentaje ASC;

--5 Ranking de estudiantes por programa y periodo
CREATE OR REPLACE VIEW vw_rank_students AS
WITH student_term_performance AS (
    SELECT 
        s.id AS student_id,
        s.name AS nombre_estudiante,
        s.email AS email_estudiante,
        s.program AS programa,
        g.term AS periodo,
        ROUND(AVG(gr.final), 2) AS promedio_periodo,
        COUNT(gr.id) AS materias_cursadas
    FROM students s
    INNER JOIN enrollments e ON s.id = e.student_id
    INNER JOIN groups g ON e.group_id = g.id
    LEFT JOIN grades gr ON e.id = gr.enrollment_id
    WHERE gr.final IS NOT NULL
    GROUP BY s.id, s.name, s.email, s.program, g.term
)
SELECT 
    student_id,
    nombre_estudiante,
    email_estudiante,
    programa,
    periodo,
    promedio_periodo,
    materias_cursadas,
    RANK() OVER (
        PARTITION BY programa, periodo 
        ORDER BY promedio_periodo DESC
    ) AS ranking_programa,
    ROW_NUMBER() OVER (
        PARTITION BY programa, periodo 
        ORDER BY promedio_periodo DESC
    ) AS posicion_programa,
    CASE 
        WHEN RANK() OVER (PARTITION BY programa, periodo ORDER BY promedio_periodo DESC) <= 3 THEN 'Excelencia Académica'
        WHEN promedio_periodo >= 85 THEN 'Rendimiento Sobresaliente'
        WHEN promedio_periodo >= 75 THEN 'Rendimiento Satisfactorio'
        WHEN promedio_periodo >= 70 THEN 'Rendimiento Mínimo Aceptable'
        ELSE 'Bajo Rendimiento'
    END AS clasificacion_rendimiento,
    ROUND(
        promedio_periodo - AVG(promedio_periodo) OVER (PARTITION BY programa, periodo),
        2
    ) AS diferencia_vs_promedio_programa
FROM student_term_performance
ORDER BY programa, periodo DESC, ranking_programa;