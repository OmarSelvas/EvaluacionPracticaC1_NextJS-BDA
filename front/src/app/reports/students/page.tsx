import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function StudentsAtRiskPage() {
  const result = await query('SELECT * FROM vw_students_at_risk');
  const reports = result.rows;

  const getRiskColor = (nivel: string) => {
    if (nivel.includes('Alto')) return 'from-red-400 to-pink-400';
    if (nivel.includes('Medio')) return 'from-orange-400 to-yellow-400';
    if (nivel.includes('Bajo')) return 'from-yellow-300 to-green-300';
    return 'from-green-400 to-teal-400';
  };

  const getRiskBg = (nivel: string) => {
    if (nivel.includes('Alto')) return 'bg-red-50 border-red-200';
    if (nivel.includes('Medio')) return 'bg-orange-50 border-orange-200';
    if (nivel.includes('Bajo')) return 'bg-yellow-50 border-yellow-200';
    return 'bg-green-50 border-green-200';
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 via-orange-50 to-yellow-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-red-600 mb-2">
            Estudiantes en Riesgo
          </h1>
          <p className="text-gray-600">
            Alumnos que requieren atención por bajo rendimiento o asistencia
          </p>
        </div>

        {/* Grid de estudiantes */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((s: any, i: number) => (
            <div
              key={i}
              className={`rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 ${getRiskBg(s.nivel_riesgo)}`}
            >
              {/* Badge de riesgo */}
              <div className={`bg-gradient-to-r ${getRiskColor(s.nivel_riesgo)} text-white rounded-full px-4 py-2 inline-block mb-4 text-sm font-semibold`}>
                {s.nivel_riesgo}
              </div>

              {/* Info del estudiante */}
              <h3 className="text-lg font-bold text-gray-800 mb-1">
                {s.nombre_estudiante}
              </h3>
              <p className="text-sm text-gray-600 mb-4">{s.programa}</p>

              {/* Métricas */}
              <div className="space-y-3">
                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Promedio</span>
                    <span className="font-semibold text-blue-600">
                      {s.promedio_final}
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-blue-400 h-full rounded-full"
                      style={{ width: `${s.promedio_final}%` }}
                    />
                  </div>
                </div>

                <div>
                  <div className="flex justify-between text-sm mb-1">
                    <span className="text-gray-600">Asistencia</span>
                    <span className="font-semibold text-green-600">
                      {s.porcentaje_asistencia}%
                    </span>
                  </div>
                  <div className="bg-gray-200 h-2 rounded-full overflow-hidden">
                    <div 
                      className="bg-green-400 h-full rounded-full"
                      style={{ width: `${s.porcentaje_asistencia}%` }}
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}