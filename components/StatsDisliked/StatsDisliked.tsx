'use client';
import { getTotalScore } from '@/lib/random';
import { useEffect, useState } from 'react';
import { MANGAS } from '@/common/mangas';
import { useSurveyStore } from '@/store';
import { StatItem } from '../StatItem';
import { reorderScores } from '@/lib/utils';

interface StatItemProps {
  id: string;
  title: string;
  avatar: string;
  score: number;
  team: string;
}

export default function StatsDisliked() {
  const [stats, setStats] = useState<Array<StatItemProps>>([]);
  const [totalScore, setTotalScore] = useState<number>(0);
  const { survey } = useSurveyStore();

  useEffect(() => {
    const data: Array<StatItemProps> = [];

    Object.keys(survey.least_favorite_chapters).forEach((key) => {
      data.push({
        id: MANGAS[key].id,
        title: MANGAS[key].title,
        avatar: MANGAS[key].avatar,
        score: survey.least_favorite_chapters[key],
        team: MANGAS[key].team,
      });
    });

    const sortData = data.sort((a, b) => b.score - a.score);

    setStats(sortData);
    setTotalScore(getTotalScore(data.map((item) => item.score)));
  }, [survey]);

  const positionScore = reorderScores(survey.least_favorite_chapters);

  return (
    <section className="w-full px-medium sm:px-4xlarge md:px-5xlarge md:py-8xlarge lg:px-9xlarge xlg:px-0 py-2xlarge">
      <div className="mx-auto block w-full max-w-[1040px]">
        <div className="flex flex-col gap-large">
          <h2 className="text-center font-bold text-3xl">
            ¿Cuál ha sido el capitulo que menos ha gustado de la semana?
          </h2>
          <p className="text-center font-bold text-xl text-gray-500">
            Total de votos: {totalScore}
          </p>
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
