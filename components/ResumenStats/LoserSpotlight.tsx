'use client';

import { MANGAS } from '@/common/mangas';
import Image from 'next/image';
import { CombinedEntry } from '@/app/resumen2025/analysis';

interface LoserSpotlightProps {
  loser: CombinedEntry;
}

export default function LoserSpotlight({ loser }: LoserSpotlightProps) {
  const manga = MANGAS[loser.manga];
  if (!manga) return null;

  return (
    <section className="mb-16">
      <div
        data-aos="fade-zoom-in"
        data-aos-once="true"
        data-aos-duration="800"
        data-aos-offset="-200"
        className="relative overflow-hidden bg-gradient-to-br from-gray-800 via-red-800 to-red-900 rounded-3xl shadow-2xl p-12 border border-red-500/20"
      >
        <div className="absolute top-0 right-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-white/5 rounded-full blur-3xl"></div>

        <div className="relative z-10">
          <div className="text-center mb-8">
            <h2 className="text-5xl font-black text-white mb-2 drop-shadow-lg">💀 Perdedor del año 💀</h2>
            <p className="text-white/90 text-lg">El manga con el peor Score Total en el Shonen Semanal 2025</p>
          </div>

          <div className="flex flex-col items-center">
            <div className="relative mb-6">
              <div className="absolute inset-0 bg-red-900 rounded-full blur-2xl opacity-30 animate-pulse"></div>
              <div className="relative w-40 h-40 rounded-full overflow-hidden ring-8 ring-white/10 shadow-2xl">
                <Image src={manga.avatar} alt={manga.title} fill className="object-cover" />
              </div>
            </div>

            <h3 className="text-4xl font-black text-white mb-8 drop-shadow-lg text-center">{manga.title}</h3>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-6 w-full max-w-5xl">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-black text-white mb-2">{loser.netPoints.toLocaleString()}</div>
                <div className="text-white/90 text-sm uppercase tracking-wider">Net Score</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-black text-white mb-2">{loser.leastTimesAt1}</div>
                <div className="text-white/90 text-sm uppercase tracking-wider">💔 Veces #1 Menos</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-black text-white mb-2">{loser.leastPoints.toLocaleString()}</div>
                <div className="text-white/90 text-sm uppercase tracking-wider">Puntos Menos Gustados</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-black text-white mb-2">{loser.favPoints.toLocaleString()}</div>
                <div className="text-white/90 text-sm uppercase tracking-wider">Puntos Favoritos</div>
              </div>

              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
                <div className="text-4xl font-black text-white mb-2">#{loser.leastBest}</div>
                <div className="text-white/90 text-sm uppercase tracking-wider">Peor Posición</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
