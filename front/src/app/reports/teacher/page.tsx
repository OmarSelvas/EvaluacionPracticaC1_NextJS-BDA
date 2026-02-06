import { query } from '@/lib/db';
export const dynamic = 'force-dynamic';

export default async function TeacherLoadPage() {
  const result = await query('SELECT * FROM vw_teacher_load');
  const reports = result.rows;

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-teal-600 mb-2">
            👨‍🏫 Carga de Docentes
          </h1>
          <p className="text-gray-600">
            Distribución de grupos y alumnos por docente
          </p>
        </div>

        {/* Lista de docentes */}
        <div className="space-y-4">
          {reports.map((r: any, i: number) => (
            <div
              key={i}
              className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg hover:shadow-xl transition-all border-2 border-teal-100"
            >
              <div className="flex items-center justify-between flex-wrap gap-4">
                {/* Info del docente */}
                <div className="flex items-center gap-4">
                  <div className="bg-gradient-to-br from-teal-400 to-cyan-400 rounded-full w-16 h-16 flex items-center justify-center text-white text-2xl font-bold">
                    {r.nombre_docente.charAt(0)}
                  </div>
                  <div>
                    <h3 className="text-lg font-bold text-gray-800">
                      {r.nombre_docente}
                    </h3>
                    <p className="text-sm text-gray-500">{r.email_docente}</p>
                  </div>
                </div>

                {/* Stats */}
                <div className="flex gap-6">
                  <div className="text-center">
                    <div className="bg-blue-100 rounded-2xl px-4 py-2">
                      <p className="text-2xl font-bold text-blue-600">
                        {r.numero_grupos}
                      </p>
                      <p className="text-xs text-gray-600">Grupos</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-purple-100 rounded-2xl px-4 py-2">
                      <p className="text-2xl font-bold text-purple-600">
                        {r.total_alumnos}
                      </p>
                      <p className="text-xs text-gray-600">Alumnos</p>
                    </div>
                  </div>
                  
                  <div className="text-center">
                    <div className="bg-green-100 rounded-2xl px-4 py-2">
                      <p className="text-2xl font-bold text-green-600">
                        {r.creditos_totales_impartidos}
                      </p>
                      <p className="text-xs text-gray-600">Créditos</p>
                    </div>
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