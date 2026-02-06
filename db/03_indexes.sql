--1: Búsqueda de estudiantes por nombre/email 
CREATE INDEX IF NOT EXISTS idx_students_name_email 
ON students USING gin (
    to_tsvector('spanish', name || ' ' || email)
);

-- Indice alternativo para búsquedas con ILIKE
CREATE INDEX IF NOT EXISTS idx_students_name_lower 
ON students (LOWER(name));
CREATE INDEX IF NOT EXISTS idx_students_email_lower 
ON students (LOWER(email));

--2: Filtrado por periodo (term) en grupos
CREATE INDEX IF NOT EXISTS idx_groups_term 
ON groups (term);

--3: Filtrado por programa en estudiantes
CREATE INDEX IF NOT EXISTS idx_students_program 
ON students (program);


--4: Combinado para enrollments (student + group)
CREATE INDEX IF NOT EXISTS idx_enrollments_student_group 
ON enrollments (student_id, group_id);

--5: Asistencia por enrollment y fecha
CREATE INDEX IF NOT EXISTS idx_attendance_enrollment_date 
ON attendance (enrollment_id, date);

--6: Calificaciones con valores no nulos
CREATE INDEX IF NOT EXISTS idx_grades_final_notnull 
ON grades (enrollment_id, final) 
WHERE final IS NOT NULL;

