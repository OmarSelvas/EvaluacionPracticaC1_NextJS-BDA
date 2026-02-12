import Link from 'next/link';

export default function Home() {
  const menuItems = [
    {
      title: "Desempeño por Curso",
      description: "Análisis de rendimiento, promedios y tasas de aprobación.",
      href: "/reports/course",
      icon: "📚",
      color: "purple"
    },
    {
      title: "Carga Docente",
      description: "Grupos, alumnos y créditos impartidos por profesor.",
      href: "/reports/teacher",
      icon: "👨‍🏫",
      color: "teal"
    },
    {
      title: "Estudiantes en Riesgo",
      description: "Alumnos con bajo promedio o problemas de asistencia.",
      href: "/reports/students",
      icon: "🚨",
      color: "red"
    },
    {
      title: "Asistencia por Grupo",
      description: "Monitoreo de asistencia promedio por clase.",
      href: "/reports/attendance",
      icon: "✅",
      color: "indigo"
    },
    {
      title: "Ranking Estudiantil",
      description: "Top estudiantes destacados por programa académico.",
      href: "/reports/RankStudents",
      icon: "🏆",
      color: "amber"
    }
  ];

  const getColorClasses = (color: string) => {
    const colors: { [key: string]: string } = {
      purple: "bg-purple-50 text-purple-600 border-purple-200 hover:border-purple-400",
      teal: "bg-teal-50 text-teal-600 border-teal-200 hover:border-teal-400",
      red: "bg-red-50 text-red-600 border-red-200 hover:border-red-400",
      indigo: "bg-indigo-50 text-indigo-600 border-indigo-200 hover:border-indigo-400",
      amber: "bg-amber-50 text-amber-600 border-amber-200 hover:border-amber-400",
    };
    return colors[color] || colors.purple;
  };

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 via-gray-100 to-gray-200 p-8">
      <div className="max-w-7xl mx-auto">
        {/* Header Principal */}
        <div className="text-center mb-16 pt-8">
          <h1 className="text-5xl font-extrabold text-gray-800 mb-4 tracking-tight">
            Sistema de Gestión <span className="text-blue-600">Académica</span>
          </h1>
          <p className="text-xl text-gray-600 max-w-2xl mx-auto">
            Panel de control para la visualización de métricas, reportes de rendimiento y seguimiento escolar.
          </p>
        </div>

        {/* Grid de Navegación */}
        <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
          {menuItems.map((item, index) => (
            <Link 
              href={item.href} 
              key={index}
              className={`group relative p-8 rounded-3xl border-2 transition-all duration-300 hover:-translate-y-2 hover:shadow-xl bg-white ${getColorClasses(item.color).split(' ')[2]} ${getColorClasses(item.color).split(' ')[3]}`}
            >
              <div className={`absolute top-6 right-6 w-16 h-16 rounded-2xl flex items-center justify-center text-3xl mb-4 transition-transform group-hover:scale-110 ${getColorClasses(item.color).split(' ')[0]} ${getColorClasses(item.color).split(' ')[1]}`}>
                {item.icon}
              </div>
              
              <div className="mt-4">
                <h2 className="text-2xl font-bold text-gray-800 mb-3 group-hover:text-blue-600 transition-colors">
                  {item.title}
                </h2>
                <p className="text-gray-500 font-medium leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="mt-8 flex items-center text-sm font-bold uppercase tracking-wider text-gray-400 group-hover:text-blue-600 transition-colors">
                Ver reporte
                <svg className="w-4 h-4 ml-2 transform group-hover:translate-x-1 transition-transform" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8l4 4m0 0l-4 4m4-4H3" />
                </svg>
              </div>
            </Link>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 text-center text-gray-400 text-sm">
          <p>© 2024 Plataforma Académica • Arquitectura Orientada a Servicios</p>
        </div>
      </div>
    </main>
  );
}