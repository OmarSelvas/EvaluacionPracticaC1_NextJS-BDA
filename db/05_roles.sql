CREATE USER academic_app WITH PASSWORD 'app_secure_password';

GRANT CONNECT ON DATABASE academic_db TO academic_app;
GRANT USAGE ON SCHEMA public TO academic_app;

GRANT SELECT ON vw_course_performance TO academic_app;
GRANT SELECT ON vw_teacher_load TO academic_app;
GRANT SELECT ON vw_students_at_risk TO academic_app;
GRANT SELECT ON vw_attendance_by_group TO academic_app;
GRANT SELECT ON vw_rank_students TO academic_app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public GRANT SELECT ON TABLES TO academic_app;