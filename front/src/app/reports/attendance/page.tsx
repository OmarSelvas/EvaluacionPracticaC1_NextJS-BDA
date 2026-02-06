import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function AttendancePage() {
  const result = await query('SELECT * FROM vw_attendance_by_group');
  const reports = result.rows;

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-purple-50 to-pink-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            ✓ Asistencia por Grupo
          </h1>
          <p className="text-gray-600">
            Análisis de asistencia promedio por curso
          </p>
        </div>

        {/* Cards de grupos */}
        <div className="grid gap-6 md:grid-cols-2">
          {reports.map((r: any, i: number) => {
            const asistencia = parseFloat(r.asistencia_promedio_porcentaje);
            const color = asistencia >= 85 ? 'green' : asistencia >= 70 ? 'yellow' : 'red';
            
            return (
              <div
                key={i}
                className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-purple-100"
              >
                {/* Header del curso */}
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-800">
                      {r.nombre_curso}
                    </h3>
                    <p className="text-sm text-gray-600">{r.nombre_docente}</p>
                  </div>
                  <span className="bg-purple-100 text-purple-700 px-3 py-1 rounded-full text-sm font-semibold">
                    {r.periodo}
                  </span>
                </div>

                {/* Asistencia principal */}
                <div className="mb-6">
                  <div className="flex justify-between items-center mb-2">
                    <span className="text-gray-600">Asistencia promedio</span>
                    <span className={`text-3xl font-bold text-${color}-600`}>
                      {r.asistencia_promedio_porcentaje}%
                    </span>
                  </div>
                  <div className="bg-gray-200 h-4 rounded-full overflow-hidden">
                    <div 
                      className={`bg-${color}-400 h-full rounded-full transition-all`}
                      style={{ width: `${r.asistencia_promedio_porcentaje}%` }}
                    />
                  </div>
                </div>

                {/* Stats secundarios */}
                <div className="grid grid-cols-3 gap-3 text-center">
                  <div className="bg-blue-50 rounded-2xl p-3">
                    <p className="text-2xl font-bold text-blue-600">
                      {r.total_estudiantes}
                    </p>
                    <p className="text-xs text-gray-600">Total</p>
                  </div>
                  
                  <div className="bg-green-50 rounded-2xl p-3">
                    <p className="text-2xl font-bold text-green-600">
                      {r.estudiantes_buena_asistencia}
                    </p>
                    <p className="text-xs text-gray-600">Buena</p>
                  </div>
                  
                  <div className="bg-red-50 rounded-2xl p-3">
                    <p className="text-2xl font-bold text-red-600">
                      {r.estudiantes_mala_asistencia}
                    </p>
                    <p className="text-xs text-gray-600">Mala</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}