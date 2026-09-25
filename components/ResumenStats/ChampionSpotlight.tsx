'use client';

import { MANGAS } from '@/common/mangas';
import Image from 'next/image';
import { CombinedEntry } from '@/app/resumen2025/analysis';

interface ChampionSpotlightProps {
  champion: CombinedEntry;
}

export default function ChampionSpotlight({ champion }: ChampionSpotlightProps) {
  const manga = MANGAS[champion.manga];
  
  if (!manga) return null;

  return (
    <section className="mb-16">
      <div 
        data-aos="fade-zoom-in" 
        data-aos-once="true" 
              data-aos-duration="800"
              data-aos-offset="-200"
        className="relative overflow-hidden bg-gradient-to-br from-yellow-600 via-orange-600 to-red-700 rounded-3xl shadow-2xl p-12 border border-yellow-500/30"
      >
        {/* Decorative elements */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/10 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-white mb-2 drop-shadow-lg">
              🏆 Campeón del Año 🏆
            </h2>
            <p className="text-white/90 text-lg">
              El manga con el mejor Score Total en el Shonen Semanal 2025
            </p>
          </div>

          <div className="flex flex-col items-center">
            {/* Avatar with glow */}
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-yellow-300 rounded-full blur-2xl opacity-50 animate-pulse"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden ring-8 ring-white shadow-2xl">
                <Image
                  src={manga.avatar}
                  alt={manga.title}
                  fill
                  className="object-cover"
                />
              </div>
            </div>

            {/* Title */}
            <h3 className="text-4xl font-black text-white mb-8 drop-shadow-lg text-center">
              {manga.title}
            </h3>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl">
              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <div className="text-4xl font-black text-white mb-2">
                  +{champion.netPoints.toLocaleString()}
                </div>
                <div className="text-white/90 text-sm uppercase tracking-wider">
                  Net Score
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <div className="text-4xl font-black text-white mb-2">
                  {champion.favTimesAt1}
                </div>
                <div className="text-white/90 text-sm uppercase tracking-wider">
                  🥇 Veces #1
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <div className="text-4xl font-black text-white mb-2">
                  {champion.favPoints.toLocaleString()}
                </div>
                <div className="text-white/90 text-sm uppercase tracking-wider">
                  Puntos Favoritos
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <div className="text-4xl font-black text-white mb-2">
                  {champion.leastPoints.toLocaleString()}
                </div>
                <div className="text-white/90 text-sm uppercase tracking-wider">
                  Puntos Menos Gustados
                </div>
              </div>

              <div className="bg-white/20 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/30">
                <div className="text-4xl font-black text-white mb-2">
                  #{champion.favBest}
                </div>
                <div className="text-white/90 text-sm uppercase tracking-wider">
                  Mejor Posición
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
