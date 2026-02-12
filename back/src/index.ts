import express from 'express';
import cors from 'cors';
import { pool } from './db';
import { z } from 'zod'; 

const app = express();
app.use(cors());
app.use(express.json());

const QuerySchema = z.object({
  page: z.coerce.number().min(1).default(1),
  limit: z.coerce.number().min(1).max(100).default(10),
  search: z.string().optional(),
  term: z.string().regex(/^\d{4}-\d$/, "Formato inválido (ej: 2024-1)").optional(),
});

const getReport = async (req: any, res: any, view: string, filterColumn?: string) => {
  try {
    const validation = QuerySchema.safeParse(req.query);
    
    if (!validation.success) {
      return res.status(400).json({ 
        error: 'Datos inválidos', 
        details: validation.error.format() 
      });
    }

    const { page, limit, search, term } = validation.data;
    const offset = (page - 1) * limit;
    const params: any[] = [];
    let query = `SELECT * FROM ${view}`;
    let countQuery = `SELECT COUNT(*) FROM ${view}`;
    let whereClauses = [];

    if (term) {
      params.push(term);
      whereClauses.push(`periodo = $${params.length}`);
    }

    if (search && filterColumn) {
      params.push(`%${search}%`);
      whereClauses.push(`${filterColumn} ILIKE $${params.length}`);
    }

    if (whereClauses.length > 0) {
      const where = ' WHERE ' + whereClauses.join(' AND ');
      query += where;
      countQuery += where;
    }

    query += ` LIMIT ${limit} OFFSET ${offset}`;

    const dataResult = await pool.query(query, params);
    const countResult = await pool.query(countQuery, params.slice(0, whereClauses.length));

    res.json({
      data: dataResult.rows,
      pagination: {
        total: parseInt(countResult.rows[0].count),
        page,
        limit,
        totalPages: Math.ceil(parseInt(countResult.rows[0].count) / limit)
      }
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno o de permisos' }); 
  }
};
app.get('/api/reports/course', (req, res) => getReport(req, res, 'vw_course_performance'));
app.get('/api/reports/teacher', (req, res) => getReport(req, res, 'vw_teacher_load'));
app.get('/api/reports/students', (req, res) => getReport(req, res, 'vw_students_at_risk', 'nombre_estudiante'));
app.get('/api/reports/attendance', (req, res) => getReport(req, res, 'vw_attendance_by_group'));
app.get('/api/reports/rank', (req, res) => getReport(req, res, 'vw_rank_students'));

app.listen(4000, () => console.log('🚀 Backend Seguro (Zod + AppUser) corriendo'));