import express from 'express';
import cors from 'cors';
import { pool } from './db';

const app = express();
app.use(cors());
app.use(express.json());

const getReport = async (req: any, res: any, view: string) => {
  try {
    const { rows } = await pool.query(`SELECT * FROM ${view}`);
    res.json(rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Error interno del servidor' });
  }
};

app.get('/api/reports/course', (req, res) => getReport(req, res, 'vw_course_performance'));
app.get('/api/reports/teacher', (req, res) => getReport(req, res, 'vw_teacher_load'));
app.get('/api/reports/students', (req, res) => getReport(req, res, 'vw_students_at_risk'));
app.get('/api/reports/attendance', (req, res) => getReport(req, res, 'vw_attendance_by_group'));

app.get('/api/reports/rank', async (req, res) => {
  try {
    const { rows } = await pool.query('SELECT * FROM vw_rank_students ORDER BY programa, posicion_programa');
    res.json(rows);
  } catch (err) { res.status(500).json(err); }
});

app.listen(4000, () => console.log('🚀 Backend corriendo en puerto 4000'));