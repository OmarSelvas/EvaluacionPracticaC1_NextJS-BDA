import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function CoursePerformancePage() {
  const result = await query('SELECT * FROM vw_course_performance');
  const reports = result.rows;

  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-purple-600 mb-2">
            Desempeño por Curso
          </h1>
          <p className="text-gray-600">
            Análisis de rendimiento académico por curso y periodo
          </p>
        </div>

        {/* Cards Grid */}
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reports.map((r: any, i: number) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-purple-100"
            >
              <div className="flex items-start justify-between mb-4">
                <div className="bg-purple-100 rounded-full p-3">
                  <span className="text-2xl">📚</span>
                </div>
                <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-semibold">
                  {r.periodo}
                </span>
              </div>
              
              <h3 className="text-lg font-bold text-gray-800 mb-2">
                {r.nombre_curso}
              </h3>
              
              <div className="space-y-2 text-sm">
                <div className="flex justify-between">
                  <span className="text-gray-600">Total alumnos:</span>
                  <span className="font-semibold text-purple-600">
                    {r.total_estudiantes}
                  </span>
                </div>
                
                <div className="flex justify-between">
                  <span className="text-gray-600">Promedio:</span>
                  <span className="font-semibold text-blue-600">
                    {r.promedio_general}
                  </span>
                </div>
                
                <div className="flex justify-between items-center">
                  <span className="text-gray-600">Aprobación:</span>
                  <div className="flex items-center gap-2">
                    <div className="bg-green-100 w-20 h-2 rounded-full overflow-hidden">
                      <div 
                        className="bg-green-400 h-full rounded-full"
                        style={{ width: `${r.tasa_aprobacion_porcentaje}%` }}
                      />
                    </div>
                    <span className="font-semibold text-green-600">
                      {r.tasa_aprobacion_porcentaje}%
                    </span>
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