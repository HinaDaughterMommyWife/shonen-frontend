import { CombinedEntry } from '@/app/resumen2025/analysis';
import TopMangaCard from './TopMangaCard';

interface LeastPopularProps {
  combined: CombinedEntry[];
}

export default function LeastPopular({ combined }: LeastPopularProps) {
  const top10 = [...combined]
    .sort((a, b) => b.leastTimesAt1 - a.leastTimesAt1)
    .slice(0, 9)
    .reverse();

  return (
    <section className="mb-16">
      <div data-aos="fade-up" data-aos-once="true" data-aos-duration="600">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-red-400 to-red-600 bg-clip-text text-transparent">
          💔 Top 9 Más Odiados
        </h2>
        <p className="text-center text-gray-400 mb-4">
          Los que más veces fueron #1 en menos gustados (solo hay 9 mangas en esta categoría)
        </p>
        <p className="text-center text-red-400 text-sm mb-8">⬇️ Del #9 al #1 ⬇️</p>
      </div>

      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {top10.map((entry, index) => {
          const actualRank = 9 - index;
          return (
            <div
              key={entry.manga}
              data-aos="fade-up"
              data-aos-once="true"
              data-aos-duration="600"
              data-aos-delay={index * 50}
            >
              <TopMangaCard
                mangaId={entry.manga}
                rank={actualRank}
                favPoints={entry.favPoints}
                leastPoints={entry.leastPoints}
                favTimesAt1={entry.favTimesAt1}
                leastTimesAt1={entry.leastTimesAt1}
                highlight={'least'}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
