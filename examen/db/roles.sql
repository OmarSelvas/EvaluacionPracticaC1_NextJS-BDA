DO $$
BEGIN
    IF NOT EXISTS (SELECT FROM pg_catalog.pg_roles WHERE rolname = 'app') THEN
        CREATE ROLE app WITH LOGIN PASSWORD 'app_password_2024';
    END IF;
END
$$;

ALTER ROLE app WITH NOSUPERUSER NOCREATEDB NOCREATEROLE;
REVOKE ALL ON SCHEMA public FROM app;
REVOKE ALL ON ALL TABLES IN SCHEMA public FROM app;
REVOKE ALL ON ALL SEQUENCES IN SCHEMA public FROM app;
GRANT USAGE ON SCHEMA public TO app;
GRANT CONNECT ON DATABASE postgres TO app;
GRANT SELECT ON vw_course_performance TO app;
GRANT SELECT ON vw_teacher_load TO app;
GRANT SELECT ON vw_students_at_risk TO app;
GRANT SELECT ON vw_attendance_by_group TO app;
GRANT SELECT ON vw_rank_students TO app;

ALTER DEFAULT PRIVILEGES IN SCHEMA public
    GRANT SELECT ON TABLES TO app;
SELECT 
    table_schema,
    table_name,
    privilege_type
FROM information_schema.table_privileges
WHERE grantee = 'app'
ORDER BY table_name;