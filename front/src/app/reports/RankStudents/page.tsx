import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function RankingPage() {
  const result = await query('SELECT * FROM vw_rank_students');
  const reports = result.rows;

  return (
    <div className="p-8">
      <h1 className="text-2xl font-bold mb-4 text-indigo-700">Ranking por Programa</h1>
      <div className="overflow-x-auto">
        <table className="min-w-full border border-collapse">
          <thead>
            <tr className="bg-indigo-50">
              <th className="border p-2">Pos</th>
              <th className="border p-2">Estudiante</th>
              <th className="border p-2">Programa</th>
              <th className="border p-2">Promedio</th>
              <th className="border p-2">Clasificación</th>
            </tr>
          </thead>
          <tbody>
            {reports.map((r: any, i: any) => (
              <tr key={i} className="hover:bg-gray-50 text-center">
                <td className="border p-2 font-bold">#{r.posicion_programa}</td>
                <td className="border p-2 text-left">{r.nombre_estudiante}</td>
                <td className="border p-2">{r.programa}</td>
                <td className="border p-2">{r.promedio_periodo}</td>
                <td className="border p-2 italic text-sm">{r.clasificacion_rendimiento}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}