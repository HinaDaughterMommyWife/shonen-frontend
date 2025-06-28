'use client';

import { getTotalScore } from '@/lib/random';
import { useMemo } from 'react';
import { useSurveyStore } from '@/store';
import { MANGAS } from '@/common/mangas';
import { StatItem } from '../StatItem';
import { reorderScores } from '@/lib/utils';

interface StatItemProps {
  id: string;
  title: string;
  avatar: string;
  score: number;
  team: string;
}

export default function StatsLiked() {
  const { survey } = useSurveyStore();

  const stats = useMemo(() => {
    const data: Array<StatItemProps> = Object.keys(survey.favorite_chapters).map((key) => ({
      id: MANGAS[key].id,
      title: MANGAS[key].title,
      avatar: MANGAS[key].avatar,
      score: survey.favorite_chapters[key],
      team: MANGAS[key].team,
    }));

    return data.sort((a, b) => b.score - a.score);
  }, [survey]);

  const totalScore = useMemo(() => getTotalScore(stats.map((item) => item.score)), [stats]);

  const positionScore = reorderScores(survey.favorite_chapters);

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-3xl">
            ¿Cuál ha sido el capitulo que más ha gustado de la semana?
          </h2>
          <p className="text-center font-bold text-xl text-gray-500">
            Total de votos: {totalScore}
          </p>
        </div>
        <div className="flex flex-col gap-medium pt-6xlarge text-sm text-gray-500/75">
          <span>
            Nota: Chequeo Automatico de los mangas publicados al <span className="font-bold text-yellow-500  animate-[rainbow_3s_linear_infinite]">60%</span>
            <img
              src={'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_613b4d23e2e448beb8394b2c9f06b6ac/animated/light/3.0'}
              alt={'shupogaki'}
              className="inline h-6 w-6 align-middle"
              loading="lazy"
            />
          </span>
          <span>
            <a
              href="https://x.com/AnimetrendsLA/status/1938590913007145222"
              target="_blank"
              className="underline"
            >
              <img
                src={'https://static-cdn.jtvnw.net/emoticons/v2/emotesv2_1fda4a1b40094c93af334f8b60868a7c/static/dark/3.0'}
                alt={'WhySoSerious'}
                className="inline h-5 w-5 align-middle"
                loading="lazy"
              /> 👉 (link)
            </a>
          </span>
          <span>- GuibelOrgulloPeruano</span>
        </div>
        <div className="flex flex-col gap-large pt-2xlarge">
          {stats.map((item, index) => (
            <StatItem
              id={item.id}
              key={index + '-stats'}
              title={item.title}
              value={item.score}
              maxValue={stats[0].score}
              icon={item.avatar}
              index={index}
              team={item.team}
              position={positionScore[item.id]}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
