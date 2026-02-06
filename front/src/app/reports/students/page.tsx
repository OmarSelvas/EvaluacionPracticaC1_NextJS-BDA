import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function StudentsAtRiskPage() {
  const result = await query('SELECT * FROM vw_students_at_risk');
  const reports = result.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-red-600">Alumnos en Riesgo</h1>
      <div className="grid gap-4">
        {reports.map((s: any, i: any) => (
          <div key={i} className="border p-4 rounded shadow-sm bg-white">
            <p className="font-bold">{s.nombre_estudiante} ({s.programa})</p>
            <p>Promedio: <span className="text-blue-600">{s.promedio_final}</span></p>
            <p>Asistencia: {s.porcentaje_asistencia}%</p>
            <p className="mt-2 font-semibold text-orange-600">Nivel: {s.nivel_riesgo}</p>
          </div>
        ))}
      </div>
    </div>
  );
}