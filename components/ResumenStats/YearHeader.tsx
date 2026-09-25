import { AnalysisOutput } from '@/app/resumen2025/analysis';

interface YearHeaderProps {
  data: AnalysisOutput;
}

export default function YearHeader({ data }: YearHeaderProps) {
  return (
    <div className="relative w-full overflow-hidden bg-gradient-to-br from-purple-900 via-indigo-900 to-blue-900 rounded-3xl shadow-2xl p-12 mb-12 border border-purple-500/30">
      <div className="absolute inset-0 bg-black/30"></div>
      <div className="relative z-10 text-center text-white">
        <h1 className="text-6xl font-black mb-4 drop-shadow-lg">
          Resumen 2025
        </h1>
        <p className="text-2xl font-semibold mb-2 drop-shadow-md">
          Estadísticas Generales del Año del Shonen Semanal
        </p>
        <div className="flex justify-center gap-8 mt-8">
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
            <div className="text-4xl font-bold">{data.totalWeeks}</div>
            <div className="text-sm uppercase tracking-wider opacity-90">Semanas</div>
          </div>
          <div className="bg-white/10 backdrop-blur-sm rounded-xl px-6 py-4 border border-white/20">
            <div className="text-4xl font-bold">{data.favorite.totalMangas}</div>
            <div className="text-sm uppercase tracking-wider opacity-90">Mangas</div>
          </div>
        </div>
      </div>
    </div>
  );
}
