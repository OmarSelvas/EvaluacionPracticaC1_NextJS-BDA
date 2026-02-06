import Link from 'next/link';

export default function HomePage() {
  const reports = [
    {
      id: 1,
      title: 'Rendimiento por Curso',
      description: 'Análisis de promedios, aprobación y reprobación por curso y periodo',
      href: '/reports/course',
      color: 'bg-blue-50 border-blue-200',
    },
    {
      id: 2,
      title: 'Carga Docente',
      description: 'Grupos, alumnos y promedios por docente en cada periodo',
      href: '/reports/teacher',
      color: 'bg-green-50 border-green-200',
    },
    {
      id: 3,
      title: 'Estudiantes en Riesgo',
      description: 'Identificación de alumnos con bajo rendimiento o asistencia',
      href: '/reports/students',
      color: 'bg-red-50 border-red-200',
    },
    {
      id: 4,
      title: 'Asistencia por Grupo',
      description: 'Análisis de asistencia promedio por grupo y periodo',
      href: '/reports/attendance',
      icon: '✓',
      color: 'bg-purple-50 border-purple-200',
    },
    {
      id: 5,
      title: 'Ranking de Estudiantes',
      description: 'Clasificación de estudiantes por rendimiento académico',
      href: '/reports/RankStudents',
      color: 'bg-yellow-50 border-yellow-200',
    },
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <h1 className="text-3xl font-bold text-gray-900">
            Dashboard Académico
          </h1>
          <p className="mt-2 text-sm text-gray-600">
            Sistema de reportes para coordinación académica
          </p>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Descripción */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold text-gray-800 mb-2">
            Reportes Disponibles
          </h2>
          <p className="text-gray-600">
            Selecciona un reporte para visualizar análisis detallados sobre rendimiento,
            asistencia y desempeño académico.
          </p>
        </div>

        {/* Grid de tarjetas de reportes */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {reports.map((report) => (
            <Link
              key={report.id}
              href={report.href}
              className={`block p-6 rounded-lg border-2 transition-all hover:shadow-lg hover:scale-105 ${report.color}`}
            >
              <div className="flex items-start">
                <div className="text-4xl mr-4">{report.icon}</div>
                <div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">
                    {report.title}
                  </h3>
                  <p className="text-sm text-gray-600">
                    {report.description}
                  </p>
                </div>
              </div>
            </Link>
          ))}
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-gray-200 mt-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <p className="text-center text-sm text-gray-500">
            Dashboard Académico - Evaluación Práctica AWOS y BDA 5°B
          </p>
        </div>
      </footer>
    </div>
  );
}