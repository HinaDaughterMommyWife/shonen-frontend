'use client';

import { MANGAS } from '@/common/mangas';
import Image from 'next/image';
import { CombinedEntry } from '@/app/resumen2025/analysis';

interface DominationStatsProps {
  combined: CombinedEntry[];
}

export default function DominationStats({ combined }: DominationStatsProps) {
  const mostLoved = [...combined].sort((a, b) => b.favTimesAt1 - a.favTimesAt1).slice(0, 3);
  
  const mostHated = [...combined].sort((a, b) => b.leastTimesAt1 - a.leastTimesAt1).slice(0, 3);

  const StatCard = ({ manga, value, label, gradient }: any) => {
    const mangaData = MANGAS[manga.manga];
    if (!mangaData) return null;

    return (
      <div className={`relative bg-gradient-to-br ${gradient} rounded-2xl p-6 text-white overflow-hidden border border-white/20`}>
        <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full blur-2xl"></div>
        <div className="relative z-10">
          <div className="flex items-center gap-4 mb-4">
            <div className="relative w-16 h-16 rounded-full overflow-hidden ring-4 ring-white/50">
              <Image
                src={mangaData.avatar}
                alt={mangaData.title}
                fill
                className="object-cover"
              />
            </div>
            <div className="flex-1">
              <h4 className="font-bold text-lg line-clamp-2">{mangaData.title}</h4>
            </div>
          </div>
          <div className="bg-white/20 backdrop-blur-sm rounded-xl p-4 text-center border border-white/30">
            <div className="text-4xl font-black mb-1">{value}</div>
            <div className="text-sm uppercase tracking-wider opacity-90">{label}</div>
          </div>
        </div>
      </div>
    );
  };

  return (
    <section className="mb-16">
      <div data-aos="fade-up" data-aos-once="true" data-aos-duration="600">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-yellow-400 to-red-500 bg-clip-text text-transparent">
          👑 Los Extremos
        </h2>
        <p className="text-center text-gray-400 mb-8">
          Los que dominaron en ambos extremos de las votaciones
        </p>
      </div>

      <div className="space-y-8">
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">
            💖 Más veces #1 Favorito
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mostLoved.map((manga, index) => (
              <div
                key={manga.manga}
                data-aos="fade-right"
                data-aos-once="true"
                data-aos-duration="600"
                data-aos-delay={index * 100}
              >
                <StatCard
                  manga={manga}
                  value={manga.favTimesAt1}
                  label="veces #1 favorito"
                  gradient={index === 0 ? 'from-yellow-500 to-orange-600' : 'from-orange-500 to-red-600'}
                />
              </div>
            ))}
          </div>
        </div>
        <div>
          <h3 className="text-2xl font-bold mb-4 text-white">
            💔 Más veces #1 Menos Gustado
          </h3>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {mostHated.map((manga, index) => (
              <div
                key={manga.manga}
                data-aos="fade-right"
                data-aos-once="true"
                data-aos-duration="600"
                data-aos-delay={index * 100}
              >
                <StatCard
                  manga={manga}
                  value={manga.leastTimesAt1}
                  label="veces #1 menos gustado"
                  gradient={index === 0 ? 'from-red-600 to-red-800' : 'from-red-500 to-red-700'}
                />
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
