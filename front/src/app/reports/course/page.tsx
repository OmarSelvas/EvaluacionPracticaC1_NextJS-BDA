import { getCoursePerformance } from '@/services/reportservice';

export const dynamic = 'force-dynamic';

export default async function CoursePerformancePage({
  searchParams,
}: {
  searchParams: { term?: string };
}) {
  const term = searchParams.term || '';
    const { data: reports } = await getCoursePerformance(term);
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-pink-50 to-blue-50 p-8">
      <div className="max-w-7xl mx-auto">
        
        {/* Header y Filtro */}
        <div className="flex flex-col md:flex-row justify-between items-center mb-8 gap-4">
          <div>
            <h1 className="text-4xl font-bold text-purple-600 mb-2">
              Desempeño por Curso
            </h1>
            <p className="text-gray-600">
              Análisis de rendimiento académico por curso y periodo
            </p>
          </div>

          {/* Filtro por Periodo (Term) */}
          <form className="flex gap-2 w-full md:w-auto">
            <input 
              name="term"
              defaultValue={term}
              placeholder="Filtrar por periodo (ej: 2024-1)"
              className="px-4 py-2 rounded-xl border-2 border-purple-100 focus:border-purple-400 outline-none w-full md:w-64 text-gray-700"
            />
            <button 
              type="submit" 
              className="bg-purple-500 text-white px-6 py-2 rounded-xl font-bold hover:bg-purple-600 transition shadow-md"
            >
              Filtrar
            </button>
            {term && (
              <a href="/reports/course" className="bg-gray-200 text-gray-600 px-4 py-2 rounded-xl font-bold hover:bg-gray-300 transition flex items-center">
                ✕
              </a>
            )}
          </form>
        </div>

        {/* Estado vacío */}
        {reports.length === 0 ? (
          <div className="text-center py-20 bg-white/50 rounded-3xl border-2 border-dashed border-purple-200">
            <p className="text-xl text-gray-500">No se encontraron cursos para el criterio seleccionado.</p>
          </div>
        ) : (
          /* Cards Grid */
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
            {reports.map((r, i) => (
              <div
                key={i}
                className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all hover:scale-105 border-2 border-purple-100 group"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="bg-purple-100 text-purple-600 rounded-2xl p-3 group-hover:bg-purple-500 group-hover:text-white transition-colors">
                    <span className="text-2xl">📚</span>
                  </div>
                  <span className="bg-blue-100 text-blue-700 px-3 py-1 rounded-full text-sm font-bold">
                    {r.periodo}
                  </span>
                </div>
                
                <h3 className="text-lg font-bold text-gray-800 mb-2 line-clamp-1" title={r.nombre_curso}>
                  {r.nombre_curso}
                </h3>
                
                <div className="space-y-3 text-sm mt-4">
                  <div className="flex justify-between items-center bg-purple-50 p-2 rounded-lg">
                    <span className="text-gray-600 font-medium">Total alumnos</span>
                    <span className="font-bold text-purple-700 text-lg">
                      {r.total_estudiantes}
                    </span>
                  </div>
                  
                  <div className="flex justify-between items-center px-1">
                    <span className="text-gray-500">Promedio General</span>
                    <span className="font-bold text-blue-600 text-base">
                      {Number(r.promedio_general).toFixed(1)}
                    </span>
                  </div>
                  
                  <div className="pt-2 border-t border-gray-100">
                    <div className="flex justify-between items-center mb-1">
                      <span className="text-gray-500 text-xs uppercase font-bold tracking-wide">Tasa de Aprobación</span>
                      <span className={`font-bold ${Number(r.tasa_aprobacion_porcentaje) > 70 ? 'text-green-600' : 'text-red-500'}`}>
                        {r.tasa_aprobacion_porcentaje}%
                      </span>
                    </div>
                    <div className="bg-gray-200 h-2 rounded-full overflow-hidden w-full">
                      <div 
                        className={`h-full rounded-full transition-all duration-1000 ${Number(r.tasa_aprobacion_porcentaje) > 70 ? 'bg-green-400' : 'bg-red-400'}`}
                        style={{ width: `${r.tasa_aprobacion_porcentaje}%` }}
                      />
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}