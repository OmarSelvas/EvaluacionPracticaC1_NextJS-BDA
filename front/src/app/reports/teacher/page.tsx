import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function TeacherLoadPage() {
  const result = await query('SELECT * FROM vw_teacher_load');
  const reports = result.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4">Carga de Docentes</h1>
      <table className="min-w-full border">
        <thead>
          <tr className="bg-gray-100">
            <th className="border p-2">Docente</th>
            <th className="border p-2">Grupos</th>
            <th className="border p-2">Total Alumnos</th>
            <th className="border p-2">Créditos Totales</th>
          </tr>
        </thead>
        <tbody>
          {reports.map((r: any, i: any ) => (
            <tr key={i} className="text-center">
              <td className="border p-2 text-left">{r.nombre_docente}</td>
              <td className="border p-2">{r.numero_grupos}</td>
              <td className="border p-2">{r.total_alumnos}</td>
              <td className="border p-2">{r.creditos_totales_impartidos}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}