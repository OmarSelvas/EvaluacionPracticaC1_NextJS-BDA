import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function CoursePerformancePage() {
  const result = await query('SELECT * FROM vw_course_performance');
  const reports = result.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Desempeño por Curso</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Curso</th>
            <th className="border p-2">Periodo</th>
            <th className="border p-2">Total Alumnos</th>
            <th className="border p-2">Promedio</th>
            <th className="border p-2">Tasa Aprobación</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r: any, i: any) => (
            <tr key={i} className="text-center">
              <td className="border p-2">{r.nombre_curso}</td>
              <td className="border p-2">{r.periodo}</td>
              <td className="border p-2">{r.total_estudiantes}</td>
              <td className="border p-2">{r.promedio_general}</td>
              <td className="border p-2">{r.tasa_aprobacion_porcentaje}%</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}