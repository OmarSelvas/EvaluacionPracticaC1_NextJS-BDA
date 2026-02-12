import { getTeacherLoad } from '@/services/reportservice';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function TeacherLoadPage({
  searchParams,
}: {
  searchParams: { page?: string };
}) {
  const currentPage = Number(searchParams.page) || 1;
  const { data: reports, pagination } = await getTeacherLoad(currentPage);

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-teal-50 to-cyan-50 p-8">
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-end mb-8">
          <div>
            <h1 className="text-4xl font-bold text-teal-600 mb-2">👨‍🏫 Carga Docente</h1>
            <p className="text-gray-600">Visualización paginada de profesores</p>
          </div>
          <div className="text-right">
            <span className="bg-teal-100 text-teal-800 px-3 py-1 rounded-full text-sm font-bold">
              Total: {pagination.total}
            </span>
          </div>
        </div>

        <div className="space-y-4 mb-8">
          {reports.map((r, i) => (
            <div key={i} className="bg-white/80 backdrop-blur rounded-3xl p-6 shadow-lg border-2 border-teal-100 flex justify-between items-center">
              <div className="flex items-center gap-4">
                <div className="bg-teal-500 text-white w-12 h-12 rounded-full flex items-center justify-center font-bold text-xl">
                  {r.nombre_docente.charAt(0)}
                </div>
                <div>
                  <h3 className="font-bold text-gray-800">{r.nombre_docente}</h3>
                  <p className="text-xs text-gray-500">{r.email_docente}</p>
                </div>
              </div>
              <div className="text-center">
                <p className="text-2xl font-bold text-blue-600">{r.total_alumnos}</p>
                <p className="text-xs text-gray-500">Alumnos</p>
              </div>
            </div>
          ))}
        </div>

        {/* Controles de Paginación */}
        <div className="flex justify-center gap-4">
          {currentPage > 1 ? (
            <Link href={`/reports/teacher?page=${currentPage - 1}`} className="bg-white px-6 py-2 rounded-xl shadow hover:bg-gray-50 transition font-bold text-teal-600">
              Anterior
            </Link>
          ) : <div className="w-24"></div>}
          
          <span className="py-2 font-medium text-gray-600">
            {pagination.page} / {pagination.totalPages}
          </span>

          {currentPage < pagination.totalPages ? (
            <Link href={`/reports/teacher?page=${currentPage + 1}`} className="bg-white px-6 py-2 rounded-xl shadow hover:bg-gray-50 transition font-bold text-teal-600">
              Siguiente
            </Link>
          ) : <div className="w-24"></div>}
        </div>
      </div>
    </div>
  );
}