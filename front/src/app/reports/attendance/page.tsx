import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
  const result = await query('SELECT * FROM vw_attendance_by_group');
  const reports = result.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Reporte de Asistencia</h1>
      <table className="min-w-full border text-sm">
        <thead>
          <tr className="bg-gray-100 text-left">
            <th className="border p-2">Curso</th>
            <th className="border p-2">Docente</th>
            <th className="border p-2">Asistencia Promedio</th>
            <th className="border p-2">Mala Asistencia (Cant.)</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r: any, i: any) => (
            <tr key={i}>
              <td className="border p-2">{r.nombre_curso}</td>
              <td className="border p-2">{r.nombre_docente}</td>
              <td className="border p-2 font-bold">{r.asistencia_promedio_porcentaje}%</td>
              <td className="border p-2 text-red-500">{r.estudiantes_mala_asistencia} alumnos</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}