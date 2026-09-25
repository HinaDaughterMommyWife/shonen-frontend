import { CombinedEntry } from '@/app/resumen2025/analysis';
import TopMangaCard from './TopMangaCard';

interface MostPopularProps {
  combined: CombinedEntry[];
}

export default function MostPopular({ combined }: MostPopularProps) {
  const top10 = [...combined]
    .sort((a, b) => b.favTimesAt1 - a.favTimesAt1)
    .slice(0, 10)
    .reverse();

  return (
    <section className="mb-16 mt-60">
      <div data-aos="fade-up" data-aos-once="true" data-aos-duration="600">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-yellow-400 to-orange-400 bg-clip-text text-transparent">
          🥇 Top 10 Más Gustados
        </h2>
        <p className="text-center text-gray-400 mb-4">Los que más veces fueron #1 en favoritos</p>
        <p className="text-center text-yellow-400 text-sm mb-8">⬇️ Del #10 al #1 ⬇️</p>
      </div>

      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {top10.map((entry, index) => {
          const actualRank = 10 - index;
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
                      highlight={'favorite'}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
