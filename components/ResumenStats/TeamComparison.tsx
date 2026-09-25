'use client';

import { MANGAS } from '@/common/mangas';
import { CombinedEntry } from '@/app/resumen2025/analysis';

interface TeamComparisonProps {
  combined: CombinedEntry[];
}

export default function TeamComparison({ combined }: TeamComparisonProps) {
  // Calculate team stats
  const teamStats = combined.reduce((acc, entry) => {
    const manga = MANGAS[entry.manga];
    if (!manga) return acc;

    const team = manga.team;
    if (!acc[team]) {
      acc[team] = {
        totalNetScore: 0,
        totalFavFirst: 0,
        totalLeastFirst: 0,
        totalFavPoints: 0,
        totalLeastPoints: 0,
        count: 0,
      };
    }

    acc[team].totalNetScore += entry.netPoints;
    acc[team].totalFavFirst += entry.favTimesAt1;
    acc[team].totalLeastFirst += entry.leastTimesAt1;
    acc[team].totalFavPoints += entry.favPoints;
    acc[team].totalLeastPoints += entry.leastPoints;
    acc[team].count += 1;

    return acc;
  }, {} as Record<string, any>);

  const redTeam = teamStats['red'] || {};
  const blueTeam = teamStats['blue'] || {};

  return (
    <section className="mb-16 overflow-hidden">
      <div data-aos="fade-up" data-aos-once="true" data-aos-duration="600">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-red-400 via-purple-400 to-blue-400 bg-clip-text text-transparent">
          ⚔️ Batalla de Equipos
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Equipo Rojo vs Equipo Azul
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div 
          data-aos="fade-right"
          data-aos-once="true"
          data-aos-duration="600"
          className="bg-gradient-to-br from-red-600 to-red-800 rounded-2xl p-8 text-white shadow-2xl border border-red-500/30"
        >
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black mb-2">🔴 EQUIPO ROJO</h3>
            <div className="text-xl opacity-90">{redTeam.count} mangas</div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">Total de Net Score </span>
                <span className={`text-2xl font-bold ${redTeam.totalNetScore >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {redTeam.totalNetScore >= 0 ? '+' : ''}{redTeam.totalNetScore?.toLocaleString()}
                </span>
              </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">Total Puntos mas Gustados</span>
                <span className="text-2xl font-bold text-green-300">{(redTeam.totalFavPoints ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">Total Puntos menos Gustados</span>
                <span className="text-2xl font-bold text-red-300">{(redTeam.totalLeastPoints ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">🥇 Veces #1 Favorito</span>
                <span className="text-2xl font-bold">{redTeam.totalFavFirst}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">💔 Veces #1 Menos Gustado</span> 
                <span className="text-2xl font-bold">{redTeam.totalLeastFirst}</span>
              </div>
            </div>
            
          </div>
        </div>

        <div 
          data-aos="fade-left"
          data-aos-once="true"
          data-aos-duration="600"
          className="bg-gradient-to-br from-blue-600 to-blue-800 rounded-2xl p-8 text-white shadow-2xl border border-blue-500/30"
        >
          <div className="text-center mb-6">
            <h3 className="text-3xl font-black mb-2">🔵 EQUIPO AZUL</h3>
            <div className="text-xl opacity-90">{blueTeam.count} mangas</div>
          </div>

          <div className="space-y-4">
            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">Total de Net Score </span>
                <span className={`text-2xl font-bold ${blueTeam.totalNetScore >= 0 ? 'text-green-300' : 'text-red-300'}`}>
                  {blueTeam.totalNetScore >= 0 ? '+' : ''}{blueTeam.totalNetScore?.toLocaleString()}
                </span>
              </div>
                      </div>
                      
                      <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">Total Puntos mas Gustados</span>
                <span className="text-2xl font-bold text-green-300">{(blueTeam.totalFavPoints ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">Total Puntos menos Gustados</span>
                <span className="text-2xl font-bold text-red-300">{(blueTeam.totalLeastPoints ?? 0).toLocaleString()}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">🥇 Veces #1 Favorito</span>
                <span className="text-2xl font-bold">{blueTeam.totalFavFirst}</span>
              </div>
            </div>

            <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 border border-white/30">
              <div className="flex justify-between items-center">
                <span className="text-sm uppercase tracking-wider">💔 Veces #1 Menos Gustado</span> 
                <span className="text-2xl font-bold">{blueTeam.totalLeastFirst}</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
