import { CombinedEntry } from '@/app/resumen2025/analysis';
import TopMangaCard from './TopMangaCard';

interface TopFavoritesProps {
  combined: CombinedEntry[];
}

export default function TopFavorites({ combined }: TopFavoritesProps) {
  const top = [...combined].sort((a, b) => b.netPoints - a.netPoints).reverse();

  return (
    <section className="mb-16 mt-36">
      <div data-aos="fade-up" data-aos-once="true" data-aos-duration="600">
        <h2 className="text-4xl font-black text-center mb-4 bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">
          Top Total por Net Score
        </h2>
        <p className="text-center text-gray-400 mb-4">
          Todos los mangas ordenados por su Net Score total (Favoritos - Menos Gustados)
        </p>
      </div>

      <div className="flex flex-col gap-4 max-w-5xl mx-auto">
        {top.map((entry, index) => {
          const actualRank = top.length - index;
          return (
            <div
              key={entry.manga}
              data-aos="fade-up"
              data-aos-once="true"
              data-aos-duration="600"
              data-aos-delay={index * 50}
            >
              <TopMangaCard
                upperName
                mangaId={entry.manga}
                rank={actualRank}
                netPoints={entry.netPoints}
                favPoints={entry.favPoints}
                leastPoints={entry.leastPoints}
                favTimesAt1={entry.favTimesAt1}
                leastTimesAt1={entry.leastTimesAt1}
                bestRank={entry.favBest || undefined}
                worstRank={entry.leastBest || undefined}
                highlight={'net'}
              />
            </div>
          );
        })}
      </div>
    </section>
  );
}
